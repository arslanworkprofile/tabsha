import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="footer-logo-icon">T</span>
                <span className="footer-logo-text">Tabsha<small>Custom Design</small></span>
              </Link>
              <p>Where tradition meets contemporary elegance. Crafting bespoke garments that tell your story.</p>
              <div className="footer-socials">
                {[FiInstagram, FiFacebook, FiYoutube].map((Icon, i) => (
                  <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social"><Icon size={16} /></a>
                ))}
              </div>
            </div>

            <div>
              <h4>Shop</h4>
              <ul>
                {[['New Arrivals','/shop?new=true'],["Women's",'/shop/women'],["Men's",'/shop/men'],['Kids','/shop/kids'],['Bridal','/shop/bridal'],['Sale','/shop?sale=true']].map(([l,t]) => (
                  <li key={t}><Link to={t}>{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Help</h4>
              <ul>
                {[['Size Guide','/size-guide'],['Custom Stitching','/custom'],['Returns Policy','/returns'],['Privacy Policy','/privacy'],['About Us','/about']].map(([l,t]) => (
                  <li key={t}><Link to={t}>{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Contact</h4>
              <div className="footer-contact">
                <span><FiPhone size={13} />+92-300-0000000</span>
                <span><FiMail size={13} />hello@tabsha.pk</span>
                <span><FiMapPin size={13} />Lahore, Pakistan</span>
              </div>
              <div className="footer-newsletter">
                <p>Get exclusive deals</p>
                <form onSubmit={(e) => e.preventDefault()} className="footer-nl-form">
                  <input type="email" placeholder="Your email" />
                  <button type="submit">→</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Tabsha Custom Design. All rights reserved.</span>
          <div className="footer-payments">
            {['COD','EasyPaisa','JazzCash','Stripe'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
