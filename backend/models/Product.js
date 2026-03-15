const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorCode: { type: String, default: '#000000' },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, default: '' },
  price: { type: Number, default: null }, // override base price if set
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: null }, // original price for discount display
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  variants: [variantSchema],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  tags: [{ type: String }],
  fabric: { type: String, default: '' },
  careInstructions: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  totalStock: { type: Number, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
