const mongoose = require('mongoose');
const SellerWallet = require('../models/SellerWallet');
const DeliveryWallet = require('../models/DeliveryWallet');
const SellerPayout = require('../models/SellerPayout');
const DeliverySettlement = require('../models/DeliverySettlement');
const Seller = require('../models/Seller');

class WalletService {
  /**
   * Record a sale as pending when an order is placed
   */
  async recordPendingSale(order) {
    if (order.sellerType === 'Admin') return; // Skip admin sales commission

    let wallet = await SellerWallet.findOne({ seller: order.seller });
    if (!wallet) {
      wallet = await SellerWallet.create({ seller: order.seller });
    }

    const subtotal = order.totalPrice;
    // Calculate commission (10% flat rate)
    const commission = subtotal * 0.10;
    const netEarnings = subtotal - commission;

    // Record pending transaction
    wallet.transactions.push({
      amount: netEarnings,
      type: 'sale_credit',
      status: 'pending',
      description: `Pending earnings for Order ${order._id} (inclusive of 10% commission fee)`,
      referenceId: order._id,
      balanceAfter: wallet.withdrawableBalance // Balance doesn't increase yet
    });

    wallet.pendingBalance += netEarnings;
    await wallet.save();
  }

  /**
   * Promotes pending sale earnings to withdrawable once the order becomes Delivered
   */
  async clearPendingSale(orderId) {
    // Find all wallets containing this pending order transaction
    const wallets = await SellerWallet.find({ 'transactions.referenceId': orderId });
    
    for (const wallet of wallets) {
      const tx = wallet.transactions.find(t => t.referenceId.toString() === orderId.toString() && t.status === 'pending');
      if (tx) {
        const newWithdrawable = wallet.withdrawableBalance + tx.amount;
        
        await SellerWallet.updateOne(
          { 
            _id: wallet._id, 
            "transactions._id": tx._id 
          },
          {
            $set: { 
              "transactions.$.status": "cleared",
              "transactions.$.balanceAfter": newWithdrawable
            },
            $inc: {
              pendingBalance: -tx.amount,
              withdrawableBalance: tx.amount,
              totalEarnings: tx.amount
            }
          }
        );
      }
    }
  }

  /**
   * Records a refund deduction on returned orders
   */
  async recordRefundDeduction(order, refundAmount) {
    // Deduct proportionally (including 10% commission recovery)
    const commissionRecovery = Number((refundAmount * 0.10).toFixed(2));
    const netDeduction = Number((refundAmount - commissionRecovery).toFixed(2));

    // Update atomically and get the new balance (upsert if no wallet exists yet)
    const wallet = await SellerWallet.findOneAndUpdate(
      { seller: order.seller },
      { $inc: { withdrawableBalance: -netDeduction } },
      { returnDocument: 'after', upsert: true }
    );

    const newBalance = Number(wallet.withdrawableBalance.toFixed(2));

    // Atomically push the transaction log
    await SellerWallet.updateOne(
      { seller: order.seller },
      {
        $push: {
          transactions: {
            amount: -netDeduction,
            type: 'refund_debit',
            status: 'cleared',
            description: `Deduction for returned items in Order ${order._id}`,
            referenceId: order._id,
            balanceAfter: newBalance
          }
        }
      }
    );
  }

  /**
   * Initiates a withdrawal payout request for sellers
   */
  async requestSellerPayout(sellerId, amount, customBankDetails = null) {
    if (amount < 500) {
      throw new Error('Minimum withdrawal amount is ₹500.');
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) throw new Error('Seller profile not found.');

    const hasProfileBankDetails = seller.bankDetails && seller.bankDetails.accountNumber && seller.bankDetails.accountNumber.trim() !== '';
    const hasCustomBankDetails = customBankDetails && customBankDetails.accountNumber && customBankDetails.accountNumber.trim() !== '';

    if (!hasCustomBankDetails && !hasProfileBankDetails) {
      throw new Error('Please configure your bank details in your profile or provide valid bank details with the withdrawal request.');
    }

    const bankDetails = hasCustomBankDetails ? customBankDetails : seller.bankDetails;

    // 1. Debit wallet withdrawable balance atomically to prevent double-spending race conditions
    const wallet = await SellerWallet.findOneAndUpdate(
      { seller: sellerId, withdrawableBalance: { $gte: amount } },
      { $inc: { withdrawableBalance: -amount } },
      { returnDocument: 'after' }
    );

    if (!wallet) {
      throw new Error('Insufficient withdrawable balance.');
    }

    // 2. Create the SellerPayout document
    let payoutRequest;
    try {
      payoutRequest = await SellerPayout.create({
        seller: sellerId,
        amount,
        status: 'requested',
        bankDetails: {
          accountHolderName: bankDetails.accountHolderName,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          bankName: bankDetails.bankName
        }
      });
    } catch (createErr) {
      // Rollback the atomic balance decrement if the database fails to create the payout
      await SellerWallet.updateOne(
        { seller: sellerId },
        { $inc: { withdrawableBalance: amount } }
      );
      throw createErr;
    }

    // 3. Atomically record the transaction in the wallet ledger
    const newBalance = Number(wallet.withdrawableBalance.toFixed(2));
    await SellerWallet.updateOne(
      { seller: sellerId },
      {
        $push: {
          transactions: {
            amount: -amount,
            type: 'payout_debit',
            status: 'pending',
            description: `Payout request created. Request ID: ${payoutRequest._id}`,
            referenceId: payoutRequest._id,
            balanceAfter: newBalance
          }
        }
      }
    );

    return payoutRequest;
  }

