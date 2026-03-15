import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiEye } from 'react-icons/fi';
import { getMyOrders } from '../../utils/api';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  useEffect(() => { getMyOrders().then(r => setOrders(r.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div style={{ paddingTop: 140, paddingBottom: 80, minHeight: '70vh' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 400, marginBottom: 32, letterSpacing: '-.02em' }}>My Orders</h1>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 8 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--g4)' }}>
            <FiPackage size={48} style={{ marginBottom: 16 }} /><h3 style={{ fontWeight: 400 }}>No orders yet</h3>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: 'var(--white)', border: '1px solid var(--g2)', borderRadius: 8, padding: 18, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {order.items?.slice(0, 3).map((item, j) => (
                    <div key={j} style={{ width: 50, height: 62, borderRadius: 4, overflow: 'hidden', background: 'var(--g1)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--gold-d)' }}>{order.orderNumber}</div>
                  <div style={{ fontSize: 12, color: 'var(--g4)', marginTop: 3 }}>{order.items?.length} items · {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 5 }}>PKR {order.total?.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span className={`status-badge status-badge--${order.orderStatus}`}>{order.orderStatus}</span>
                  <Link to={`/order-confirmation/${order._id}`} className="btn btn-outline btn-sm"><FiEye size={13} /> View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
