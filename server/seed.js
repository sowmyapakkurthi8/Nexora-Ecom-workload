import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import { saveProductsToCache } from './services/cacheService.js';

const mockProducts = [
  // 1. SMARTPHONES
  {
    sku: 'PHONE-IP16PM',
    name: 'Apple iPhone 16 Pro Max 256GB',
    brand: 'Apple',
    category: 'Smartphones',
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.9,
    reviewCount: 3842,
    badge: 'Best Seller',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Featuring titanium design with textured matte glass back, Super Retina XDR display with ProMotion 120Hz, A18 Pro chip, 48MP Fusion camera system with 5x optical zoom, and Camera Control.',
    specs: {
      'Display': '6.9" Super Retina XDR OLED (2868 x 1320), 120Hz ProMotion',
      'Processor': 'Apple A18 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)',
      'Storage': '256GB NVMe',
      'RAM': '8GB Unified',
      'Camera': '48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto',
      'Battery': 'Up to 33 hours video playback, MagSafe wireless fast charge',
      'OS': 'iOS 18 with Apple Intelligence'
    },
    reviews: [
      {
        author: 'Marcus Vance',
        rating: 5,
        date: '2 days ago',
        title: 'Unbelievable camera and battery life',
        comment: 'The new Camera Control button is super intuitive. Upgraded from the 13 Pro and the difference in speed and battery endurance is night and day.',
        verified: true
      },
      {
        author: 'Elena Rostova',
        rating: 5,
        date: '1 week ago',
        title: 'Lightweight titanium feels premium',
        comment: 'The screen is massive yet it feels noticeably lighter in hand. 5x optical zoom photos come out tack sharp.',
        verified: true
      },
      {
        author: 'David Kim',
        rating: 4,
        date: '2 weeks ago',
        title: 'Great phone, expensive',
        comment: 'Flawless performance and screen. Premium price tag, but if you create content it pays for itself.',
        verified: true
      }
    ]
  },
  {
    sku: 'PHONE-S25ULTRA',
    name: 'Samsung Galaxy S25 Ultra 512GB',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 1299.99,
    originalPrice: 1419.99,
    rating: 4.8,
    reviewCount: 2410,
    badge: 'AI Flagship',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Titanium frame with anti-reflective Gorilla Armor glass. Features built-in S Pen, 200MP Quad Telephoto camera with 100x Space Zoom, and Galaxy AI live translation and photo assist.',
    specs: {
      'Display': '6.8" Dynamic AMOLED 2X (3120 x 1440), 1-120Hz, 2600 nits peak',
      'Processor': 'Qualcomm Snapdragon 8 Elite for Galaxy',
      'Storage': '512GB UFS 4.0',
      'RAM': '12GB LPDDR5X',
      'Camera': '200MP Wide + 50MP 5x Periscope + 10MP 3x + 12MP Ultra-Wide',
      'Battery': '5000 mAh, 45W wired, 15W wireless',
      'OS': 'Android 15 with One UI 7.0'
    },
    reviews: [
      {
        author: 'Sarah Jenkins',
        rating: 5,
        date: '3 days ago',
        title: 'The display anti-reflection is magic',
        comment: 'You can actually read in direct sunlight without turning into a mirror. The S Pen integration is indispensable for my work notes.',
        verified: true
      },
      {
        author: 'Arjun Patel',
        rating: 5,
        date: '2 weeks ago',
        title: 'Best Android ever made',
        comment: 'Snappy Snapdragon chip with virtually zero heating while gaming. Galaxy AI features are genuinely useful.',
        verified: true
      }
    ]
  },
  {
    sku: 'PHONE-PIX9PRO',
    name: 'Google Pixel 9 Pro XL 128GB',
    brand: 'Google',
    category: 'Smartphones',
    price: 999.99,
    originalPrice: 1099.99,
    rating: 4.7,
    reviewCount: 1680,
    badge: 'Pro Camera',
    stock: 52,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered by Google with custom Tensor G4 chip and 16GB RAM for advanced on-device Gemini AI. Iconic camera bar with pro-grade triple rear lenses and Super Res Zoom Video.',
    specs: {
      'Display': '6.8" Super Actua OLED (1344 x 2992), 1-120Hz LTPO, 3000 nits peak',
      'Processor': 'Google Tensor G4 with Titan M2 security coprocessor',
      'Storage': '128GB UFS 3.1',
      'RAM': '16GB LPDDR5X',
      'Camera': '50MP Octa PD + 48MP Quad PD Ultra-Wide + 48MP 5x Telephoto',
      'Battery': '5060 mAh, 37W fast charge, 24+ hour battery life',
      'OS': 'Pure Android 15 with 7 years of OS & security updates'
    },
    reviews: [
      {
        author: 'Chloe Dupont',
        rating: 5,
        date: '5 days ago',
        title: 'Pixel camera photography never misses',
        comment: 'Colors are natural, skin tones are accurate, and Magic Editor handles reflections and background clutter effortlessly.',
        verified: true
      }
    ]
  },

  // 2. LAPTOPS
  {
    sku: 'LAP-MBP16M4',
    name: 'Apple MacBook Pro 16" M4 Pro 24GB',
    brand: 'Apple',
    category: 'Laptops',
    price: 2499.99,
    originalPrice: 2699.99,
    rating: 4.9,
    reviewCount: 1950,
    badge: 'Powerhouse',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Supercharged by Apple M4 Pro with a 14-core CPU and 20-core GPU. Liquid Retina XDR display with nano-texture option, up to 24 hours of battery life, and Thunderbolt 5 support.',
    specs: {
      'Display': '16.2" Liquid Retina XDR (3456 x 2234), 1600 nits peak HDR, 120Hz ProMotion',
      'Processor': 'Apple M4 Pro (14-core CPU, 20-core GPU, 16-core Neural Engine)',
      'Memory': '24GB Unified Memory (273 GB/s bandwidth)',
      'Storage': '512GB Ultra-Fast SSD',
      'Ports': '3x Thunderbolt 5 (USB-C), HDMI 2.1, SDXC card slot, MagSafe 3',
      'Battery': '100Wh lithium-polymer, up to 24 hours battery life',
      'Weight': '2.14 kg (4.7 lbs)'
    },
    reviews: [
      {
        author: 'Devin Cole',
        rating: 5,
        date: '4 days ago',
        title: 'Xcode compiles in seconds, fans rarely spin',
        comment: 'The M4 Pro is a beast. Battery easily lasts a full 10-hour remote coding session without ever plugging in.',
        verified: true
      },
      {
        author: 'Nadia Thorne',
        rating: 5,
        date: '2 weeks ago',
        title: 'Best display and speakers on any laptop period',
        comment: 'Color grading video on this screen is magnificent. The 6-speaker spatial audio sounds like studio monitors.',
        verified: true
      }
    ]
  },
  {
    sku: 'LAP-DELLXPS16',
    name: 'Dell XPS 16 OLED 4K Core Ultra 9',
    brand: 'Dell',
    category: 'Laptops',
    price: 2199.99,
    originalPrice: 2399.99,
    rating: 4.6,
    reviewCount: 920,
    badge: 'Creator Pick',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Machined aluminum chassis with seamless glass touchpad and capacitive touch function row. Powered by Intel Core Ultra 9 with dedicated NVIDIA GeForce RTX 4070 studio graphics.',
    specs: {
      'Display': '16.3" 4K+ (3840 x 2400) OLED InfinityEdge Touch, 100% DCI-P3',
      'Processor': 'Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4070 8GB GDDR6 (60W)',
      'Memory': '32GB LPDDR5x 7467MHz Dual Channel',
      'Storage': '1TB M.2 PCIe NVMe SSD',
      'Battery': '99.5Wh, ExpressCharge 130W USB-C',
      'OS': 'Windows 11 Pro'
    },
    reviews: [
      {
        author: 'Liam O’Connor',
        rating: 5,
        date: '1 week ago',
        title: 'OLED screen is breathtaking',
        comment: 'Deep blacks and vivid colors. Blender renders fly on the RTX 4070. Modern minimalist build.',
        verified: true
      }
    ]
  },
  {
    sku: 'LAP-ASUSROG16',
    name: 'ASUS ROG Zephyrus G16 Gaming Laptop',
    brand: 'ASUS ROG',
    category: 'Laptops',
    price: 1999.99,
    originalPrice: 2249.99,
    rating: 4.8,
    reviewCount: 1340,
    badge: 'Ultra Gaming',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-thin CNC aluminum gaming laptop with Slash Lighting matrix lid. ROG Nebula 2.5K 240Hz OLED display, AMD Ryzen AI 9 processor, and RTX 4080 with vapor chamber cooling.',
    specs: {
      'Display': '16" 2.5K (2560 x 1600) ROG Nebula OLED, 240Hz, 0.2ms, G-SYNC',
      'Processor': 'AMD Ryzen AI 9 HX 370 (12 Cores, 24 Threads, 50 TOPS NPU)',
      'Graphics': 'NVIDIA GeForce RTX 4080 12GB GDDR6',
      'Memory': '32GB LPDDR5X 7500MHz',
      'Storage': '2TB PCIe 4.0 NVMe M.2 SSD',
      'Weight': '1.85 kg (4.07 lbs) ultra-portable',
      'OS': 'Windows 11 Home'
    },
    reviews: [
      {
        author: 'Kenji Sato',
        rating: 5,
        date: '5 days ago',
        title: 'Plays Cyberpunk at max settings smoothly',
        comment: 'The 240Hz OLED panel has zero ghosting. Incredibly slim for having an RTX 4080 inside.',
        verified: true
      }
    ]
  },

  // 3. AUDIO & HEADPHONES
  {
    sku: 'AUD-SONYXM5',
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    brand: 'Sony',
    category: 'Audio',
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviewCount: 5120,
    badge: 'Top Rated Audio',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Two processors and 8 microphones deliver flagship Active Noise Cancellation. Precision-engineered 30mm carbon driver units support Hi-Res Audio Wireless and LDAC codec with 30-hour battery life.',
    specs: {
      'Driver': '30mm specially designed carbon fiber composite dome',
      'Noise Cancellation': 'Dual Processor V1 + HD Noise Cancelling Processor QN1',
      'Battery Life': '30 hours with ANC on (3-minute quick charge yields 3 hours)',
      'Bluetooth': 'v5.2, Multipoint connection (pair 2 devices simultaneously)',
      'Codecs': 'LDAC, AAC, SBC with DSEE Extreme audio upscaling',
      'Weight': '250 grams lightweight soft-fit leather'
    },
    reviews: [
      {
        author: 'Rachel Adams',
        rating: 5,
        date: '1 day ago',
        title: 'Makes flights completely silent',
        comment: 'Cuts out airplane cabin roar instantly. The microphone clarity on Zoom meetings is exceptional.',
        verified: true
      },
      {
        author: 'Tyler Brooks',
        rating: 5,
        date: '1 week ago',
        title: 'Super comfortable for all-day wear',
        comment: 'No ear fatigue even after 8 hours. LDAC streaming from my phone delivers pristine detail.',
        verified: true
      }
    ]
  },
  {
    sku: 'AUD-AIRPODSMAX2',
    name: 'Apple AirPods Max (USB-C) Space Gray',
    brand: 'Apple',
    category: 'Audio',
    price: 499.99,
    originalPrice: 549.99,
    rating: 4.7,
    reviewCount: 3100,
    badge: 'Luxury Audio',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Apple-designed 40mm dynamic driver provides high-fidelity audio. Breathable knit mesh canopy, anodized aluminum cups, Personalized Spatial Audio with dynamic head tracking, and USB-C charging.',
    specs: {
      'Audio Tech': 'Apple H1 chip in each ear cup, Adaptive EQ, Active Noise Cancellation',
      'Connectivity': 'Bluetooth 5.3, USB-C Lossless Audio streaming',
      'Spatial Audio': 'Personalized Spatial Audio with dynamic head tracking',
      'Battery': 'Up to 20 hours listening time on a single charge with ANC',
      'Smart Case': 'Ultra-low-power standby mode smart case included'
    },
    reviews: [
      {
        author: 'Jessica Martin',
        rating: 5,
        date: '3 days ago',
        title: 'Transparency mode is unbelievable',
        comment: 'Sounds exactly like you aren’t wearing headphones. The aluminum build quality feels like luxury jewelry.',
        verified: true
      }
    ]
  },
  {
    sku: 'AUD-BOSEQCULTRA',
    name: 'Bose QuietComfort Ultra Earbuds',
    brand: 'Bose',
    category: 'Audio',
    price: 279.99,
    originalPrice: 299.99,
    rating: 4.6,
    reviewCount: 1840,
    badge: 'Spatial ANC',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Breakthrough Bose Immersive Audio spatializes sound for natural, open acoustics. CustomTune technology auto-calibrates noise cancelling and sound response to the unique shape of your ear canal.',
    specs: {
      'Audio Tech': 'Bose Immersive Audio + CustomTune sound calibration',
      'Noise Cancellation': 'Quiet Mode, Aware Mode with ActiveSense, Immersion Mode',
      'Battery': 'Up to 6 hours continuous (24 total with wireless charging case)',
      'Water Resistance': 'IPX4 sweat and weather resistant',
      'Mics': 'Advanced noise-rejecting microphones for wind filtering'
    },
    reviews: [
      {
        author: 'Daniel Craig',
        rating: 5,
        date: '1 week ago',
        title: 'Best in-ear noise cancellation on the market',
        comment: 'Blocks coffee shop chatter completely. Fits comfortably during gym workouts.',
        verified: true
      }
    ]
  },

  // 4. SMARTWATCHES & WEARABLES
  {
    sku: 'WATCH-APPLEU2',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    brand: 'Apple',
    category: 'Smartwatches',
    price: 779.99,
    originalPrice: 799.99,
    rating: 4.9,
    reviewCount: 2190,
    badge: 'Extreme Sports',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rugged titanium case with flat sapphire front crystal. 3000-nit display, S9 SiP with Double Tap gesture, precision dual-frequency GPS, depth gauge for diving to 40m, and 72-hour Low Power battery.',
    specs: {
      'Case': '49mm aerospace-grade titanium with raised bezel',
      'Display': 'Always-On Retina display, 3000 nits brightness',
      'Water Resistance': '100m water resistant, certified EN13319 scuba dive to 40m',
      'Battery': 'Up to 36 hours normal use (72 hours Low Power Mode)',
      'Sensors': 'Depth gauge, water temperature, ECG, Blood Oxygen, dual GPS'
    },
    reviews: [
      {
        author: 'Brett Hunter',
        rating: 5,
        date: '4 days ago',
        title: 'Survives grueling ultramarathons effortlessly',
        comment: 'GPS accuracy under heavy tree cover is pin-point. The siren alert gave peace of mind on remote trails.',
        verified: true
      }
    ]
  },
  {
    sku: 'WATCH-GARMINF7P',
    name: 'Garmin Fenix 7 Pro Sapphire Solar Edition',
    brand: 'Garmin',
    category: 'Smartwatches',
    price: 799.99,
    originalPrice: 899.99,
    rating: 4.8,
    reviewCount: 1450,
    badge: 'Solar Endurance',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultimate multisport GPS smartwatch with Power Sapphire solar charging lens, built-in LED flashlight, preloaded TopoActive maps, and up to 22 days of battery life in smartwatch mode.',
    specs: {
      'Display': '1.3" sunlight-visible transflective memory-in-pixel (MIP)',
      'Lens & Bezel': 'Power Sapphire scratch-resistant lens, titanium bezel',
      'Battery Life': 'Up to 22 days with solar charging (73 hours full GPS)',
      'Flashlight': 'Built-in multi-LED variable white/red flashlight',
      'Training': 'Endurance score, Hill score, VO2 max, HRV status, recovery time'
    },
    reviews: [
      {
        author: 'Scott Miller',
        rating: 5,
        date: '2 weeks ago',
        title: 'Never charge your watch again',
        comment: 'Solar charging actually works. The LED flashlight gets used every single night.',
        verified: true
      }
    ]
  },

  // 5. GAMING & CONSOLES
  {
    sku: 'GAME-PS5PRO',
    name: 'Sony PlayStation 5 Pro Console 2TB',
    brand: 'Sony',
    category: 'Gaming',
    price: 699.99,
    originalPrice: 749.99,
    rating: 4.9,
    reviewCount: 4120,
    badge: 'Next-Gen 4K 120Hz',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'PlayStation Spectral Super Resolution (PSSR) AI upscaling delivers ultra-crisp 4K fidelity at 60fps and 120fps. Advanced Ray Tracing architecture with 2TB high-speed NVMe SSD and DualSense wireless controller.',
    specs: {
      'GPU': '67% more Compute Units, 28% faster memory for 45% faster rendering',
      'Ray Tracing': 'Advanced 2-3x dynamic ray tracing reflections and refractions',
      'Storage': '2TB Custom Ultra-High Speed NVMe SSD (5.5 GB/s raw)',
      'Video Output': 'HDMI 2.1, 4K 120Hz, 8K ready, VRR support',
      'Networking': 'Wi-Fi 7 (IEEE 802.11be), Gigabit Ethernet'
    },
    reviews: [
      {
        author: 'Alex Turner',
        rating: 5,
        date: '1 day ago',
        title: 'Spider-Man 2 and Rebirth look jaw-dropping',
        comment: 'No more choosing between Performance mode and Fidelity mode. You get 60fps with full 4K ray tracing visuals.',
        verified: true
      }
    ]
  },
  {
    sku: 'GAME-STEAMDECK1TB',
    name: 'Valve Steam Deck OLED 1TB Handheld',
    brand: 'Valve',
    category: 'Gaming',
    price: 649.99,
    originalPrice: 679.99,
    rating: 4.9,
    reviewCount: 2980,
    badge: 'PC Handheld',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1612287233207-6b455b57f070?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1612287233207-6b455b57f070?auto=format&fit=crop&w=800&q=80'
    ],
    description: '7.4" 90Hz HDR OLED display with million-to-one contrast ratio. Custom 6nm AMD APU, premium anti-glare etched glass, 50Wh battery delivering 3-12 hours of PC gaming on the go.',
    specs: {
      'Display': '7.4" HDR OLED (1280 x 800), 90Hz, 1,000 nits peak HDR, sub-0.1ms response',
      'APU': '6nm AMD "Sephiroth" 4-core Zen 2 + 8 RDNA 2 CUs',
      'Storage': '1TB NVMe SSD + High-Speed microSD slot',
      'Battery': '50Wh (30-50% longer life than original LCD Deck)',
      'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3 with dedicated antenna'
    },
    reviews: [
      {
        author: 'Gordon Reed',
        rating: 5,
        date: '3 days ago',
        title: 'The OLED screen transformed handheld gaming',
        comment: 'Pure inky blacks and vibrant HDR. Plays Hades 2 and Elden Ring on the couch flawlessly.',
        verified: true
      }
    ]
  },

  // 6. CAMERAS & SMART HOME
  {
    sku: 'CAM-SONYA7IV',
    name: 'Sony Alpha 7 IV Full-Frame Mirrorless Camera',
    brand: 'Sony',
    category: 'Cameras',
    price: 2498.99,
    originalPrice: 2699.99,
    rating: 4.8,
    reviewCount: 1120,
    badge: 'Pro Creator',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
    ],
    description: '33MP full-frame Exmor R back-illuminated CMOS sensor. 4K 60p 10-bit 4:2:2 video, real-time Eye AF for humans, animals, and birds, 5-axis optical image stabilization with 5.5 stops.',
    specs: {
      'Sensor': '33.0 Megapixel Full-Frame Exmor R CMOS',
      'Processor': 'BIONZ XR processing engine with 8x more processing power',
      'Autofocus': '759 phase-detection AF points covering 94% of image area',
      'Video': '4K 60p in Super35, 4K 30p full-frame oversampled from 7K',
      'Stabilization': '5-axis in-body optical image stabilization (5.5-step pitch/yaw)'
    },
    reviews: [
      {
        author: 'Mateo Rossi',
        rating: 5,
        date: '1 week ago',
        title: 'The hybrid shooter benchmark',
        comment: 'Stunning dynamic range for client photoshoots and seamless cinematic color profiles for YouTube 4K content.',
        verified: true
      }
    ]
  },
  {
    sku: 'CAM-DJIMINI4PRO',
    name: 'DJI Mini 4 Pro Drone with RC 2 Controller',
    brand: 'DJI',
    category: 'Cameras',
    price: 959.99,
    originalPrice: 1049.99,
    rating: 4.9,
    reviewCount: 1650,
    badge: 'Sub-249g Flagship',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Under 249 grams (no FAA registration required in most countries). Omnidirectional obstacle sensing, 4K/60fps HDR True Vertical shooting, 20km FHD video transmission, and ActiveTrack 360° subject tracking.',
    specs: {
      'Weight': '< 249 grams lightweight folding design',
      'Camera': '1/1.3-inch CMOS, f/1.7 aperture, 48MP raw photos, 4K/60fps HDR',
      'Obstacle Sensing': 'Omnidirectional vision sensing + downward 3D infrared',
      'Flight Time': 'Up to 34 minutes per battery (Intelligent Flight Battery)',
      'Transmission': 'DJI O4 HD video transmission up to 20 km range'
    },
    reviews: [
      {
        author: 'Lucas Vance',
        rating: 5,
        date: '4 days ago',
        title: 'Incredible stability in coastal winds',
        comment: 'The RC 2 screen is bright and responsive. True vertical shooting saves so much time for social media video delivery.',
        verified: true
      }
    ]
  }
];

export const seedDatabase = async () => {
  await connectDB();

  console.log('[Seed] Seeding rich real-world e-commerce database...');

  // Seed default test user matching Postman collection
  const existingUser = await User.findOne({ email: 'testuser@example.com' });
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('SecurePassword123', salt);
    await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword,
    });
    console.log('[Seed] Test user created: testuser@example.com / SecurePassword123');
  } else {
    console.log('[Seed] Test user already exists: testuser@example.com');
  }

  // Seed products
  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(mockProducts);
  console.log(`[Seed] Seeded ${insertedProducts.length} rich electronics products into MongoDB.`);

  // Warm up local fs cache with enriched items
  const plainProducts = insertedProducts.map((p) => p.toObject());
  saveProductsToCache(plainProducts);
  console.log('[Seed] Warmed up local filesystem cache (products_cache.json).');
};

// Allow direct CLI execution: node server/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error:', err);
      process.exit(1);
    });
}
