import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getProducts, getCategories } from '../../utils/api';
import ProductCard from '../../components/shop/ProductCard';
import './HomePage.css';

const SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80&auto=format',
    tag: 'New Collection 2024', h1: 'Elegance', h2: 'Redefined',
    sub: 'Bespoke Pakistani fashion crafted with precision and artistry.',
    cta: 'Shop Now', link: '/shop'
  },
  {
    bg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1400&q=80&auto=format',
    tag: 'Bridal Couture', h1: 'Your Perfect', h2: 'Bridal Look',
    sub: 'Custom bridal wear made for your most special day.',
    cta: 'Shop Bridal', link: '/shop/bridal'
  },
  {
    bg: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&q=80&auto=format',
    tag: "Women's Collection", h1: 'Grace &', h2: 'Tradition',
    sub: 'Exquisite lawn suits, kurtas and designer wear for every occasion.',
    cta: 'Shop Women', link: '/shop/women'
  },
];

const PERKS = [
  { icon: '✦', title: 'Custom Stitching', desc: 'Tailored to your measurements' },
  { icon: '◈', title: 'Premium Fabrics', desc: 'Handpicked from top mills' },
  { icon: '◎', title: 'Free Delivery', desc: 'On orders above PKR 3,000' },
  { icon: '◇', title: 'Easy Returns', desc: '7-day hassle-free policy' },
];

const DEFAULT_CATS = [
  { _id: '1', name: 'Women',  slug: 'women',  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80&auto=format' },
  { _id: '2', name: 'Men',    slug: 'men',    image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=500&q=80&auto=format' },
  { _id: '3', name: 'Kids',   slug: 'kids',   image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&q=80&auto=format' },
  { _id: '4', name: 'Bridal', slug: 'bridal', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80&auto=format' },
  { _id: '5', name: 'Casual', slug: 'casual', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80&auto=format' },
  { _id: '6', name: 'Formal', slug: 'formal', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4769?w=500&q=80&auto=format' },
];

export default function HomePage() {
  const [slide, setSlide]       = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATS);
  const [loading, setLoading]   = useState(true);

  // Preload hero images
  useEffect(() => {
    SLIDES.forEach((s) => { const img = new Image(); img.src = s.bg; });
  }, []);

  // Rotate slides
  useEffect(() => {
    const t = setInterval(() => setSlide((n) => (n + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          getProducts({ newArrival: true, limit: 8 }),
          getCategories(),
        ]);
        if (!cancelled) {
          setProducts(pRes.data.products || []);
          if (cRes.data?.length) setCategories(cRes.data);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const s = SLIDES[slide];

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero">
        {SLIDES.map((sl, i) => (
          <div
            key={i}
            className={`hero-slide${i === slide ? ' hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${sl.bg})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-text" key={slide}>
            <span className="hero-tag">{s.tag}</span>
            <h1 className="hero-h1">{s.h1}<br />{s.h2}</h1>
            <p className="hero-sub">{s.sub}</p>
            <div className="hero-btns">
              <Link to={s.link} className="btn btn-gold">{s.cta} <FiArrowRight size={15} /></Link>
              <Link to="/shop" className="btn btn-ghost">View All</Link>
            </div>
          </div>
        </div>
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === slide ? ' hero-dot--active' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── PERKS ── */}
      <section className="perks">
        <div className="container">
          <div className="perks-grid">
            {PERKS.map((p) => (
              <div key={p.title} className="perk">
                <span className="perk-icon">{p.icon}</span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <div className="section-hdr">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/shop" className="section-link">All Collections <FiArrowRight size={13} /></Link>
          </div>
          <div className="cats-grid">
            {categories.slice(0, 6).map((cat, i) => (
              <Link
                key={cat._id}
                to={`/shop/${cat.slug}`}
                className={`cat-card${i === 0 ? ' cat-card--tall' : ''}`}
              >
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="cat-overlay">
                  <span>{cat.name}</span>
                  <FiArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="home-banner">
        <div className="home-banner-img">
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80&auto=format" alt="Pakistani Fashion" loading="lazy" />
        </div>
        <div className="home-banner-content">
          <span className="hero-tag" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>Exclusive</span>
          <h2>Custom Design<br />For Every Occasion</h2>
          <p>Share your vision and our master tailors will bring it to life.</p>
          <Link to="/shop" className="btn btn-gold">Start Your Order <FiArrowRight size={15} /></Link>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="section" style={{ background: 'var(--off)' }}>
        <div className="container">
          <div className="section-hdr">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop?new=true" className="section-link">See All <FiArrowRight size={13} /></Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 8 }} />
                  <div className="skeleton" style={{ height: 14, marginTop: 12, width: '70%' }} />
                  <div className="skeleton" style={{ height: 12, marginTop: 7, width: '40%' }} />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="home-empty">
              <p>Products will appear here once added from the admin panel.</p>
              <Link to="/admin" className="btn btn-outline" style={{ marginTop: 16 }}>Go to Admin</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>What Our Customers Say</h2>
          <div className="testimonials">
            {[
              { name: 'Ayesha K.', city: 'Lahore', text: 'The quality of fabric and stitching is absolutely outstanding. My bridal dress was beyond perfect!', stars: 5 },
              { name: 'Sara M.',   city: 'Karachi',    text: 'I ordered a custom kurta and the fit was impeccable. Will definitely order again.', stars: 5 },
              { name: 'Fatima R.',city: 'Islamabad',  text: 'Tabsha has the most beautiful designs. Fast delivery and excellent packaging too.', stars: 5 },
            ].map((t) => (
              <div key={t.name} className="tcard">
                <div className="tcard-stars">{'★'.repeat(t.stars)}</div>
                <p>"{t.text}"</p>
                <div className="tcard-author">
                  <span className="tcard-avatar">{t.name[0]}</span>
                  <div><strong>{t.name}</strong><small>{t.city}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ── */}
      <section className="insta-cta">
        <h2>Follow Our Journey</h2>
        <p>@tabsha.customdesign</p>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn-outline-gold">
          Visit Instagram <FiArrowRight size={15} />
        </a>
      </section>
    </div>
  );
}
