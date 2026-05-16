/**
 * Payment Gateway Utility
 * 
 * This utility simulates Razorpay interactions for development and testing.
 * In a production environment, this would initialize the razorpay SDK
 * using environment variables and execute real API calls.
 */

const processRefund = async (paymentId, amount, returnId) => {
  return new Promise((resolve, reject) => {
    console.log(`[PAYMENT GATEWAY] Initiating refund for Payment ID: ${paymentId || 'N/A'}`);
    console.log(`[PAYMENT GATEWAY] Amount: ₹${amount}`);
    console.log(`[PAYMENT GATEWAY] Return ID: ${returnId}`);

    // Simulate network delay
    setTimeout(() => {
      // Since the frontend is simulating Razorpay, we don't have a real paymentId.
      // We will mock a successful refund response.
      const mockRefundResponse = {
        id: `rfnd_simulated_${Date.now()}`,
        entity: "refund",
        amount: amount * 100, // Razorpay uses paise
        currency: "INR",
        payment_id: paymentId || `pay_simulated_${Date.now()}`,
        notes: {
          returnId: returnId.toString()
        },
        receipt: `receipt_${returnId}`,
        acquirer_data: {
          arn: `arn_${Math.floor(Math.random() * 1000000000)}`
        },
        created_at: Math.floor(Date.now() / 1000),
        batch_id: null,
        status: "processed",
        speed_processed: "normal",
        speed_requested: "normal"
      };

      console.log(`[PAYMENT GATEWAY] Refund processed successfully: ${mockRefundResponse.id}`);
      resolve(mockRefundResponse);
      
      // In a real implementation with valid keys, you would do:
      /*
      try {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const refund = await instance.payments.refund(paymentId, {
          amount: amount * 100, // amount in paise
          notes: { returnId: returnId.toString() }
        });
        resolve(refund);
      } catch (error) {
        console.error('[PAYMENT GATEWAY] Refund failed:', error);
        reject(error);
      }
      */
    }, 1000);
  });
};

module.exports = {
  processRefund
};
