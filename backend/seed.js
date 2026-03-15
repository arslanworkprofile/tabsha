/**
 * SEED SCRIPT — Run with: node seed.js
 * Creates admin user, sample categories & products
 * Run from: tabsha/backend/
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User     = require('./models/User');
const Category = require('./models/Category');
const Product  = require('./models/Product');

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

// ─── Pakistani Fashion Images (Unsplash) ─────────────────────────────────────
const IMG = {
  women1:  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format',
  women2:  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80&auto=format',
  women3:  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format',
  women4:  'https://images.unsplash.com/photo-1594938298603-c8148c4b4769?w=600&q=80&auto=format',
  bridal1: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format',
  bridal2: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format',
  men1:    'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80&auto=format',
  men2:    'https://images.unsplash.com/photo-1594938298603-c8148c4b4769?w=600&q=80&auto=format',
  kids1:   'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=80&auto=format',
};

const CATEGORIES = [
  { name: "Women's Wear", desc: 'Elegant fashion for women',         img: IMG.women1,  sort: 1 },
  { name: "Men's Wear",   desc: 'Classic and contemporary menswear', img: IMG.men1,    sort: 2 },
  { name: 'Kids',         desc: 'Adorable styles for little ones',   img: IMG.kids1,   sort: 3 },
  { name: 'Bridal',       desc: 'Luxury bridal couture',             img: IMG.bridal1, sort: 4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tabsha');
  console.log('✅ MongoDB Connected');

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────────
  await User.create({ name: 'Tabsha Admin', email: 'admin@tabsha.pk', password: 'admin123', role: 'admin' });
  console.log('👤 Admin: admin@tabsha.pk / admin123');

  await User.create({ name: 'Demo User', email: 'user@tabsha.pk', password: 'user123', role: 'user' });
  console.log('👤 User:  user@tabsha.pk / user123');

  // ── Categories ─────────────────────────────────────────────────────────────
  const cats = await Category.insertMany(
    CATEGORIES.map(c => ({ name: c.name, slug: slugify(c.name), description: c.desc, image: c.img, sortOrder: c.sort, isActive: true }))
  );
  console.log(`📂 ${cats.length} categories created`);

  const wCat = cats.find(c => c.name === "Women's Wear");
  const mCat = cats.find(c => c.name === "Men's Wear");
  const bCat = cats.find(c => c.name === 'Bridal');
  const kCat = cats.find(c => c.name === 'Kids');

  // ── Products ───────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Floral Embroidered Lawn Suit',
      slug: 'floral-embroidered-lawn-suit',
      description: 'A stunning 3-piece lawn suit featuring intricate floral embroidery on the shirt. Crafted from premium pure lawn fabric — perfect for summer gatherings, Eid, and casual outings.',
      shortDescription: 'Premium 3-piece lawn suit with delicate floral embroidery',
      price: 4500, comparePrice: 6000,
      category: wCat._id,
      images: [
        { url: IMG.women1, isPrimary: true, alt: 'Floral Embroidered Lawn Suit - Pink' },
        { url: IMG.women2, isPrimary: false, alt: 'Floral Embroidered Lawn Suit - Blue' },
      ],
      variants: [
        { size: 'S',  color: 'Pink', colorCode: '#ED64A6', stock: 10 },
        { size: 'M',  color: 'Pink', colorCode: '#ED64A6', stock: 8  },
        { size: 'L',  color: 'Pink', colorCode: '#ED64A6', stock: 5  },
        { size: 'XL', color: 'Pink', colorCode: '#ED64A6', stock: 3  },
        { size: 'S',  color: 'Blue', colorCode: '#3182CE', stock: 7  },
        { size: 'M',  color: 'Blue', colorCode: '#3182CE', stock: 6  },
        { size: 'L',  color: 'Blue', colorCode: '#3182CE', stock: 4  },
      ],
      fabric: 'Pure Lawn', careInstructions: 'Hand wash in cold water',
      isActive: true, isFeatured: true, isNewArrival: true,
      tags: ['lawn', 'summer', 'embroidered', '3-piece'],
    },
    {
      name: 'Chiffon Printed Kurti',
      slug: 'chiffon-printed-kurti',
      description: 'Elegant chiffon kurti with an all-over digital print. Features bell sleeves and a flattering A-line cut. Lightweight and breathable — ideal for both casual and semi-formal occasions.',
      shortDescription: 'Lightweight chiffon kurti with digital print',
      price: 2800, comparePrice: 3800,
      category: wCat._id,
      images: [
        { url: IMG.women3, isPrimary: true, alt: 'Chiffon Printed Kurti' },
        { url: IMG.women4, isPrimary: false, alt: 'Chiffon Kurti Detail' },
      ],
      variants: [
        { size: 'S',   color: 'Maroon', colorCode: '#7B241C', stock: 12 },
        { size: 'M',   color: 'Maroon', colorCode: '#7B241C', stock: 10 },
        { size: 'L',   color: 'Maroon', colorCode: '#7B241C', stock: 8  },
        { size: 'XL',  color: 'Maroon', colorCode: '#7B241C', stock: 6  },
        { size: 'S',   color: 'Navy',   colorCode: '#2C3E7E', stock: 8  },
        { size: 'M',   color: 'Navy',   colorCode: '#2C3E7E', stock: 9  },
      ],
      fabric: 'Chiffon', careInstructions: 'Dry clean recommended',
      isActive: true, isFeatured: false, isNewArrival: true, isBestseller: true,
      tags: ['kurti', 'chiffon', 'casual', 'printed'],
    },
    {
      name: 'Royal Bridal Lehenga Choli',
      slug: 'royal-bridal-lehenga-choli',
      description: 'An exquisite bridal lehenga crafted from premium silk with heavy hand embroidery, gota work, and stone detailing. This masterpiece is designed for the modern Pakistani bride who wants to blend tradition with contemporary elegance. Includes matching choli and net dupatta.',
      shortDescription: 'Heavy embroidered silk bridal lehenga with dupatta',
      price: 85000, comparePrice: 110000,
      category: bCat._id,
      images: [
        { url: IMG.bridal1, isPrimary: true, alt: 'Royal Bridal Lehenga' },
        { url: IMG.bridal2, isPrimary: false, alt: 'Bridal Lehenga Detail' },
      ],
      variants: [
        { size: 'S',  color: 'Maroon', colorCode: '#7B241C', stock: 2 },
        { size: 'M',  color: 'Maroon', colorCode: '#7B241C', stock: 3 },
        { size: 'L',  color: 'Maroon', colorCode: '#7B241C', stock: 2 },
        { size: 'M',  color: 'Gold',   colorCode: '#C9A84C', stock: 2 },
        { size: 'L',  color: 'Gold',   colorCode: '#C9A84C', stock: 1 },
      ],
      fabric: 'Heavy Silk with Net Dupatta', careInstructions: 'Dry clean only',
      isActive: true, isFeatured: true, isNewArrival: true,
      tags: ['bridal', 'lehenga', 'wedding', 'luxury', 'embroidered'],
    },
    {
      name: 'Classic Shalwar Kameez',
      slug: 'classic-shalwar-kameez',
      description: 'A timeless shalwar kameez set crafted from premium cotton with subtle embroidery on the collar and cuffs. Perfect for Eid, formal events, and everyday elegance.',
      shortDescription: 'Premium cotton shalwar kameez with embroidery',
      price: 3800, comparePrice: 5000,
      category: mCat._id,
      images: [
        { url: IMG.men1, isPrimary: true, alt: 'Classic Shalwar Kameez' },
        { url: IMG.men2, isPrimary: false, alt: 'Shalwar Kameez Detail' },
      ],
      variants: [
        { size: 'S',   color: 'White', colorCode: '#FFFFFF', stock: 15 },
        { size: 'M',   color: 'White', colorCode: '#FFFFFF', stock: 12 },
        { size: 'L',   color: 'White', colorCode: '#FFFFFF', stock: 10 },
        { size: 'XL',  color: 'White', colorCode: '#FFFFFF', stock: 8  },
        { size: 'XXL', color: 'White', colorCode: '#FFFFFF', stock: 5  },
        { size: 'M',   color: 'Beige', colorCode: '#F5DEB3', stock: 8  },
        { size: 'L',   color: 'Beige', colorCode: '#F5DEB3', stock: 7  },
      ],
      fabric: 'Pure Cotton', careInstructions: 'Machine wash cold, tumble dry low',
      isActive: true, isFeatured: true, isBestseller: true,
      tags: ['shalwar kameez', 'cotton', 'eid', 'formal'],
    },
    {
      name: 'Embroidered Silk Dupatta Set',
      slug: 'embroidered-silk-dupatta-set',
      description: 'A luxurious 2-piece silk suit paired with a heavily embroidered dupatta. The intricate threadwork and mirror work make this a showstopper for weddings and formal events.',
      shortDescription: '2-piece silk suit with embroidered dupatta',
      price: 12500, comparePrice: 16000,
      category: wCat._id,
      images: [
        { url: IMG.women4, isPrimary: true, alt: 'Embroidered Silk Dupatta Set' },
        { url: IMG.women1, isPrimary: false, alt: 'Silk Dupatta Detail' },
      ],
      variants: [
        { size: 'S',  color: 'Teal',   colorCode: '#38B2AC', stock: 6 },
        { size: 'M',  color: 'Teal',   colorCode: '#38B2AC', stock: 8 },
        { size: 'L',  color: 'Teal',   colorCode: '#38B2AC', stock: 5 },
        { size: 'M',  color: 'Purple', colorCode: '#805AD5', stock: 7 },
        { size: 'L',  color: 'Purple', colorCode: '#805AD5', stock: 4 },
      ],
      fabric: 'Pure Silk with Embroidery', careInstructions: 'Dry clean only',
      isActive: true, isFeatured: true, isNewArrival: false, isBestseller: true,
      tags: ['silk', 'formal', 'wedding', 'embroidered', 'dupatta'],
    },
    {
      name: 'Kids Eid Dress',
      slug: 'kids-eid-dress',
      description: 'An adorable and comfortable Eid outfit for girls, featuring beautiful embroidery and frill details. Made from premium fabric that is soft on young skin.',
      shortDescription: 'Embroidered Eid dress for girls',
      price: 2200, comparePrice: 2800,
      category: kCat._id,
      images: [
        { url: IMG.kids1, isPrimary: true, alt: 'Kids Eid Dress' },
      ],
      variants: [
        { size: '2-3Y', color: 'Pink',   colorCode: '#ED64A6', stock: 15 },
        { size: '4-5Y', color: 'Pink',   colorCode: '#ED64A6', stock: 12 },
        { size: '6-7Y', color: 'Pink',   colorCode: '#ED64A6', stock: 10 },
        { size: '2-3Y', color: 'Yellow', colorCode: '#F6E05E', stock: 8  },
        { size: '4-5Y', color: 'Yellow', colorCode: '#F6E05E', stock: 9  },
      ],
      fabric: 'Cotton Blend', careInstructions: 'Machine wash gentle, cold water',
      isActive: true, isFeatured: false, isNewArrival: true,
      tags: ['kids', 'eid', 'girls', 'embroidered'],
    },
  ];

  const created = await Product.insertMany(products);
  console.log(`👗 ${created.length} products created`);

  console.log('\n✅ SEED COMPLETE!');
  console.log('─────────────────────────────────────');
  console.log('  Admin:  admin@tabsha.pk / admin123');
  console.log('  User:   user@tabsha.pk  / user123');
  console.log('─────────────────────────────────────');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
