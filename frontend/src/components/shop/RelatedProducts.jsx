import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { getProducts } from '../../utils/api';
import ProductCard from './ProductCard';

export default function RelatedProducts({ categoryId, currentProductId, limit = 4 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    getProducts({ category: categoryId, limit: limit + 1 })
      .then(r => {
        const filtered = (r.data.products || []).filter(p => p._id !== currentProductId);
        setProducts(filtered.slice(0, limit));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId, limit]);

  if (!loading && products.length === 0) return null;

  return (
    <section style={{ padding: '60px 0', background: 'var(--gray-100)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '36px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}>
            You May Also Like
          </h2>
          <Link
            to="/shop"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 500,
              color: 'var(--gold-dark)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            View All <FiArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: '8px' }} />
                <div className="skeleton" style={{ height: '14px', marginTop: '12px', width: '70%' }} />
                <div className="skeleton" style={{ height: '13px', marginTop: '8px', width: '40%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
