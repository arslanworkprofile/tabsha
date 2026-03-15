import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { useCartStore, useAuthStore } from '../../store';
import { createOrder } from '../../utils/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];
const PAYMENTS = [
  { id: 'cod',       label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
  { id: 'easypaisa', label: 'EasyPaisa',        desc: 'Mobile wallet payment' },
  { id: 'jazzcash',  label: 'JazzCash',         desc: 'Mobile wallet payment' },
  { id: 'stripe',    label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex via Stripe' },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPayment] = useState('cod');

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 250;
  const total = subtotal + shipping;

  const [addr, setAddr] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', zip: '', country: 'Pakistan',
  });

  const next = (e) => {
    e.preventDefault();
    if (step === 0) {
      const { name, phone, street, city, state, zip } = addr;
      if (!name || !phone || !street || !city || !state || !zip) return toast.error('Fill all shipping fields');
    }
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await createOrder({
        items: items.map((i) => ({
          product: i._id, name: i.name, image: i.images?.[0]?.url || '',
          price: i.price, quantity: i.qty,
          size: i.selectedSize, color: i.selectedColor, colorCode: i.selectedColorCode,
        })),
        shippingAddress: addr, paymentMethod, subtotal,
        shippingCost: shipping, discount: 0, tax: 0, total, notes,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div className="container-sm">
        <h1 className="co-title">Checkout</h1>

        {/* Stepper */}
        <div className="co-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`co-step${step >= i ? ' active' : ''}${step > i ? ' done' : ''}`}>
                <div className="co-step-dot">
                  {step > i ? <FiCheck size={14} /> : i + 1}
                </div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`co-step-line${step > i ? ' done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="co-layout">
          {/* Form Area */}
          <div className="co-form-area">
            {/* STEP 0: Shipping */}
            {step === 0 && (
              <form onSubmit={next}>
                <h2 className="co-section-title">Shipping Information</h2>
                <div className="co-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" value={addr.phone} placeholder="+92-XXX-XXXXXXX" onChange={(e) => setAddr({ ...addr, phone: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" value={addr.street} placeholder="House #, Street, Area" onChange={(e) => setAddr({ ...addr, street: e.target.value })} required />
                </div>
                <div className="co-grid-2" style={{ marginTop: 16 }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Province *</label>
                    <select className="form-select" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} required>
                      <option value="">Select Province</option>
                      {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK'].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="co-grid-2" style={{ marginTop: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Postal Code *</label>
                    <input className="form-input" value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" value="Pakistan" readOnly style={{ background: 'var(--g1)' }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary co-btn" style={{ marginTop: 24 }}>
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div>
                <h2 className="co-section-title">Payment Method</h2>
                <div className="co-payments">
                  {PAYMENTS.map((m) => (
                    <label key={m.id} className={`co-payment${paymentMethod === m.id ? ' active' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPayment(m.id)} style={{ display: 'none' }} />
                      <div className="co-radio">
                        {paymentMethod === m.id && <div className="co-radio-dot" />}
                      </div>
                      <div>
                        <strong>{m.label}</strong>
                        <span>{m.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea className="form-input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Custom measurements, special instructions…" />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary co-btn" onClick={() => setStep(2)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div>
                <h2 className="co-section-title">Review Your Order</h2>
                <div className="co-review-blocks">
                  <div className="co-review-block">
                    <div className="co-review-label">Shipping To <button className="co-edit-btn" onClick={() => setStep(0)}>Edit</button></div>
                    <p>{addr.name} · {addr.phone}</p>
                    <p>{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                  <div className="co-review-block">
                    <div className="co-review-label">Payment <button className="co-edit-btn" onClick={() => setStep(1)}>Edit</button></div>
                    <p>{PAYMENTS.find((m) => m.id === paymentMethod)?.label}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-gold co-btn" onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }} /> : '✓ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="co-summary">
            <h3>Order Summary</h3>
            <div className="co-summary-items">
              {items.map((item) => (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="co-summary-item">
                  <div className="co-summary-img">
                    <img src={item.images?.[0]?.url} alt={item.name} loading="lazy" />
                    <span>{item.qty}</span>
                  </div>
                  <div className="co-summary-info">
                    <strong>{item.name}</strong>
                    <small>{[item.selectedSize, item.selectedColor].filter(Boolean).join(' / ')}</small>
                  </div>
                  <span className="co-summary-price">PKR {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="co-summary-totals">
              <div><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></div>
              <div><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--green)' }}>Free</span> : `PKR ${shipping}`}</span></div>
              <div className="co-summary-total"><span>Total</span><span>PKR {total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
