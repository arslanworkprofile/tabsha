import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useWishlistStore } from '../../store';
import ProductCard from '../../components/shop/ProductCard';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  return (
    <div style={{ paddingTop: 140, paddingBottom: 80, minHeight: '70vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 400, letterSpacing: '-.02em' }}>Wishlist</h1>
          <span style={{ fontSize: 14, color: 'var(--g4)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--g4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <FiHeart size={48} /><h3 style={{ fontWeight: 400 }}>Your wishlist is empty</h3>
            <Link to="/shop" className="btn btn-primary">Explore Collection <FiArrowRight size={14}/></Link>
          </div>
        ) : (
          <div className="products-grid">{items.map(p => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </div>
    </div>
  );
}
