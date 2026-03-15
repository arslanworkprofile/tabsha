import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import { getOrder } from '../../utils/api';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { getOrder(id).then(r => setOrder(r.data)).catch(() => {}); }, [id]);

  return (
    <div style={{ paddingTop: 140, paddingBottom: 80, minHeight: '70vh' }}>
      <div className="container-sm">
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
          <div style={{ width: 80, height: 80, background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--green)' }}>
            <FiCheckCircle size={40} />
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 400, marginBottom: 10 }}>Order Placed!</h1>
          <p style={{ color: 'var(--g5)', fontSize: 15, marginBottom: 6 }}>Thank you for shopping with Tabsha.</p>
          {order && <p style={{ color: 'var(--gold-d)', fontWeight: 600, fontSize: 14, marginBottom: 28 }}>Order #{order.orderNumber}</p>}
          {order && (
            <div style={{ background: 'var(--g1)', borderRadius: 8, padding: 20, marginBottom: 28, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Order Summary</div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--g5)' }}>
                  <span>{item.name} ×{item.quantity}</span>
                  <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--g2)', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span><span>PKR {order.total?.toLocaleString()}</span>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/my-orders" className="btn btn-outline"><FiPackage size={14} /> My Orders</Link>
            <Link to="/shop" className="btn btn-primary">Continue Shopping <FiArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
