require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.log('--------------------------------------------------');
      console.log('⚠️ MongoDB Connection is not active (ECONNREFUSED).');
      console.log('👉 Please start your local MongoDB service or update MONGODB_URI in server/.env with your MongoDB Atlas URI.');
      console.log('--------------------------------------------------');
      process.exit(0);
    }

    console.log('[ShopSphere Seed] Clearing existing database collections...');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    console.log('[ShopSphere Seed] Creating Users...');
    const adminUser = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      addresses: [
        {
          street: '100 Tech Park, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@shopsphere.com',
      password: 'User@123',
      role: 'customer',
      phone: '+91 9812345678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      addresses: [
        {
          street: '42 Lotus Colony, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log('[ShopSphere Seed] Creating Categories...');
    const categories = await Category.create([
      {
        name: 'Electronics',
        description: 'Next-gen smart gadgets, smartphones, laptops, audio equipment, and wearables.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Fashion',
        description: 'Trendy apparel, designer footwear, streetwear, and luxury accessories.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Home & Kitchen',
        description: 'Smart appliances, modern home decor, kitchenware, and furniture.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Books & Fitness',
        description: 'Bestselling literature, productivity books, gym equipment, and wellness gear.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    const elecId = categories[0]._id;
    const fashId = categories[1]._id;
    const homeId = categories[2]._id;
    const fitId = categories[3]._id;

    console.log('[ShopSphere Seed] Creating 20 Products...');
    const productsData = [
      // Electronics
      {
        name: 'SonicPro Wireless Noise Cancelling Headphones',
        description: 'Experience studio-quality sound with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam earcups.',
        price: 14999,
        discountPrice: 11999,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
        ],
        category: elecId,
        brand: 'SonicPro',
        stock: 25,
        isFeatured: true,
        tags: ['audio', 'wireless', 'headphones', 'bluetooth'],
        specifications: [
          { key: 'Battery Life', value: '40 Hours' },
          { key: 'Noise Cancellation', value: 'Active Hybrid ANC' },
          { key: 'Bluetooth Version', value: '5.3' }
        ]
      },
      {
        name: 'UltraVision 4K Smart Watch Series 8',
        description: 'Seamless health tracking, AMOLED display, ECG monitoring, sleep tracking, and multi-sport workout modes.',
        price: 8999,
        discountPrice: 6499,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
        ],
        category: elecId,
        brand: 'UltraVision',
        stock: 30,
        isFeatured: true,
        tags: ['smartwatch', 'fitness', 'wearables'],
        specifications: [
          { key: 'Display', value: '1.9" AMOLED' },
          { key: 'Water Resistance', value: '50m (5 ATM)' }
        ]
      },
      {
        name: 'AeroBook Pro 15 M2 Laptop',
        description: 'Ultra-thin aluminum unibody laptop with M2 chip, 16GB RAM, 512GB SSD, and brilliant Retina Display.',
        price: 119999,
        discountPrice: 104999,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
        ],
        category: elecId,
        brand: 'Aero',
        stock: 12,
        isFeatured: true,
        tags: ['laptop', 'macbook', 'computing', 'workstation'],
        specifications: [
          { key: 'RAM', value: '16GB Unified' },
          { key: 'Storage', value: '512GB NVMe SSD' }
        ]
      },
      {
        name: 'PixelLens Mirrorless 4K Camera',
        description: 'Capture cinematic 4K videos and 24.2MP high-resolution stills with ultra-fast autofocus and 5-axis image stabilization.',
        price: 64999,
        discountPrice: 58999,
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
        ],
        category: elecId,
        brand: 'PixelLens',
        stock: 8,
        isFeatured: false,
        tags: ['camera', 'photography', '4K'],
        specifications: [
          { key: 'Sensor', value: '24.2 MP APS-C' },
          { key: 'Video Resolution', value: '4K 60fps' }
        ]
      },
      {
        name: 'PulseBass Portable Waterproof Bluetooth Speaker',
        description: '360-degree room-filling bass, IPX7 waterproof rating, and 20 hours of continuous playback time for outdoor parties.',
        price: 3999,
        discountPrice: 2799,
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'
        ],
        category: elecId,
        brand: 'Pulse',
        stock: 45,
        isFeatured: true,
        tags: ['speaker', 'bluetooth', 'audio'],
        specifications: [
          { key: 'Waterproof', value: 'IPX7 Rated' },
          { key: 'Playtime', value: '20 Hours' }
        ]
      },

      // Fashion
      {
        name: 'Urban Legend Leather Biker Jacket',
        description: 'Handcrafted genuine lambskin leather jacket with asymmetrical zip closure, quilted shoulder padding, and satin lining.',
        price: 12999,
        discountPrice: 8999,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
        ],
        category: fashId,
        brand: 'Urban Legend',
        stock: 15,
        isFeatured: true,
        tags: ['jacket', 'leather', 'fashion', 'outerwear'],
        specifications: [
          { key: 'Material', value: '100% Genuine Lambskin Leather' },
          { key: 'Fit', value: 'Slim Fit' }
        ]
      },
      {
        name: 'RunnerX Cushion Elite Sneakers',
        description: 'Engineered mesh sneakers with responsive foam cushioning, breathable lining, and high-traction rubber outsole.',
        price: 5999,
        discountPrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
        ],
        category: fashId,
        brand: 'RunnerX',
        stock: 35,
        isFeatured: true,
        tags: ['shoes', 'sneakers', 'footwear', 'running'],
        specifications: [
          { key: 'Sole Material', value: 'High Density Rubber' },
          { key: 'Closure', value: 'Lace-Up' }
        ]
      },
      {
        name: 'Classic Vintage Aviator Sunglasses',
        description: '100% UV400 protection polarized lenses with lightweight gold-tone alloy metal frame for timeless elegance.',
        price: 2499,
        discountPrice: 1499,
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
        ],
        category: fashId,
        brand: 'AeroShades',
        stock: 50,
        isFeatured: false,
        tags: ['sunglasses', 'accessories', 'eyewear'],
        specifications: [
          { key: 'Lens Material', value: 'Polarized TAC' },
          { key: 'UV Protection', value: 'UV400' }
        ]
      },
      {
        name: 'Nordic Minimalist Canvas Backpack',
        description: 'Durable water-resistant canvas laptop backpack with leather magnetic straps, padded laptop sleeve, and multiple compartments.',
        price: 3499,
        discountPrice: 2299,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
        ],
        category: fashId,
        brand: 'NordicPack',
        stock: 20,
        isFeatured: false,
        tags: ['backpack', 'bags', 'travel'],
        specifications: [
          { key: 'Capacity', value: '24 Liters' },
          { key: 'Laptop Compartment', value: 'Up to 15.6 Inch' }
        ]
      },
      {
        name: 'Monaco Skeleton Automatic Watch',
        description: 'Exquisite mechanical automatic movement watch featuring transparent skeleton dial, sapphire crystal glass, and genuine leather strap.',
        price: 18999,
        discountPrice: 14999,
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'
        ],
        category: fashId,
        brand: 'Monaco',
        stock: 10,
        isFeatured: true,
        tags: ['watch', 'luxury', 'accessories'],
        specifications: [
          { key: 'Movement', value: 'Automatic Self-Winding' },
          { key: 'Glass', value: 'Scratch-Proof Sapphire' }
        ]
      },

      // Home & Kitchen
      {
        name: 'BaristaTouch Espresso Machine & Coffee Maker',
        description: '15-bar Italian pump pressure espresso maker with built-in milk frother, precise thermal heating, and stainless steel housing.',
        price: 24999,
        discountPrice: 19999,
        images: [
          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800'
        ],
        category: homeId,
        brand: 'BaristaTouch',
        stock: 14,
        isFeatured: true,
        tags: ['coffee', 'espresso', 'kitchen', 'appliances'],
        specifications: [
          { key: 'Pump Pressure', value: '15 Bar' },
          { key: 'Water Tank', value: '1.8 Liters' }
        ]
      },
      {
        name: 'SmartChef Digital Air Fryer 5.5L',
        description: 'Rapid air circulation technology for 85% less fat cooking. Touchscreen controls with 8 preset cooking programs.',
        price: 8499,
        discountPrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800'
        ],
        category: homeId,
        brand: 'SmartChef',
        stock: 22,
        isFeatured: false,
        tags: ['airfryer', 'kitchen', 'cooking'],
        specifications: [
          { key: 'Capacity', value: '5.5 Liters' },
          { key: 'Power', value: '1700 Watts' }
        ]
      },
      {
        name: 'Ergonomic Mesh Office Chair Pro',
        description: 'High-back mesh chair with adjustable lumbar support, 3D armrests, heavy-duty tilt lock mechanism, and breathable mesh seat.',
        price: 14999,
        discountPrice: 11499,
        images: [
          'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800'
        ],
        category: homeId,
        brand: 'ErgoDesign',
        stock: 18,
        isFeatured: false,
        tags: ['chair', 'furniture', 'office'],
        specifications: [
          { key: 'Weight Capacity', value: '150 kg' },
          { key: 'Recline', value: '90 - 135 Degrees' }
        ]
      },
      {
        name: 'PureAir HEPA Smart Air Purifier',
        description: '3-stage True HEPA filtration system captures 99.97% of airborne particles, dust, pollen, and odor. Smart App controlled.',
        price: 11999,
        discountPrice: 8499,
        images: [
          'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800'
        ],
        category: homeId,
        brand: 'PureAir',
        stock: 16,
        isFeatured: false,
        tags: ['airpurifier', 'home', 'appliances'],
        specifications: [
          { key: 'CADR', value: '350 m³/h' },
          { key: 'Coverage Area', value: '450 sq ft' }
        ]
      },
      {
        name: 'Ceramic Handcrafted Minimalist Dinnerware Set',
        description: '16-piece stoneware dinnerware set featuring reactive glaze finish. Microwave and dishwasher safe.',
        price: 4999,
        discountPrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800'
        ],
        category: homeId,
        brand: 'ArtisanHome',
        stock: 28,
        isFeatured: false,
        tags: ['dinnerware', 'kitchen', 'ceramics'],
        specifications: [
          { key: 'Pieces', value: '16 Piece Set' },
          { key: 'Dishwasher Safe', value: 'Yes' }
        ]
      },

      // Books & Fitness
      {
        name: 'ProForm Rubber Hex Dumbbell Set (10kg - 25kg)',
        description: 'Heavy duty rubber encased hex dumbbells with chrome contoured handles for home gym weight training.',
        price: 9999,
        discountPrice: 7499,
        images: [
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800'
        ],
        category: fitId,
        brand: 'ProForm',
        stock: 15,
        isFeatured: false,
        tags: ['dumbbells', 'fitness', 'workout', 'gym'],
        specifications: [
          { key: 'Material', value: 'Rubber & Cast Iron' },
          { key: 'Grip', value: 'Ergonomic Chrome' }
        ]
      },
      {
        name: 'EcoGrip Extra Thick Non-Slip Yoga Mat',
        description: '6mm high-density eco-conscious TPE yoga mat with alignment lines, carrying strap, and anti-tear mesh layer.',
        price: 1999,
        discountPrice: 1299,
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800'
        ],
        category: fitId,
        brand: 'EcoGrip',
        stock: 40,
        isFeatured: false,
        tags: ['yogamat', 'yoga', 'fitness'],
        specifications: [
          { key: 'Thickness', value: '6mm TPE' },
          { key: 'Dimensions', value: '72" x 24"' }
        ]
      },
      {
        name: 'System Design Interview & Architecture Guide Book',
        description: 'Comprehensive hardbound masterguide covering large scale distributed systems, database sharding, caching, microservices, and system architecture.',
        price: 1499,
        discountPrice: 999,
        images: [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
        ],
        category: fitId,
        brand: 'TechPress',
        stock: 60,
        isFeatured: true,
        tags: ['books', 'programming', 'architecture', 'interview'],
        specifications: [
          { key: 'Pages', value: '450 Pages' },
          { key: 'Format', value: 'Hardcover' }
        ]
      },
      {
        name: 'HydroPro Insulated Thermal Water Bottle 1L',
        description: 'Double-wall vacuum insulated stainless steel water bottle keeps beverages ice cold for 24 hours or hot for 12 hours.',
        price: 1299,
        discountPrice: 799,
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800'
        ],
        category: fitId,
        brand: 'HydroPro',
        stock: 50,
        isFeatured: false,
        tags: ['bottle', 'fitness', 'travel'],
        specifications: [
          { key: 'Capacity', value: '1000 ml' },
          { key: 'Insulation', value: 'Double Wall Vacuum' }
        ]
      },
      {
        name: 'The Full-Stack Software Engineer Playbook',
        description: 'Essential career roadmap and technical reference manual for modern MERN engineers, DevOps, and cloud deployment.',
        price: 1299,
        discountPrice: 899,
        images: [
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800'
        ],
        category: fitId,
        brand: 'DevPress',
        stock: 45,
        isFeatured: false,
        tags: ['books', 'mern', 'react', 'nodejs'],
        specifications: [
          { key: 'Edition', value: '2026 Edition' },
          { key: 'Language', value: 'English' }
        ]
      }
    ];

    const createdProducts = await Product.create(productsData);

    console.log('[ShopSphere Seed] Creating Coupons...');
    await Coupon.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minimumPurchase: 999,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 500,
        isActive: true
      },
      {
        code: 'FESTIVE20',
        discountType: 'percentage',
        discountValue: 20,
        minimumPurchase: 2499,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 200,
        isActive: true
      },
      {
        code: 'SHOPSPHERE500',
        discountType: 'fixed',
        discountValue: 500,
        minimumPurchase: 4999,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 100,
        isActive: true
      }
    ]);

    console.log('[ShopSphere Seed] Creating Initial Product Reviews...');
    const p1 = createdProducts[0]._id;
    const p2 = createdProducts[1]._id;

    await Review.create({
      user: customerUser._id,
      product: p1,
      rating: 5,
      comment: 'Absolutely stunning audio clarity and noise cancellation! Battery life easily lasts 3 full work days.'
    });

    await Review.create({
      user: customerUser._id,
      product: p2,
      rating: 4,
      comment: 'Sleek AMOLED screen and fast heart rate sensors. Great value for money.'
    });

    console.log('==================================================');
    console.log('✅ ShopSphere Database Seed Completed Successfully!');
    console.log(`👤 Admin Account: admin@shopsphere.com | Password: Admin@123`);
    console.log(`👤 Customer Account: customer@shopsphere.com | Password: User@123`);
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('[ShopSphere Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
