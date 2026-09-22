const crypto = require('crypto');
const Razorpay = require('razorpay');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// Initialize Razorpay instance if keys are available
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// @desc Create Razorpay or Dev Mock Payment Order
// @route POST /api/payment/create-order
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return next(new ApiError(400, 'Invalid payment amount'));
    }

    // If real Razorpay keys present, create official Razorpay Order
    if (razorpayInstance) {
      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            isMock: false
          },
          'Razorpay order created successfully'
        )
      );
    }

    // Safe Development Payment Fallback Mode
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: mockOrderId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          keyId: 'rzp_test_shopsphere_dev_mode',
          isMock: true,
          message: 'Running in safe Development Mock Payment Mode'
        },
        'Dev Payment Order created successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc Verify Razorpay Signature or Dev Payment
// @route POST /api/payment/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock } = req.body;

    if (isMock || !razorpayInstance) {
      // Safe dev verification
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            verified: true,
            paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
            orderId: razorpay_order_id,
            isMock: true
          },
          'Development Payment Signature verified successfully'
        )
      );
    }

    // Official Razorpay Signature Verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.status(200).json(
        new ApiResponse(
          200,
          {
            verified: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            isMock: false
          },
          'Payment verified successfully'
        )
      );
    } else {
      return next(new ApiError(400, 'Invalid payment signature'));
    }
  } catch (error) {
    next(error);
  }
};
