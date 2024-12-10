import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const router = express.Router();

router.post('/create-intent', async (req, res) => {
  try {
    const { paymentMethodId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { country: 'GB' },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status === 'requires_action') {
      res.json({ clientSecret: paymentIntent.client_secret });
    } else if (paymentIntent.status === 'succeeded') {
      res.json({ status: 'succeeded' });
    } else {
      res.json({ error: 'Payment intent failed' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});