  /**
   * Process and approve seller payout
   */
  async approveSellerPayout(payoutId, transactionReference) {
    const payout = await SellerPayout.findById(payoutId);
    if (!payout || payout.status !== 'requested') {
      throw new Error('Payout request not found or already processed.');
    }

    payout.status = 'completed';
    payout.transactionReference = transactionReference;
    await payout.save();

    // Clear transaction status inside wallet ledger
    const wallet = await SellerWallet.findOne({ seller: payout.seller });
    if (wallet) {
      const tx = wallet.transactions.find(t => t.referenceId.toString() === payoutId.toString());
      if (tx) {
        tx.status = 'cleared';
        await wallet.save();
      }
    }
    return payout;
  }

  /**
   * Reject a seller payout request and refund the funds atomically
   */
  async rejectSellerPayout(payoutId, adminNotes = '') {
    // 1. Transition payout status atomically to 'rejected' to prevent race conditions during admin approvals/rejections
    const payout = await SellerPayout.findOneAndUpdate(
      { _id: payoutId, status: { $in: ['requested', 'processing'] } },
      { $set: { status: 'rejected', adminNotes } },
      { returnDocument: 'after' }
    );

    if (!payout) {
      throw new Error('Payout request not found, or it has already been processed.');
    }

    // 2. Refund the funds to the seller's withdrawable balance atomically
    const wallet = await SellerWallet.findOneAndUpdate(
      { seller: payout.seller },
      { $inc: { withdrawableBalance: payout.amount } },
      { returnDocument: 'after' }
    );

    if (wallet) {
      // 3. Atomically update the transaction status inside the ledger to 'cancelled'
      const newBalance = Number(wallet.withdrawableBalance.toFixed(2));
      
      await SellerWallet.updateOne(
        { 
          seller: payout.seller, 
          "transactions.referenceId": payoutId 
        },
        {
          $set: { 
            "transactions.$.status": "cancelled",
            "transactions.$.balanceAfter": newBalance,
            "transactions.$.description": `Payout request rejected & refunded. Notes: ${adminNotes}`
          }
        }
      );
    }

    return payout;
  }

  /**
   * Record delivery partner earnings & COD liability on order delivery completion
   */
  async recordDeliveryEarning(deliveryPartnerId, orderId, isCod, totalPrice) {
    let wallet = await DeliveryWallet.findOne({ deliveryPartner: deliveryPartnerId });
    if (!wallet) {
      wallet = await DeliveryWallet.create({ deliveryPartner: deliveryPartnerId });
    }

    const deliveryFee = 50; // standard delivery pay of ₹50

    // Credit delivery fee
    wallet.earningsBalance += deliveryFee;
    wallet.transactions.push({
      amount: deliveryFee,
      type: 'delivery_fee_credit',
      description: `Delivery fee earning for Order ${orderId}`,
      referenceId: orderId,
      balanceAfter: wallet.earningsBalance
    });

    // Credit COD liability if cash was collected
    if (isCod) {
      wallet.codCollectionLiability += totalPrice;
      wallet.transactions.push({
        amount: totalPrice,
        type: 'cod_cash_collected',
        description: `COD Cash collected from customer for Order ${orderId}`,
        referenceId: orderId,
        balanceAfter: wallet.earningsBalance // earnings balance remains unaffected by COD liability
      });
    }

    await wallet.save();
  }

  /**
   * Logs a delivery boy cash deposit settlement to Admin
   */
  async recordCodDeposit(deliveryPartnerId, amount, notes) {
    const wallet = await DeliveryWallet.findOne({ deliveryPartner: deliveryPartnerId });
    if (!wallet || wallet.codCollectionLiability < amount) {
      throw new Error('Deposit amount exceeds current COD cash liability.');
    }

    const settlement = await DeliverySettlement.create({
      deliveryPartner: deliveryPartnerId,
      type: 'cod_deposit',
      amount,
      status: 'completed',
      notes
    });

    wallet.codCollectionLiability = Number((wallet.codCollectionLiability - amount).toFixed(2));
    wallet.transactions.push({
      amount: -amount,
      type: 'cod_settlement_to_admin',
      description: `Cash deposit settlement to Admin. Settlement ID: ${settlement._id}`,
      referenceId: settlement._id,
      balanceAfter: wallet.earningsBalance
    });

    await wallet.save();
    return settlement;
  }
}

module.exports = new WalletService();
