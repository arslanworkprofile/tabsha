import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCartStore, useAuthStore } from '../../store';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 250;
  const total = subtotal + shipping;

  if (!items.length) return (
    <div style={{ paddingTop: 140, minHeight: '70vh' }}>
      <div className="container">
        <div className="cart-empty">
          <FiShoppingBag size={52} />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping <FiArrowRight size={15}/></Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div className="container">
        <div className="cart-hdr">
          <h1>Shopping Cart</h1>
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const key = `${item._id}-${item.selectedSize}-${item.selectedColor}`;
              return (
                <div key={key} className="cart-item">
                  <img src={item.images?.[0]?.url || ''} alt={item.name} className="cart-item-img" loading="lazy" />
                  <div className="cart-item-info">
                    <Link to={`/product/${item.slug}`} className="cart-item-name">{item.name}</Link>
                    <div className="cart-item-meta">
                      {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                    </div>
                    <div className="cart-item-bottom">
                      <div className="cart-qty">
                        <button onClick={() => updateQty(key, item.qty - 1)} disabled={item.qty <= 1}><FiMinus size={12}/></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(key, item.qty + 1)}><FiPlus size={12}/></button>
                      </div>
                      <strong className="cart-item-price">PKR {(item.price * item.qty).toLocaleString()}</strong>
                      <button className="cart-remove" onClick={() => removeItem(key)} aria-label="Remove"><FiTrash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              );
            })}
            <button className="cart-clear" onClick={() => { if (window.confirm('Clear cart?')) clearCart(); }}>Clear Cart</button>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="cs-rows">
              <div className="cs-row"><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></div>
              <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{color:'var(--green)'}}>Free</span> : `PKR ${shipping}`}</span></div>
              {shipping > 0 && (
                <div className="cs-progress">
                  <p>Add PKR {(3000 - subtotal).toLocaleString()} more for free shipping</p>
                  <div className="cs-bar"><div className="cs-bar-fill" style={{width:`${Math.min((subtotal/3000)*100,100)}%`}}/></div>
                </div>
              )}
            </div>
            <div className="cs-total"><span>Total</span><span>PKR {total.toLocaleString()}</span></div>
            <button className="btn btn-primary cs-checkout" onClick={() => user ? navigate('/checkout') : navigate('/login', {state:{from:{pathname:'/checkout'}}})}>
              {user ? 'Checkout' : 'Login to Checkout'} <FiArrowRight size={15}/>
            </button>
            <Link to="/shop" className="cs-continue">← Continue Shopping</Link>
            <div className="cs-payments">
              <p>Accepted Methods</p>
              <div>{['COD','EasyPaisa','JazzCash','Stripe'].map(m=><span key={m}>{m}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
