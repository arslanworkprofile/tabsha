const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Only initialise Stripe if key is provided
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// @POST /api/payment/create-intent
// Creates a Stripe PaymentIntent for the given order total
router.post('/create-intent', protect, async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env' });
  }

  try {
    const { amount, currency = 'pkr', orderId } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit
      currency,
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || '',
        email: req.user.email,
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/payment/webhook
// Stripe webhook handler (configure in Stripe dashboard)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.json({ received: true });

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        const Order = require('../models/Order');
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          'paymentResult.id': paymentIntent.id,
          'paymentResult.status': 'succeeded',
          'paymentResult.update_time': new Date().toISOString(),
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        const Order = require('../models/Order');
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      }
      break;
    }
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
