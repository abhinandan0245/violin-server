// src/seed/destinations.js
const destinationsData = [
  // ============ DOMESTIC DESTINATIONS (INDIA) ============
  
  // Rajasthan - Royal Heritage
  {
    country: "India",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Royal Heritage",
    price: "₹55,000",
    description: "The Pink City - Known for its royal palaces, forts, and vibrant culture. Famous for Hawa Mahal, City Palace, and Amber Fort.",
    tags: ["heritage", "royal", "palace", "pink city", "fort"],
    featured: true,
    isActive: true
  },
  {
    country: "India",
    state: "Rajasthan",
    city: "Udaipur",
    category: "Royal Heritage",
    price: "₹65,000",
    description: "The City of Lakes - Venice of the East with beautiful palaces, lakes, and romantic ambiance. Home to Lake Palace and City Palace.",
    tags: ["lakes", "palace", "romantic", "heritage", "city of lakes"],
    featured: true,
    isActive: true
  },
  {
    country: "India",
    state: "Rajasthan",
    city: "Jodhpur",
    category: "Royal Heritage",
    price: "₹50,000",
    description: "The Blue City - Home to the magnificent Mehrangarh Fort and vibrant blue houses. Gateway to the Thar Desert.",
    tags: ["blue city", "fort", "heritage", "royal", "desert"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Rajasthan",
    city: "Pushkar",
    category: "Hills & Spirituality",
    price: "₹35,000",
    description: "Sacred city with the only Brahma Temple in the world and the holy Pushkar Lake. Famous for the annual Pushkar Camel Fair.",
    tags: ["spiritual", "lake", "temple", "holy", "camel fair"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Rajasthan",
    city: "Jaisalmer",
    category: "Royal Heritage",
    price: "₹45,000",
    description: "The Golden City - Stunning sandstone architecture in the heart of the Thar Desert. Famous for Jaisalmer Fort and desert safaris.",
    tags: ["golden city", "desert", "sandstone", "heritage", "fort"],
    featured: false,
    isActive: true
  },

  // North India
  {
    country: "India",
    state: "Delhi",
    city: "Delhi",
    category: "Royal Heritage",
    price: "₹40,000",
    description: "The Capital City - A perfect blend of ancient heritage and modern India. Home to Red Fort, Qutub Minar, and India Gate.",
    tags: ["capital", "heritage", "modern", "culture", "historical"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Uttarakhand",
    city: "Dehradun",
    category: "Mountains & Serenity",
    price: "₹38,000",
    description: "Gateway to the Himalayas - Surrounded by scenic beauty, pine forests, and majestic mountains. Perfect for nature lovers.",
    tags: ["mountains", "himalayas", "nature", "serenity", "pine forest"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Punjab",
    city: "Ludhiana",
    category: "Scenic Beauty",
    price: "₹32,000",
    description: "Heart of Punjab - Rich in culture, tradition, and vibrant energy. Known for its agriculture and warm hospitality.",
    tags: ["punjab", "culture", "traditional", "vibrant", "agriculture"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Chandigarh",
    city: "Chandigarh",
    category: "Scenic Beauty",
    price: "₹35,000",
    description: "The City Beautiful - India's first planned city designed by Le Corbusier. Known for its modern architecture and serene environment.",
    tags: ["modern", "planned city", "beautiful", "clean", "architecture"],
    featured: false,
    isActive: true
  },

  // Western India
  {
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    category: "Beach & Luxury",
    price: "₹70,000",
    description: "The City of Dreams - Gateway of India with stunning coastline, vibrant nightlife, and the heart of Bollywood.",
    tags: ["luxury", "beach", "vibrant", "bollywood", "gateway of india"],
    featured: true,
    isActive: true
  },
  {
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    category: "Royal Heritage",
    price: "₹38,000",
    description: "The Heritage City - Rich in history, culture, and stunning architecture. Known for Sabarmati Ashram and the old city.",
    tags: ["heritage", "culture", "textile", "history", "gandhi"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Gujarat",
    city: "Gandhidham",
    category: "Scenic Beauty",
    price: "₹30,000",
    description: "Gateway to Kutch - Known for its rich culture, handicrafts, and proximity to the Great Rann of Kutch.",
    tags: ["kutch", "handicrafts", "culture", "traditional", "rann"],
    featured: false,
    isActive: true
  },

  // South India
  {
    country: "India",
    state: "Kerala",
    city: "Kochi",
    category: "Backwaters & Traditions",
    price: "₹48,000",
    description: "Queen of the Arabian Sea - Gateway to Kerala's famous backwaters, rich in colonial history and traditional arts.",
    tags: ["backwaters", "kerala", "arabian sea", "traditions", "colonial"],
    featured: false,
    isActive: true
  },
  {
    country: "India",
    state: "Karnataka",
    city: "Bengaluru",
    category: "Scenic Beauty",
    price: "₹42,000",
    description: "The Silicon Valley of India - Garden City with pleasant weather, lush parks, and a vibrant tech culture.",
    tags: ["garden city", "it hub", "pleasant", "modern", "tech"],
    featured: false,
    isActive: true
  },

  // Other Indian States
  {
    country: "India",
    state: "Goa",
    city: "Goa",
    category: "Beach & Luxury",
    price: "₹60,000",
    description: "The Beach Paradise - Famous for its stunning beaches, vibrant nightlife, Portuguese heritage, and water sports.",
    tags: ["beach", "party", "luxury", "water sports", "portuguese"],
    featured: true,
    isActive: true
  },
  {
    country: "India",
    state: "Uttar Pradesh",
    city: "Agra",
    category: "Royal Heritage",
    price: "₹42,000",
    description: "Home to the Taj Mahal - Symbol of eternal love and one of the Seven Wonders of the World. Rich in Mughal heritage.",
    tags: ["taj mahal", "heritage", "love", "monument", "mughal"],
    featured: false,
    isActive: true
  },

  // ============ INTERNATIONAL DESTINATIONS ============
  
  {
    country: "Nepal",
    state: "Bagmati Province",
    city: "Kathmandu",
    category: "Hills & Spirituality",
    price: "₹45,000",
    description: "The Himalayan Gem - Rich in culture, spirituality, and ancient temples. Gateway to the majestic Himalayas.",
    tags: ["himalayas", "spiritual", "culture", "temples", "mountains"],
    featured: false,
    isActive: true
  },
  {
    country: "United Arab Emirates",
    state: "Dubai",
    city: "Dubai",
    category: "Beach & Luxury",
    price: "₹85,000",
    description: "The City of Gold - Ultimate luxury destination with iconic architecture, luxury shopping, and desert adventures.",
    tags: ["luxury", "shopping", "modern", "desert", "iconic"],
    featured: true,
    isActive: true
  },
  {
    country: "United Arab Emirates",
    state: "Abu Dhabi",
    city: "Abu Dhabi",
    category: "Beach & Luxury",
    price: "₹80,000",
    description: "The Capital City - Modern elegance meets cultural richness. Home to the magnificent Sheikh Zayed Grand Mosque.",
    tags: ["luxury", "modern", "culture", "heritage", "mosque"],
    featured: false,
    isActive: true
  },
  {
    country: "Bahrain",
    state: "Capital Governorate",
    city: "Manama",
    category: "Beach & Luxury",
    price: "₹65,000",
    description: "The Island Nation - A perfect blend of tradition and modernity with stunning coastlines and rich history.",
    tags: ["island", "modern", "culture", "middle east", "coastal"],
    featured: false,
    isActive: true
  },
  {
    country: "Australia",
    state: "New South Wales",
    city: "Sydney",
    category: "Beach & Luxury",
    price: "₹95,000",
    description: "The Harbour City - World-famous for its iconic Opera House, beautiful beaches, and vibrant cosmopolitan lifestyle.",
    tags: ["iconic", "beach", "modern", "vibrant", "opera house"],
    featured: true,
    isActive: true
  },
  {
    country: "Thailand",
    state: "Bangkok",
    city: "Bangkok",
    category: "Beach & Luxury",
    price: "₹50,000",
    description: "The City of Angels - Vibrant culture, amazing cuisine, stunning temples, and exciting nightlife.",
    tags: ["vibrant", "culture", "temple", "street food", "nightlife"],
    featured: false,
    isActive: true
  }
];

module.exports = destinationsData;