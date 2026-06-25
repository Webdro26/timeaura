const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('../models/Admin');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/timeaura';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([Admin.deleteMany(), Brand.deleteMany(), Category.deleteMany(), Product.deleteMany(), Coupon.deleteMany()]);
  console.log('Cleared existing data');

  // Admin
  await Admin.create({ name: 'TimeAura Admin', email: 'admin@timeaura.com', password: 'Admin@123' });
  console.log('✅ Admin created: admin@timeaura.com / Admin@123');

  // Brands
  const brands = await Brand.insertMany([
    { name: 'Casio', slug: 'casio', description: 'Japanese precision timepieces' },
    { name: 'Fossil', slug: 'fossil', description: 'American heritage watch brand' },
    { name: 'Titan', slug: 'titan', description: "India's most trusted watch brand" },
    { name: 'Fastrack', slug: 'fastrack', description: 'Trendy youth watches' },
    { name: 'G-Shock', slug: 'g-shock', description: 'Tough and sporty timepieces' },
    { name: 'Armani', slug: 'armani', description: 'Italian luxury fashion watches' },
    { name: 'Tommy Hilfiger', slug: 'tommy-hilfiger', description: 'Classic American style' },
  ]);
  console.log('✅ Brands created');

  // Sunglass categories
  const categories = await Category.insertMany([
    { name: 'Aviator', slug: 'aviator', description: 'Classic pilot-inspired frames' },
    { name: 'Round', slug: 'round', description: 'Vintage round frames' },
    { name: 'Square', slug: 'square', description: 'Bold square frames' },
    { name: 'Wayfarer', slug: 'wayfarer', description: 'Iconic wayfarer style' },
    { name: 'Sports', slug: 'sports', description: 'Performance sport frames' },
    { name: 'Premium', slug: 'premium', description: 'Luxury premium eyewear' },
  ]);
  console.log('✅ Categories created');

  const brandMap = Object.fromEntries(brands.map(b => [b.slug, b._id]));
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));

  // Products
  const watchImages = [
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80',
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    'https://images.unsplash.com/photo-1616704793597-e5a3b9f3f147?w=600&q=80',
    'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwbd8e8365/images/Titan/Catalog/90110WL04_1.jpg?sw=600&sh=600',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
    'https://images.unsplash.com/photo-1509941943102-10c232535736?w=600&q=80',
  ];

  const glassImages = [
    'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwbd8e8365/images/Titan/Catalog/90110WL04_1.jpg?sw=600&sh=600',
    'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
    'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80',
    'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80',
    'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80',
  ];

  await Product.insertMany([
    // WATCHES
    {
      name: 'Casio G-Shock DW5600', slug: 'casio-g-shock-dw5600',
      description: 'The iconic G-Shock with legendary shock resistance. Perfect for the modern adventurer who demands reliability.',
      price: 6999, discountPrice: 5499, category: 'watch', gender: 'men',
      brand: brandMap['casio'], images: [watchImages[0], watchImages[1]],
      stock: 25, tags: ['bestseller', 'trending'],
      specifications: [{ key: 'Water Resistance', value: '200m' }, { key: 'Battery Life', value: '2 years' }, { key: 'Case Material', value: 'Resin' }],
      ratings: { average: 4.8, count: 312 }
    },
    {
      name: 'Fossil Minimalist ES4341', slug: 'fossil-minimalist-es4341',
      description: 'Sleek stainless steel case with a clean dial. The definition of modern minimalism on your wrist.',
      price: 12995, discountPrice: 9999, category: 'watch', gender: 'women',
      brand: brandMap['fossil'], images: [watchImages[1], watchImages[2]],
      stock: 18, tags: ['new', 'featured'],
      specifications: [{ key: 'Case Size', value: '36mm' }, { key: 'Strap', value: 'Stainless Steel Mesh' }, { key: 'Movement', value: 'Quartz' }],
      ratings: { average: 4.6, count: 189 }
    },
    {
      name: 'Titan Nebula Automatic', slug: 'titan-nebula-automatic',
      description: 'Exquisite automatic movement with sapphire crystal glass. Indian craftsmanship at its finest.',
      price: 18500, discountPrice: 15999, category: 'watch', gender: 'men',
      brand: brandMap['titan'], images: [watchImages[2], watchImages[3]],
      stock: 12, tags: ['bestseller', 'featured'],
      specifications: [{ key: 'Movement', value: 'Automatic' }, { key: 'Crystal', value: 'Sapphire' }, { key: 'Case', value: '42mm Stainless Steel' }],
      ratings: { average: 4.7, count: 98 }
    },
    {
      name: 'Fastrack Streetwear Chrono', slug: 'fastrack-streetwear-chrono',
      description: 'Bold chronograph with urban aesthetics. Made for the streets, built for the bold.',
      price: 4995, discountPrice: 3799, category: 'watch', gender: 'unisex',
      brand: brandMap['fastrack'], images: [watchImages[3], watchImages[4]],
      stock: 40, tags: ['trending', 'new'],
      specifications: [{ key: 'Features', value: 'Chronograph, Date' }, { key: 'Strap', value: 'Silicon' }, { key: 'Water Resistance', value: '50m' }],
      ratings: { average: 4.3, count: 445 }
    },
    {
      name: 'Armani Exchange Hampton AX2103', slug: 'armani-exchange-hampton-ax2103',
      description: 'Italian luxury meets everyday elegance. Rose gold tones with a black dial for maximum contrast.',
      price: 24999, discountPrice: 19999, category: 'watch', gender: 'women',
      brand: brandMap['armani'], images: [watchImages[4], watchImages[5]],
      stock: 8, tags: ['featured', 'bestseller'],
      specifications: [{ key: 'Case', value: '28mm Rose Gold-tone' }, { key: 'Strap', value: 'Stainless Steel Bracelet' }, { key: 'Movement', value: 'Quartz' }],
      ratings: { average: 4.9, count: 67 }
    },
    {
      name: 'Tommy Hilfiger Blake TH1791618', slug: 'tommy-hilfiger-blake-th1791618',
      description: 'Classic American style with a blue dial. The perfect business casual companion.',
      price: 14995, discountPrice: 11999, category: 'watch', gender: 'men',
      brand: brandMap['tommy-hilfiger'], images: [watchImages[5], watchImages[6]],
      stock: 15, tags: ['new'],
      specifications: [{ key: 'Case', value: '44mm' }, { key: 'Strap', value: 'Leather' }, { key: 'Dial', value: 'Blue' }],
      ratings: { average: 4.5, count: 134 }
    },
    {
      name: 'Casio Edifice EFR-552D', slug: 'casio-edifice-efr552d',
      description: 'Racing-inspired chronograph with tachymeter bezel. Speed and precision in perfect harmony.',
      price: 9995, discountPrice: 7999, category: 'watch', gender: 'men',
      brand: brandMap['casio'], images: [watchImages[6], watchImages[0]],
      stock: 20, tags: ['trending'],
      specifications: [{ key: 'Features', value: 'Chronograph, Tachymeter' }, { key: 'Case', value: '45mm' }, { key: 'Water Resistance', value: '100m' }],
      ratings: { average: 4.6, count: 223 }
    },
    {
      name: 'Titan Raga Viva NL95001SM', slug: 'titan-raga-viva-nl95001sm',
      description: 'Delicate and feminine with a pearl dial. Designed for the woman who wears elegance effortlessly.',
      price: 11995, discountPrice: 9499, category: 'watch', gender: 'women',
      brand: brandMap['titan'], images: [watchImages[7], watchImages[1]],
      stock: 14, tags: ['bestseller', 'featured'],
      specifications: [{ key: 'Dial', value: 'Mother of Pearl' }, { key: 'Strap', value: 'Metal Bracelet' }, { key: 'Case', value: '28mm' }],
      ratings: { average: 4.7, count: 156 }
    },

    // SUNGLASSES
    {
      name: 'AeroShield Aviator Pro', slug: 'aeroshield-aviator-pro',
      description: 'Classic double-bridge aviator with gold frame and gradient lenses. Timeless coolness redefined.',
      price: 3499, discountPrice: 2299, category: 'sunglasses', gender: 'unisex',
      glassCategory: catMap['aviator'], images: [glassImages[0], glassImages[1]],
      stock: 35, tags: ['bestseller', 'trending'],
      specifications: [{ key: 'Frame', value: 'Gold Metal' }, { key: 'Lens', value: 'Gradient Brown Polarized' }, { key: 'UV Protection', value: 'UV400' }],
      ratings: { average: 4.7, count: 289 }
    },
    {
      name: 'VisionCircle Round Retro', slug: 'visioncircle-round-retro',
      description: 'Bold round frames with a vintage soul. For those who live in the past and dress for the future.',
      price: 2999, discountPrice: 1999, category: 'sunglasses', gender: 'unisex',
      glassCategory: catMap['round'], images: [glassImages[1], glassImages[2]],
      stock: 28, tags: ['new', 'trending'],
      specifications: [{ key: 'Frame', value: 'Tortoise Acetate' }, { key: 'Lens', value: 'Green Tinted' }, { key: 'UV Protection', value: 'UV400' }],
      ratings: { average: 4.5, count: 178 }
    },
    {
      name: 'SquarEdge Urban Flat', slug: 'squaredge-urban-flat',
      description: 'Oversized square frames with flat top. The statement piece your outfit is begging for.',
      price: 2799, discountPrice: 1899, category: 'sunglasses', gender: 'women',
      glassCategory: catMap['square'], images: [glassImages[2], glassImages[3]],
      stock: 22, tags: ['new', 'featured'],
      specifications: [{ key: 'Frame', value: 'Black Acetate' }, { key: 'Lens', value: 'Dark Smoke' }, { key: 'Style', value: 'Flat Top Oversized' }],
      ratings: { average: 4.4, count: 134 }
    },
    {
      name: 'WayFare Classic Black', slug: 'wayfare-classic-black',
      description: 'The original wayfarer, unchanged since 1952. An icon that never goes out of style.',
      price: 3199, discountPrice: 2499, category: 'sunglasses', gender: 'unisex',
      glassCategory: catMap['wayfarer'], images: [glassImages[3], glassImages[4]],
      stock: 50, tags: ['bestseller'],
      specifications: [{ key: 'Frame', value: 'Matte Black' }, { key: 'Lens', value: 'G-15 Polarized' }, { key: 'Fit', value: 'Classic Medium' }],
      ratings: { average: 4.8, count: 512 }
    },
    {
      name: 'TrailBlazer Sports Shield', slug: 'trailblazer-sports-shield',
      description: 'Wrap-around shield lens for maximum coverage. Built for performance, styled for the streets.',
      price: 4999, discountPrice: 3799, category: 'sunglasses', gender: 'men',
      glassCategory: catMap['sports'], images: [glassImages[4], glassImages[5]],
      stock: 18, tags: ['trending', 'new'],
      specifications: [{ key: 'Frame', value: 'TR90 Flexible' }, { key: 'Lens', value: 'Mirrored Polarized' }, { key: 'Features', value: 'Anti-slip nose, Vented lens' }],
      ratings: { average: 4.6, count: 89 }
    },
    {
      name: 'LuxeVision Premium Gold', slug: 'luxevision-premium-gold',
      description: 'Hand-crafted Italian acetate with 24k gold-plated temples. Luxury you can wear.',
      price: 12999, discountPrice: 9999, category: 'sunglasses', gender: 'unisex',
      glassCategory: catMap['premium'], images: [glassImages[5], glassImages[0]],
      stock: 10, tags: ['featured', 'bestseller'],
      specifications: [{ key: 'Frame', value: 'Hand-polished Acetate' }, { key: 'Temples', value: '24k Gold-plated' }, { key: 'Lens', value: 'Mineral Glass Polarized' }],
      ratings: { average: 4.9, count: 45 }
    },
  ]);
  console.log('✅ Products created (8 watches + 6 sunglasses)');

  // Coupons
  await Coupon.insertMany([
    { code: 'TIMEAURA10', discountType: 'percentage', discountValue: 10, minOrderAmount: 1000, maxDiscount: 500, usageLimit: 200 },
    { code: 'WELCOME200', discountType: 'flat', discountValue: 200, minOrderAmount: 1500, usageLimit: 100 },
    { code: 'STYLE20', discountType: 'percentage', discountValue: 20, minOrderAmount: 3000, maxDiscount: 1000, usageLimit: 50 },
  ]);
  console.log('✅ Coupons created');

  console.log('\n🎉 Seed complete!');
  console.log('Admin Login → Email: admin@timeaura.com | Password: Admin@123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
