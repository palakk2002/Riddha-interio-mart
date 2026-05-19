const SellerWallet = require('../models/SellerWallet');
const DeliveryWallet = require('../models/DeliveryWallet');
const SellerPayout = require('../models/SellerPayout');
const DeliverySettlement = require('../models/DeliverySettlement');
const walletService = require('../services/walletService');

/**
 * @desc    Get current seller wallet balances and transactions
 * @route   GET /api/wallets/seller/me
 * @access  Private (Seller)
 */
exports.getSellerWallet = async (req, res, next) => {
  try {
    let wallet = await SellerWallet.findOne({ seller: req.user.id });
    if (!wallet) {
      wallet = await SellerWallet.create({ seller: req.user.id });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current delivery partner wallet balances and COD liabilities
 * @route   GET /api/wallets/delivery/me
 * @access  Private (Delivery)
 */
exports.getDeliveryWallet = async (req, res, next) => {
  try {
    let wallet = await DeliveryWallet.findOne({ deliveryPartner: req.user.id });
    if (!wallet) {
      wallet = await DeliveryWallet.create({ deliveryPartner: req.user.id });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Request a seller withdrawable earnings payout
 * @route   POST /api/wallets/seller/payout
 * @access  Private (Seller)
 */
exports.requestSellerWithdrawal = async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Please provide a valid withdrawal amount.' });
    }

    const payout = await walletService.requestSellerPayout(req.user.id, Number(amount), bankDetails);

    res.status(201).json({
      success: true,
      message: 'Payout request successfully submitted and escrow debited.',
      data: payout
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Approve and settle seller payout (Admin-only)
 * @route   POST /api/wallets/admin/payouts/:id/approve
 * @access  Private (Admin)
 */
exports.approvePayout = async (req, res, next) => {
  try {
    const { transactionReference, notes } = req.body;
    if (!transactionReference) {
      return res.status(400).json({ success: false, error: 'Please provide a valid transaction reference / UTR number.' });
    }

    const payout = await walletService.approveSellerPayout(req.params.id, transactionReference);
    
    if (notes) {
      payout.adminNotes = notes;
      await payout.save();
    }

    res.status(200).json({
      success: true,
      message: 'Seller payout successfully completed and UTR logged.',
      data: payout
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Log delivery boy cash settlement deposit to Admin
 * @route   POST /api/wallets/admin/delivery/cod-deposit
 * @access  Private (Admin)
 */
exports.depositCodLiability = async (req, res, next) => {
  try {
    const { deliveryPartnerId, amount, notes } = req.body;
    if (!deliveryPartnerId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Please provide deliveryPartnerId and a valid deposit amount.' });
    }

    const deposit = await walletService.recordCodDeposit(deliveryPartnerId, Number(amount), notes || 'Cash deposited directly to Admin cashier');

    res.status(200).json({
      success: true,
      message: 'Delivery partner COD collection deposit successfully confirmed.',
      data: deposit
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get platform financial oversight and analytics (Admin-only)
 * @route   GET /api/wallets/admin/analytics
 * @access  Private (Admin)
 */
exports.getAdminFinancialAnalytics = async (req, res, next) => {
  try {
    // 1. Total pending escrows and withdrawable holds across all sellers
    const sellerAgg = await SellerWallet.aggregate([
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$pendingBalance' },
          totalWithdrawable: { $sum: '$withdrawableBalance' },
          totalEarnings: { $sum: '$totalEarnings' }
        }
      }
    ]);

    // 2. Total delivery partner earnings and un-deposited cash liabilities
    const deliveryAgg = await DeliveryWallet.aggregate([
      {
        $group: {
          _id: null,
          totalDeliveryEarnings: { $sum: '$earningsBalance' },
          totalCodLiabilities: { $sum: '$codCollectionLiability' }
        }
      }
    ]);

    // 3. Admin commission aggregate calculations (total platform commission fees recorded in seller transaction ledgers)
    const commissionAgg = await SellerWallet.aggregate([
      { $unwind: '$transactions' },
      { $match: { 'transactions.type': 'sale_credit' } },
      {
        $group: {
          _id: null,
          grossPlatformSales: { $sum: { $divide: ['$transactions.amount', 0.90] } } // gross sum before 10% deduction
        }
      }
    ]);

    const grossSales = commissionAgg[0] ? commissionAgg[0].grossPlatformSales : 0;
    const totalCommissions = grossSales * 0.10;

    res.status(200).json({
      success: true,
      data: {
        sellers: sellerAgg[0] || { totalPending: 0, totalWithdrawable: 0, totalEarnings: 0 },
        delivery: deliveryAgg[0] || { totalDeliveryEarnings: 0, totalCodLiabilities: 0 },
        platform: {
          grossSales: Number(grossSales.toFixed(2)),
          totalCommissions: Number(totalCommissions.toFixed(2))
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
