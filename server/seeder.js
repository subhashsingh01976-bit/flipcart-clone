const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const sampleProducts = [
  {
    name: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    category: "Mobiles",
    price: 134999,
    originalPrice: 159999,
    description: "Samsung Galaxy S24 Ultra 5G with 200MP camera, S Pen, 12GB RAM, 256GB Storage",
    highlights: ["200MP Camera", "S Pen Included", "12GB RAM", "5000mAh Battery", "AI Features"],
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"],
    specs: new Map([["RAM", "12GB"], ["Storage", "256GB"], ["Display", "6.8 inch"], ["Battery", "5000mAh"], ["OS", "Android 14"]]),
    seller: "RetailNet",
    freeDelivery: true,
    assured: true,
    rating: 4.5,
    numReviews: 12453,
    stock: 50,
    isFeatured: true,
    tags: ["samsung", "5g", "ultra"],
  },
  {
    name: "Apple iPhone 15 Pro Max 256GB",
    brand: "Apple",
    category: "Mobiles",
    price: 159900,
    originalPrice: 189900,
    description: "Apple iPhone 15 Pro Max with A17 Pro chip, 48MP camera, Titanium design",
    highlights: ["A17 Pro Chip", "48MP Camera", "USB-C", "Action Button", "Titanium Build"],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80"],
    specs: new Map([["RAM", "8GB"], ["Storage", "256GB"], ["Display", "6.7 inch"], ["Battery", "4422mAh"], ["OS", "iOS 17"]]),
    seller: "Apple Certified Store",
    freeDelivery: true,
    assured: true,
    rating: 4.7,
    numReviews: 23109,
    stock: 30,
    isFeatured: true,
    tags: ["apple", "iphone", "5g"],
  },
  {
    name: "OnePlus 12 5G (16GB RAM, 512GB)",
    brand: "OnePlus",
    category: "Mobiles",
    price: 64999,
    originalPrice: 69999,
    description: "OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera, 100W fast charging",
    highlights: ["Snapdragon 8 Gen 3", "100W Charging", "50MP Hasselblad Camera", "16GB RAM"],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80"],
    specs: new Map([["RAM", "16GB"], ["Storage", "512GB"], ["Display", "6.82 inch"], ["Battery", "5400mAh"]]),
    seller: "OnePlus Official",
    freeDelivery: true,
    assured: true,
    rating: 4.4,
    numReviews: 8743,
    stock: 45,
    isFeatured: false,
    tags: ["oneplus", "5g"],
  },
  {
    name: "Apple MacBook Air M3",
    brand: "Apple",
    category: "Electronics",
    price: 114900,
    originalPrice: 124900,
    description: "Apple MacBook Air with M3 chip, 13.6-inch Liquid Retina display, all-day battery",
    highlights: ["M3 Chip", "18-hour Battery", "8GB Unified Memory", "MagSafe Charging"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80"],
    specs: new Map([["RAM", "8GB"], ["Storage", "256GB SSD"], ["Display", "13.6 inch"], ["OS", "macOS Sonoma"]]),
    seller: "Apple Premium Reseller",
    freeDelivery: true,
    assured: true,
    rating: 4.8,
    numReviews: 9871,
    stock: 20,
    isFeatured: true,
    tags: ["apple", "laptop", "macbook"],
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Electronics",
    price: 24990,
    originalPrice: 34990,
    description: "Sony WH-1000XM5 with Industry-leading noise cancellation, 30hr battery",
    highlights: ["Industry Best ANC", "30hr Battery", "Multipoint Connection", "Hi-Res Audio"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"],
    specs: new Map([["Type", "Over-Ear"], ["Connectivity", "Bluetooth 5.2"], ["Battery", "30 hours"]]),
    seller: "Sony Official",
    freeDelivery: true,
    assured: true,
    rating: 4.6,
    numReviews: 31205,
    stock: 80,
    isFeatured: true,
    tags: ["sony", "headphones", "anc"],
  },
  {
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    category: "Fashion",
    price: 12995,
    originalPrice: 16995,
    description: "Nike Air Max 270 with Max Air unit for all-day comfort and style",
    highlights: ["270° Max Air Unit", "Lightweight Mesh Upper", "Rubber Outsole"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"],
    specs: new Map([["Type", "Running"], ["Material", "Mesh"], ["Sole", "Rubber"]]),
    seller: "Nike Official Store",
    freeDelivery: true,
    assured: true,
    rating: 4.3,
    numReviews: 45632,
    stock: 100,
    isFeatured: false,
    tags: ["nike", "shoes", "running"],
  },
  {
    name: "Philips Air Fryer HD9200 1400W",
    brand: "Philips",
    category: "Home",
    price: 6995,
    originalPrice: 12995,
    description: "Philips Air Fryer uses Rapid Air technology for 90% less fat cooking",
    highlights: ["90% Less Fat", "1400W", "4.1L Capacity", "Rapid Air Technology"],
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&q=80"],
    specs: new Map([["Power", "1400W"], ["Capacity", "4.1L"], ["Temperature", "80-200°C"]]),
    seller: "Philips Store",
    freeDelivery: true,
    assured: true,
    rating: 4.4,
    numReviews: 34521,
    stock: 60,
    isFeatured: false,
    tags: ["philips", "kitchen", "airfryer"],
  },
  {
    name: "Samsung 55-inch 4K QLED Smart TV",
    brand: "Samsung",
    category: "Electronics",
    price: 79999,
    originalPrice: 119999,
    description: "Samsung 55-inch QLED 4K Smart TV with Quantum HDR, 120Hz refresh rate",
    highlights: ["QLED Display", "4K Resolution", "120Hz", "Smart TV with Tizen OS"],
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=400&q=80"],
    specs: new Map([["Size", "55 inch"], ["Resolution", "4K UHD"], ["Panel", "QLED"], ["Refresh Rate", "120Hz"]]),
    seller: "Samsung SmartPlaza",
    freeDelivery: true,
    assured: true,
    rating: 4.4,
    numReviews: 7832,
    stock: 25,
    isFeatured: true,
    tags: ["samsung", "tv", "4k", "qled"],
  },
  {
    name: "boAt Airdopes 141 TWS Earbuds",
    brand: "boAt",
    category: "Electronics",
    price: 999,
    originalPrice: 4990,
    description: "boAt Airdopes 141 TWS Earbuds with 42H Playtime, Environmental Noise Cancellation",
    highlights: ["42H Total Playtime", "ENxTM Technology", "IPX4 Water Resistant"],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"],
    specs: new Map([["Type", "In-Ear"], ["Connectivity", "Bluetooth 5.0"], ["Battery", "42 hours total"]]),
    seller: "boAt Lifestyle",
    freeDelivery: true,
    assured: true,
    rating: 4.0,
    numReviews: 234098,
    stock: 200,
    isFeatured: false,
    tags: ["boat", "earbuds", "tws"],
  },
  {
    name: "LG 8 Kg 5 Star Front Load Washing Machine",
    brand: "LG",
    category: "Appliances",
    price: 44990,
    originalPrice: 56990,
    description: "LG 8 Kg Front Load Washing Machine with AI DD, Steam, ThinQ",
    highlights: ["AI DD Technology", "Steam Wash", "6 Motion DD", "ThinQ App Control"],
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80",
    images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80"],
    specs: new Map([["Capacity", "8 Kg"], ["Energy Rating", "5 Star"], ["Type", "Front Load"]]),
    seller: "LG Best Shop",
    freeDelivery: true,
    assured: true,
    rating: 4.4,
    numReviews: 11234,
    stock: 15,
    isFeatured: false,
    tags: ["lg", "washing machine", "appliance"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding...");

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} products seeded`);

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@flipkart.com",
      password: "admin123",
      role: "admin",
      phone: "9999999999",
    });
    console.log(`✅ Admin user created: ${admin.email} / admin123`);

    // Create test user
    const testUser = await User.create({
      name: "Test User",
      email: "test@flipkart.com",
      password: "test1234",
      phone: "8888888888",
    });
    console.log(`✅ Test user created: ${testUser.email} / test1234`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("──────────────────────────────────");
    console.log("Admin: admin@flipkart.com / admin123");
    console.log("User:  test@flipkart.com / test1234");
    console.log("──────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
