import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTruck, FiRefreshCw, FiShield, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProductBySlug } from '../../utils/api';
import { useCartStore, useWishlistStore } from '../../store';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const FALLBACK = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  useEffect(() => {
    setLoading(true);
    setMainImg(0);
    getProductBySlug(slug)
      .then((r) => {
        const p = r.data;
        setProduct(p);
        const sizes = [...new Set(p.variants?.map((v) => v.size))];
        const colors = [...new Set(p.variants?.map((v) => v.color))];
        if (sizes[0]) setSelectedSize(sizes[0]);
        if (colors[0]) setSelectedColor(colors[0]);
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ paddingTop: 128, paddingBottom: 80 }}>
      <div className="container">
        <div className="pd-skeleton">
          <div className="pd-skeleton-imgs">
            <div className="skeleton" style={{ width: 80, height: 400, borderRadius: 8, flexShrink: 0 }} />
            <div className="skeleton" style={{ flex: 1, aspectRatio: '3/4', borderRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 20 }}>
            {[60, 200, 120, 80, 160].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: i === 1 ? 40 : 16, width: w + 'px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ paddingTop: 140, textAlign: 'center', padding: 100 }}>
      <h2>Product not found</h2>
      <Link to="/shop" className="btn btn-outline" style={{ marginTop: 20 }}>Back to Shop</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [{ url: FALLBACK }];
  const sizes = [...new Set(product.variants?.map((v) => v.size))].filter(Boolean);
  const colors = [...new Set(product.variants?.map((v) => v.color))].filter(Boolean);
  const colorMap = {};
  product.variants?.forEach((v) => { if (v.color && v.colorCode) colorMap[v.color] = v.colorCode; });
  const selectedVariant = product.variants?.find((v) => v.size === selectedSize && v.color === selectedColor);
  const inStock = !selectedVariant || selectedVariant.stock > 0;
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const isWishlisted = has(product._id);

  const handleAdd = () => {
    if (sizes.length && !selectedSize) return toast.error('Please select a size');
    if (colors.length && !selectedColor) return toast.error('Please select a color');
    addItem(product, qty, selectedSize, selectedColor, colorMap[selectedColor] || '');
    toast.success(`${product.name} added to cart!`);
  };

  const prevImg = () => setMainImg((n) => (n === 0 ? images.length - 1 : n - 1));
  const nextImg = () => setMainImg((n) => (n === images.length - 1 ? 0 : n + 1));

  return (
    <div style={{ paddingTop: 120 }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          {product.category && <><span>/</span><Link to={`/shop/${product.category.slug}`}>{product.category.name}</Link></>}
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="pd-grid">
          {/* ── Images ── */}
          <div className="pd-images">
            {/* Thumbs */}
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb${i === mainImg ? ' pd-thumb--active' : ''}`}
                  onClick={() => setMainImg(i)}
                >
                  <img src={img.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="pd-main-img">
              <img src={images[mainImg]?.url || FALLBACK} alt={product.name} />
              {discount > 0 && <span className="pd-discount-badge">-{discount}%</span>}
              {images.length > 1 && (
                <>
                  <button className="pd-nav pd-nav--prev" onClick={prevImg} aria-label="Previous"><FiChevronLeft size={20} /></button>
                  <button className="pd-nav pd-nav--next" onClick={nextImg} aria-label="Next"><FiChevronRight size={20} /></button>
                </>
              )}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="pd-info">
            {product.category && (
              <Link to={`/shop/${product.category.slug}`} className="pd-category">{product.category.name}</Link>
            )}
            <h1 className="pd-title">{product.name}</h1>

            {/* Rating */}
            {product.ratings?.count > 0 && (
              <div className="pd-rating">
                <span className="pd-stars">{'★'.repeat(Math.round(product.ratings.average))}{'☆'.repeat(5 - Math.round(product.ratings.average))}</span>
                <span className="pd-rating-count">({product.ratings.count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">PKR {product.price?.toLocaleString()}</span>
              {product.comparePrice && <span className="pd-compare">PKR {product.comparePrice?.toLocaleString()}</span>}
              {discount > 0 && <span className="badge badge-red">Save {discount}%</span>}
            </div>

            {product.shortDescription && <p className="pd-short-desc">{product.shortDescription}</p>}

            <hr className="pd-divider" />

            {/* Colors */}
            {colors.length > 0 && (
              <div className="pd-option-group">
                <div className="pd-option-label">
                  Color: <strong>{selectedColor}</strong>
                </div>
                <div className="pd-colors">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`pd-color-btn${selectedColor === color ? ' active' : ''}`}
                      style={{ '--c': colorMap[color] || '#000' }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="pd-option-group">
                <div className="pd-option-label">
                  Size: <strong>{selectedSize}</strong>
                  <Link to="/size-guide" className="pd-size-guide">Size Guide →</Link>
                </div>
                <div className="pd-sizes">
                  {sizes.map((size) => {
                    const v = product.variants?.find((v) => v.size === size && (!selectedColor || v.color === selectedColor));
                    const oos = v && v.stock === 0;
                    return (
                      <button
                        key={size}
                        className={`pd-size-btn${selectedSize === size ? ' active' : ''}${oos ? ' oos' : ''}`}
                        onClick={() => !oos && setSelectedSize(size)}
                        disabled={oos}
                        title={oos ? 'Out of stock' : size}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            {selectedVariant && (
              <p className={`pd-stock pd-stock--${selectedVariant.stock === 0 ? 'out' : selectedVariant.stock < 5 ? 'low' : 'in'}`}>
                {selectedVariant.stock === 0 ? '✗ Out of Stock' : selectedVariant.stock < 5 ? `⚡ Only ${selectedVariant.stock} left!` : '✓ In Stock'}
              </p>
            )}

            {/* Add to cart row */}
            <div className="pd-actions">
              <div className="pd-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
              </div>
              <button className="btn btn-primary pd-add-btn" onClick={handleAdd} disabled={!inStock}>
                <FiShoppingBag size={16} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                className={`pd-wish${isWishlisted ? ' pd-wish--active' : ''}`}
                onClick={() => { toggle(product); toast(isWishlisted ? 'Removed from wishlist' : 'Saved!', { icon: isWishlisted ? '💔' : '❤️' }); }}
                aria-label="Wishlist"
              >
                <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              <div><FiTruck size={14} /><span>Free delivery on orders over PKR 3,000</span></div>
              <div><FiRefreshCw size={14} /><span>7-day easy returns</span></div>
              <div><FiShield size={14} /><span>Secure checkout guaranteed</span></div>
            </div>

            <hr className="pd-divider" />

            {/* Tabs */}
            <div className="pd-tabs">
              {['description', 'details', 'reviews'].map((t) => (
                <button
                  key={t}
                  className={`pd-tab${tab === t ? ' active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'reviews' && product.ratings?.count > 0 && ` (${product.ratings.count})`}
                </button>
              ))}
            </div>

            <div className="pd-tab-content">
              {tab === 'description' && (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--g5)' }}>{product.description}</p>
              )}
              {tab === 'details' && (
                <div className="pd-specs">
                  {product.fabric && <div className="pd-spec"><span>Fabric</span><span>{product.fabric}</span></div>}
                  {product.careInstructions && <div className="pd-spec"><span>Care</span><span>{product.careInstructions}</span></div>}
                  {product.tags?.length > 0 && (
                    <div className="pd-spec">
                      <span>Tags</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {product.tags.map((t) => <span key={t} className="badge badge-gray">{t}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {tab === 'reviews' && (
                <div className="pd-reviews">
                  {product.reviews?.length === 0
                    ? <p style={{ color: 'var(--g4)', fontSize: 14 }}>No reviews yet. Be the first!</p>
                    : product.reviews?.map((r, i) => (
                        <div key={i} className="pd-review">
                          <div className="pd-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                          <p style={{ fontSize: 14, color: 'var(--g5)', margin: '6px 0' }}>{r.comment}</p>
                          <span style={{ fontSize: 12, color: 'var(--g4)' }}>— {r.name}</span>
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
