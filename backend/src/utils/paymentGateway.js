/**
 * Payment Gateway Utility
 * 
 * This utility simulates Razorpay interactions for development and testing.
 * In a production environment, this would initialize the razorpay SDK
 * using environment variables and execute real API calls.
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing in environment variables');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const createRazorpayOrder = async (amount, receipt) => {
  try {
    const instance = getRazorpayInstance();
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: receipt
    };
    const order = await instance.orders.create(options);
    return order;
  } catch (error) {
    console.error('[PAYMENT GATEWAY] Create order failed:', error);
    throw error;
  }
};

const verifyRazorpayPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const text = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text.toString())
    .digest("hex");
  return expectedSignature === razorpay_signature;
};

const processRefund = async (paymentId, amount, returnId) => {
  try {
    const instance = getRazorpayInstance();
    const refund = await instance.payments.refund(paymentId, {
      amount: Math.round(amount * 100), // amount in paise
      notes: { returnId: returnId.toString() }
    });
    return refund;
  } catch (error) {
    console.error('[PAYMENT GATEWAY] Refund failed:', error);
    throw error;
  }
};

const validateWebhookSignature = (rawBody, signature, secret) => {
  if (!rawBody || !signature || !secret) return false;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody.toString())
    .digest("hex");
  return expectedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processRefund,
  validateWebhookSignature
};
