const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User     = require('./models/User');
const Category = require('./models/Category');
const Product  = require('./models/Product');

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const IMG = {
  women1:  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format',
  women2:  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80&auto=format',
  women3:  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format',
  women4:  'https://images.unsplash.com/photo-1594938298603-c8148c4b4769?w=600&q=80&auto=format',
  bridal1: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format',
  men1:    'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=600&q=80&auto=format',
  kids1:   'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=80&auto=format',
};

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tabsha';
  console.log('🔌 Connecting to:', uri.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas');
  
  await mongoose.connect(uri);
  console.log('✅ MongoDB Connected');

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // Users
  await User.create({ name: 'Tabsha Admin', email: 'admin@tabsha.pk', password: 'admin123', role: 'admin' });
  console.log('👑 Admin: admin@tabsha.pk / admin123');
  await User.create({ name: 'Demo User', email: 'user@tabsha.pk', password: 'user123', role: 'user' });
  console.log('👤 User:  user@tabsha.pk / user123');

  // Categories
  const cats = await Category.insertMany([
    { name: "Women's Wear", slug: 'womens-wear', description: 'Elegant fashion for women',         image: IMG.women1,  sortOrder: 1, isActive: true },
    { name: "Men's Wear",   slug: 'mens-wear',   description: 'Classic and contemporary menswear', image: IMG.men1,    sortOrder: 2, isActive: true },
    { name: 'Kids',         slug: 'kids',         description: 'Adorable styles for little ones',   image: IMG.kids1,   sortOrder: 3, isActive: true },
    { name: 'Bridal',       slug: 'bridal',       description: 'Luxury bridal couture',             image: IMG.bridal1, sortOrder: 4, isActive: true },
  ]);
  console.log(`📂 ${cats.length} categories created`);

  const wCat = cats[0], mCat = cats[1], kCat = cats[2], bCat = cats[3];

  await Product.insertMany([
    {
      name: 'Floral Embroidered Lawn Suit', slug: 'floral-embroidered-lawn-suit',
      description: 'A stunning 3-piece lawn suit with intricate floral embroidery. Perfect for summer gatherings and Eid.',
      shortDescription: 'Premium 3-piece lawn suit with floral embroidery',
      price: 4500, comparePrice: 6000, category: wCat._id,
      images: [{ url: IMG.women1, isPrimary: true }, { url: IMG.women2, isPrimary: false }],
      variants: [
        { size: 'S',  color: 'Pink', colorCode: '#ED64A6', stock: 10 },
        { size: 'M',  color: 'Pink', colorCode: '#ED64A6', stock: 8  },
        { size: 'L',  color: 'Pink', colorCode: '#ED64A6', stock: 5  },
        { size: 'S',  color: 'Blue', colorCode: '#3182CE', stock: 7  },
        { size: 'M',  color: 'Blue', colorCode: '#3182CE', stock: 6  },
      ],
      fabric: 'Pure Lawn', careInstructions: 'Hand wash cold',
      isActive: true, isFeatured: true, isNewArrival: true,
      tags: ['lawn', 'summer', 'embroidered'],
    },
    {
      name: 'Chiffon Printed Kurti', slug: 'chiffon-printed-kurti',
      description: 'Elegant chiffon kurti with all-over digital print. Features bell sleeves and a flattering A-line cut.',
      shortDescription: 'Lightweight chiffon kurti with digital print',
      price: 2800, comparePrice: 3800, category: wCat._id,
      images: [{ url: IMG.women3, isPrimary: true }, { url: IMG.women4, isPrimary: false }],
      variants: [
        { size: 'S',  color: 'Maroon', colorCode: '#7B241C', stock: 12 },
        { size: 'M',  color: 'Maroon', colorCode: '#7B241C', stock: 10 },
        { size: 'L',  color: 'Maroon', colorCode: '#7B241C', stock: 8  },
        { size: 'M',  color: 'Navy',   colorCode: '#2C3E7E', stock: 9  },
      ],
      fabric: 'Chiffon', careInstructions: 'Dry clean recommended',
      isActive: true, isNewArrival: true, isBestseller: true,
      tags: ['kurti', 'chiffon', 'casual'],
    },
    {
      name: 'Royal Bridal Lehenga Choli', slug: 'royal-bridal-lehenga-choli',
      description: 'Exquisite bridal lehenga with heavy hand embroidery, gota work and stone detailing. Includes matching choli and net dupatta.',
      shortDescription: 'Heavy embroidered silk bridal lehenga with dupatta',
      price: 85000, comparePrice: 110000, category: bCat._id,
      images: [{ url: IMG.bridal1, isPrimary: true }],
      variants: [
        { size: 'S',  color: 'Maroon', colorCode: '#7B241C', stock: 2 },
        { size: 'M',  color: 'Maroon', colorCode: '#7B241C', stock: 3 },
        { size: 'L',  color: 'Maroon', colorCode: '#7B241C', stock: 2 },
        { size: 'M',  color: 'Gold',   colorCode: '#C9A84C', stock: 2 },
      ],
      fabric: 'Heavy Silk', careInstructions: 'Dry clean only',
      isActive: true, isFeatured: true, isNewArrival: true,
      tags: ['bridal', 'lehenga', 'wedding', 'luxury'],
    },
    {
      name: 'Classic Shalwar Kameez', slug: 'classic-shalwar-kameez',
      description: 'Timeless shalwar kameez crafted from premium cotton with subtle embroidery on collar and cuffs.',
      shortDescription: 'Premium cotton shalwar kameez with embroidery',
      price: 3800, comparePrice: 5000, category: mCat._id,
      images: [{ url: IMG.men1, isPrimary: true }],
      variants: [
        { size: 'S',   color: 'White', colorCode: '#FFFFFF', stock: 15 },
        { size: 'M',   color: 'White', colorCode: '#FFFFFF', stock: 12 },
        { size: 'L',   color: 'White', colorCode: '#FFFFFF', stock: 10 },
        { size: 'XL',  color: 'White', colorCode: '#FFFFFF', stock: 8  },
        { size: 'M',   color: 'Beige', colorCode: '#F5DEB3', stock: 8  },
      ],
      fabric: 'Pure Cotton', careInstructions: 'Machine wash cold',
      isActive: true, isFeatured: true, isBestseller: true,
      tags: ['shalwar kameez', 'cotton', 'eid'],
    },
    {
      name: 'Kids Eid Dress', slug: 'kids-eid-dress',
      description: 'Adorable Eid outfit for girls with beautiful embroidery and frill details. Soft on young skin.',
      shortDescription: 'Embroidered Eid dress for girls',
      price: 2200, comparePrice: 2800, category: kCat._id,
      images: [{ url: IMG.kids1, isPrimary: true }],
      variants: [
        { size: '2-3Y', color: 'Pink',   colorCode: '#ED64A6', stock: 15 },
        { size: '4-5Y', color: 'Pink',   colorCode: '#ED64A6', stock: 12 },
        { size: '6-7Y', color: 'Pink',   colorCode: '#ED64A6', stock: 10 },
        { size: '4-5Y', color: 'Yellow', colorCode: '#F6E05E', stock: 9  },
      ],
      fabric: 'Cotton Blend', careInstructions: 'Machine wash gentle',
      isActive: true, isNewArrival: true,
      tags: ['kids', 'eid', 'girls'],
    },
  ]);
  console.log('👗 5 products created');

  console.log('\n✅ SEED COMPLETE!');
  console.log('─────────────────────────────────');
  console.log('  👑 Admin: admin@tabsha.pk / admin123');
  console.log('  👤 User:  user@tabsha.pk  / user123');
  console.log('─────────────────────────────────');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});
