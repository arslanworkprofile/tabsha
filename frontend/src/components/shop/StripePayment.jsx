import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// Load Stripe outside component to avoid recreating on each render
const stripePromise = process.env.REACT_APP_STRIPE_KEY
  ? loadStripe(process.env.REACT_APP_STRIPE_KEY)
  : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#0a0a0a',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '14px',
      '::placeholder': { color: '#a0a09a' },
    },
    invalid: { color: '#c0392b' },
  },
};

function StripeForm({ amount, orderId, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    api.post('/payment/create-intent', { amount, orderId })
      .then(r => setClientSecret(r.data.clientSecret))
      .catch(err => {
        const msg = err.response?.data?.message || 'Failed to initialize payment';
        toast.error(msg);
        onError?.(msg);
      });
  }, [amount, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        onError?.(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess?.(result.paymentIntent);
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.');
      onError?.(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        padding: '14px 16px',
        border: '1.5px solid var(--gray-300)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '16px',
        transition: 'var(--transition)',
      }}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="submit"
        className="btn btn-gold"
        style={{ width: '100%', padding: '14px' }}
        disabled={!stripe || processing || !clientSecret}
      >
        {processing
          ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
          : `Pay PKR ${amount?.toLocaleString()}`
        }
      </button>

      <p style={{ fontSize: '11px', color: 'var(--gray-400)', textAlign: 'center', marginTop: '10px' }}>
        🔒 Secured by Stripe · Your card details are never stored
      </p>
    </form>
  );
}

/**
 * Stripe Payment Wrapper
 * Usage:
 *   <StripePayment amount={4500} orderId="abc123" onSuccess={handleSuccess} />
 */
export default function StripePayment({ amount, orderId, onSuccess, onError }) {
  if (!stripePromise) {
    return (
      <div style={{
        padding: '16px',
        background: 'var(--gray-100)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '13px',
        color: 'var(--gray-500)',
        textAlign: 'center',
      }}>
        ⚠️ Stripe is not configured. Add <code>REACT_APP_STRIPE_KEY</code> to your .env file.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeForm
        amount={amount}
        orderId={orderId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
