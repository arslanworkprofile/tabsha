import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useCartStore, useWishlistStore } from '../../store';
import toast from 'react-hot-toast';
import './ProductCard.css';

const FALLBACK = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70&auto=format';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const addItem  = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const wishlisted = has(product._id);

  const img1 = product.images?.[0]?.url || FALLBACK;
  const img2 = product.images?.[1]?.url || img1;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const quickAdd = (e) => {
    e.preventDefault();
    addItem(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
    toast.success('Added to cart!');
  };

  const onWishlist = (e) => {
    e.preventDefault();
    toggle(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist!', {
      icon: wishlisted ? '💔' : '❤️',
    });
  };

  return (
    <div
      className="pc"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="pc-img-wrap">
        <img
          src={hovered ? img2 : img1}
          alt={product.name}
          className="pc-img"
          loading="lazy"
          width="400"
          height="533"
        />

        {/* Badges */}
        <div className="pc-badges">
          {product.isNewArrival && <span className="pc-badge pc-badge--new">New</span>}
          {discount > 0 && <span className="pc-badge pc-badge--sale">-{discount}%</span>}
          {product.isBestseller && <span className="pc-badge pc-badge--hot">Hot</span>}
        </div>

        {/* Hover overlay */}
        <div className={`pc-overlay${hovered ? ' pc-overlay--show' : ''}`}>
          <button className="pc-quick-add" onClick={quickAdd}>
            <FiShoppingBag size={14} /> Quick Add
          </button>
        </div>

        {/* Wishlist */}
        <button
          className={`pc-wish${wishlisted ? ' pc-wish--active' : ''}`}
          onClick={onWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className="pc-info">
        {product.category?.name && (
          <span className="pc-cat">{product.category.name}</span>
        )}
        <Link to={`/product/${product.slug}`} className="pc-name">{product.name}</Link>

        {/* Color dots */}
        {product.variants?.length > 0 && (
          <div className="pc-colors">
            {[...new Map(product.variants.map((v) => [v.colorCode, v])).values()]
              .slice(0, 5)
              .map((v, i) => (
                <span
                  key={i}
                  className="pc-color-dot"
                  style={{ background: v.colorCode }}
                  title={v.color}
                />
              ))}
          </div>
        )}

        <div className="pc-price-row">
          <span className="pc-price">PKR {product.price?.toLocaleString()}</span>
          {product.comparePrice && (
            <span className="pc-compare">PKR {product.comparePrice?.toLocaleString()}</span>
          )}
        </div>

        {product.ratings?.count > 0 && (
          <div className="pc-rating">
            <span className="pc-stars">
              {'★'.repeat(Math.round(product.ratings.average))}
              {'☆'.repeat(5 - Math.round(product.ratings.average))}
            </span>
            <span className="pc-rating-count">({product.ratings.count})</span>
          </div>
        )}
      </div>
    </div>
  );
}
