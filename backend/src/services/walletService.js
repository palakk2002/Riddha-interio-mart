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
        tx.status = 'cleared';
        
        wallet.pendingBalance = Math.max(0, wallet.pendingBalance - tx.amount);
        wallet.withdrawableBalance += tx.amount;
        wallet.totalEarnings += tx.amount;
        
        tx.balanceAfter = wallet.withdrawableBalance;
        
        // Save using clean indexing update
        await wallet.save();
      }
    }
  }

  /**
   * Records a refund deduction on returned orders
   */
  async recordRefundDeduction(order, refundAmount) {
    let wallet = await SellerWallet.findOne({ seller: order.seller });
    if (!wallet) return;

    // Deduct proportionally (including 10% commission recovery)
    const commissionRecovery = refundAmount * 0.10;
    const netDeduction = refundAmount - commissionRecovery;

    wallet.withdrawableBalance = Number((wallet.withdrawableBalance - netDeduction).toFixed(2));
    
    wallet.transactions.push({
      amount: -netDeduction,
      type: 'refund_debit',
      status: 'cleared',
      description: `Deduction for returned items in Order ${order._id}`,
      referenceId: order._id,
      balanceAfter: wallet.withdrawableBalance
    });

    await wallet.save();
  }

  /**
   * Initiates a withdrawal payout request for sellers
   */
  async requestSellerPayout(sellerId, amount, customBankDetails = null) {
    const wallet = await SellerWallet.findOne({ seller: sellerId });
    if (!wallet || wallet.withdrawableBalance < amount) {
      throw new Error('Insufficient withdrawable balance.');
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) throw new Error('Seller profile not found.');

    const bankDetails = customBankDetails || seller.bankDetails || {
      accountHolderName: seller.fullName || 'Fintech Seller',
      accountNumber: '999988887777',
      ifscCode: 'UTIB0000001',
      bankName: 'Axis Bank'
    };

    // Debit wallet withdrawable balance instantly to prevent double-spending race conditions
    wallet.withdrawableBalance = Number((wallet.withdrawableBalance - amount).toFixed(2));

    const payoutRequest = await SellerPayout.create({
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

    wallet.transactions.push({
      amount: -amount,
      type: 'payout_debit',
      status: 'pending',
      description: `Payout request created. Request ID: ${payoutRequest._id}`,
      referenceId: payoutRequest._id,
      balanceAfter: wallet.withdrawableBalance
    });

    await wallet.save();
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
