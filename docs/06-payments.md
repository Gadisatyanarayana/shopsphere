# 06. Razorpay Integration & Dev Fallback Mode

## Workflow
1. Client sends amount to `POST /api/payment/create-order`.
2. Backend creates Razorpay order object using Razorpay Node SDK.
3. Razorpay Checkout modal opens on React frontend.
4. User completes payment -> Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`.
5. Backend verifies signature using HMAC SHA256:
```javascript
const body = razorpay_order_id + '|' + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(body.toString())
  .digest('hex');
```

## Safe Development Mode
If Razorpay API keys are omitted from `.env`, ShopSphere automatically activates **Dev Payment Fallback Mode**, generating mock transaction IDs so developers and evaluators can test complete checkout without setting up Razorpay accounts.
