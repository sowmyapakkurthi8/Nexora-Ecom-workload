import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String, default: 'Recently' },
  title: { type: String, default: '' },
  comment: { type: String, required: true },
  verified: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: 'Nexora Tech',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
    image: {
      type: String,
      default: '',
    },
    gallery: [{
      type: String,
    }],
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      default: 50,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
