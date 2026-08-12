// src/seed/portfolio.js
const portfolioData = [
  // Royal Weddings - India
  {
    title: "Royal Palace Wedding in Udaipur",
    location: "Udaipur, Rajasthan, India",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    date: "2024-11-15",
    guests: 350,
    description: "A magnificent royal wedding at the iconic Lake Palace with traditional Rajasthani ceremonies, elephant procession, and a grand reception under the stars. The celebration featured vibrant colors, live folk music, and exquisite royal cuisine.",
    highlights: ["Elephant Procession", "Lake View Ceremony", "Royal Feast", "Fireworks Display"],
    featured: true,
    clientName: "Ananya & Rohan Singh",
    clientTestimonial: "Violin Events made our dream wedding a reality. The attention to detail and royal treatment was beyond our expectations!",
    videoUrl: "https://www.youtube.com/watch?v=example1"
  },
  {
    title: "Heritage Fort Wedding in Jaipur",
    location: "Jaipur, Rajasthan, India",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    date: "2024-12-05",
    guests: 500,
    description: "A grand celebration at the historic Amber Fort featuring traditional Rajasthani rituals, royal darbar, and a spectacular candlelit dinner with panoramic city views.",
    highlights: ["Fort Ceremony", "Royal Darbar", "Candlelit Dinner", "Cultural Performances"],
    featured: true,
    clientName: "Meera & Karan Rathore",
    clientTestimonial: "The most magical day of our lives. Violin Events transformed our vision into a fairy tale!",
    videoUrl: "https://www.youtube.com/watch?v=example2"
  },
  {
    title: "Mysore Palace Grand Wedding",
    location: "Mysore, Karnataka, India",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1590582007337-f5d55ec5aaf0?w=800&q=80",
    date: "2025-01-20",
    guests: 600,
    description: "A breathtaking wedding at the illuminated Mysore Palace with grand processions, traditional South Indian ceremonies, and a lavish reception with royal decor.",
    highlights: ["Palace Illumination", "Grand Procession", "South Indian Rituals", "Royal Banquet"],
    featured: false,
    clientName: "Priya & Vikram Raj",
    clientTestimonial: "An unforgettable experience! The palace setting was absolutely magical.",
    videoUrl: null
  },

  // Destination Weddings
  {
    title: "Beachfront Wedding in Phuket",
    location: "Phuket, Thailand",
    category: "Destination Weddings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    date: "2025-02-14",
    guests: 180,
    description: "A stunning sunset beach wedding with Thai-inspired decor, traditional Buddhist blessings, and an elegant reception with Thai cuisine and fire dancers.",
    highlights: ["Sunset Ceremony", "Beach Decor", "Fire Dancers", "Thai Cuisine"],
    featured: true,
    clientName: "Ishita & Arjun Sharma",
    clientTestimonial: "An unforgettable destination wedding. Our guests are still talking about the breathtaking sunset ceremony!",
    videoUrl: "https://www.youtube.com/watch?v=example3"
  },
  {
    title: "Italian Villa Wedding in Tuscany",
    location: "Tuscany, Italy",
    category: "Destination Weddings",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
    date: "2025-05-10",
    guests: 150,
    description: "A romantic wedding at a 15th-century Tuscan villa surrounded by vineyards and olive groves, featuring Italian cuisine, live opera, and breathtaking countryside views.",
    highlights: ["Vineyard Setting", "Italian Opera", "Gourmet Dinner", "Olive Grove Ceremony"],
    featured: false,
    clientName: "Sophia & Marco Rossi",
    clientTestimonial: "A dream come true! The Tuscan setting was absolutely perfect.",
    videoUrl: null
  },
  {
    title: "Overwater Wedding in Maldives",
    location: "Maldives",
    category: "Destination Weddings",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    date: "2025-06-15",
    guests: 80,
    description: "An intimate overwater wedding with crystal-clear turquoise waters, underwater photography, and a private dinner on the beach with personalized service.",
    highlights: ["Overwater Ceremony", "Underwater Photos", "Private Beach Dinner", "Water Sports"],
    featured: false,
    clientName: "Emma & David Wilson",
    clientTestimonial: "Pure paradise! The most incredible wedding experience imaginable.",
    videoUrl: "https://www.youtube.com/watch?v=example4"
  },

  // Pre-Wedding
  {
    title: "Romantic Pre-Wedding in Kerala Backwaters",
    location: "Kerala, India",
    category: "Pre-Wedding",
    image: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80",
    date: "2024-10-28",
    guests: 60,
    description: "A beautiful pre-wedding photoshoot and celebration on a traditional houseboat through the serene Kerala backwaters with stunning sunset views.",
    highlights: ["Houseboat Cruise", "Sunset Photography", "Traditional Kerala Cuisine", "Cultural Performances"],
    featured: false,
    clientName: "Nisha & Arjun Nair",
    clientTestimonial: "The backwaters provided the most romantic setting for our pre-wedding shoot!",
    videoUrl: null
  },
  {
    title: "Desert Pre-Wedding in Jaisalmer",
    location: "Jaisalmer, Rajasthan, India",
    category: "Pre-Wedding",
    image: "https://images.unsplash.com/photo-1526761122248-b31c93f8b2f9?w=800&q=80",
    date: "2024-11-25",
    guests: 100,
    description: "A magical pre-wedding celebration in the golden desert with camel rides, sunset photography, and a traditional Rajasthani folk performance under the stars.",
    highlights: ["Camel Safari", "Desert Photography", "Folk Performance", "Starlit Dinner"],
    featured: false,
    clientName: "Kavya & Rahul Mehta",
    clientTestimonial: "The desert setting was absolutely magical and unique!",
    videoUrl: null
  },

  // Sangeet
  {
    title: "Grand Sangeet Night in Mumbai",
    location: "Mumbai, Maharashtra, India",
    category: "Sangeet",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
    date: "2024-12-20",
    guests: 400,
    description: "An electrifying Sangeet night with Bollywood-style performances, celebrity DJ, stunning choreography, and a grand finale with fireworks.",
    highlights: ["Bollywood Performances", "Celebrity DJ", "Choreographed Dances", "Fireworks"],
    featured: true,
    clientName: "Riya & Aditya Shah",
    clientTestimonial: "The best night of our lives! The energy and performances were incredible.",
    videoUrl: "https://www.youtube.com/watch?v=example5"
  },
  {
    title: "Intimate Sangeet in Jaipur",
    location: "Jaipur, Rajasthan, India",
    category: "Sangeet",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
    date: "2025-01-10",
    guests: 200,
    description: "A beautifully curated Sangeet evening at a heritage haveli with traditional folk performances, live music, and an intimate family gathering.",
    highlights: ["Folk Music", "Heritage Haveli", "Family Performances", "Traditional Decor"],
    featured: false,
    clientName: "Pooja & Ankit Singh",
    clientTestimonial: "A perfect blend of tradition and celebration!",
    videoUrl: null
  },

  // Mehndi & Haldi
  {
    title: "Colorful Haldi Ceremony in Udaipur",
    location: "Udaipur, Rajasthan, India",
    category: "Mehndi & Haldi",
    image: "https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80",
    date: "2024-11-14",
    guests: 250,
    description: "A vibrant Haldi ceremony with traditional songs, organic turmeric paste, floral decorations, and colorful celebrations by the lake.",
    highlights: ["Traditional Songs", "Floral Decor", "Lake View", "Organic Haldi"],
    featured: false,
    clientName: "Sneha & Deepak Joshi",
    clientTestimonial: "The most colorful and joyful ceremony of our wedding!",
    videoUrl: null
  },
  {
    title: "Mehndi Night in Jodhpur",
    location: "Jodhpur, Rajasthan, India",
    category: "Mehndi & Haldi",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    date: "2024-12-15",
    guests: 300,
    description: "A mesmerizing Mehndi night with intricate henna designs, live music, traditional Rajasthani cuisine, and a lively celebration under the stars.",
    highlights: ["Henna Artists", "Live Music", "Rajasthani Cuisine", "Starlit Night"],
    featured: false,
    clientName: "Anjali & Ravi Patel",
    clientTestimonial: "The Mehndi night was a dream come true!",
    videoUrl: null
  },

  // Reception
  {
    title: "Grand Reception in Delhi",
    location: "Delhi, India",
    category: "Reception",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    date: "2024-12-25",
    guests: 600,
    description: "A lavish reception at a five-star hotel with celebrity performances, gourmet dining, stunning floral arrangements, and a memorable evening of celebration.",
    highlights: ["Celebrity Performance", "Gourmet Dining", "Floral Arrangements", "Photo Booth"],
    featured: true,
    clientName: "Samantha & Vikram Singh",
    clientTestimonial: "A spectacular reception that our guests will remember forever!",
    videoUrl: "https://www.youtube.com/watch?v=example6"
  },
  {
    title: "Elegant Reception in Jaipur",
    location: "Jaipur, Rajasthan, India",
    category: "Reception",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    date: "2025-01-05",
    guests: 450,
    description: "An elegant reception at a heritage palace with royal decor, live orchestra, and a grand feast featuring traditional and international cuisines.",
    highlights: ["Orchestra", "Royal Decor", "Grand Feast", "Live Entertainment"],
    featured: false,
    clientName: "Neha & Karan Gupta",
    clientTestimonial: "A perfect ending to our wedding celebrations!",
    videoUrl: null
  },

  // Corporate Events
  {
    title: "Tech Conference in Bengaluru",
    location: "Bengaluru, Karnataka, India",
    category: "Corporate Events",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    date: "2024-09-20",
    guests: 500,
    description: "A large-scale tech conference with keynote speakers, interactive sessions, product launches, and networking opportunities for industry leaders.",
    highlights: ["Keynote Speakers", "Product Launch", "Networking", "Interactive Sessions"],
    featured: false,
    clientName: "TechCorp Inc.",
    clientTestimonial: "An outstanding event that exceeded all expectations!",
    videoUrl: null
  },
  {
    title: "Luxury Brand Gala in Mumbai",
    location: "Mumbai, Maharashtra, India",
    category: "Corporate Events",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    date: "2024-10-10",
    guests: 350,
    description: "A glamorous gala dinner for a luxury fashion brand with a runway show, celebrity appearances, and an exclusive dining experience.",
    highlights: ["Runway Show", "Celebrity Appearances", "Luxury Dining", "Fashion Presentation"],
    featured: false,
    clientName: "LuxFashion International",
    clientTestimonial: "A truly spectacular event that represented our brand perfectly.",
    videoUrl: null
  },

  // Social Events
  {
    title: "Milestone Birthday Celebration",
    location: "Goa, India",
    category: "Social Events",
    image: "https://images.unsplash.com/photo-1512343879784-9602d5de7a10?w=800&q=80",
    date: "2024-12-30",
    guests: 200,
    description: "A memorable 50th birthday celebration with a beach party, live music, gourmet food, and a stunning fireworks display to ring in the new year.",
    highlights: ["Beach Party", "Live Music", "Fireworks", "Gourmet Food"],
    featured: false,
    clientName: "Mr. Rajesh Khanna",
    clientTestimonial: "The best birthday celebration ever! The setting was perfect.",
    videoUrl: null
  },
  {
    title: "Charity Gala in Delhi",
    location: "Delhi, India",
    category: "Social Events",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    date: "2024-11-01",
    guests: 300,
    description: "A prestigious charity gala with auctions, dinner, and entertainment to raise funds for children's education, featuring celebrity hosts and performances.",
    highlights: ["Charity Auction", "Celebrity Hosts", "Dinner Gala", "Entertainment"],
    featured: false,
    clientName: "Educate Foundation",
    clientTestimonial: "A highly successful event that raised significant funds for a great cause.",
    videoUrl: null
  },

  // More Wedding
  {
    title: "Royal Wedding in Jodhpur",
    location: "Jodhpur, Rajasthan, India",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1590582007337-f5d55ec5aaf0?w=800&q=80",
    date: "2025-02-20",
    guests: 400,
    description: "A spectacular wedding at the majestic Mehrangarh Fort with royal ceremonies, traditional Rajasthani music, and a grand reception in the fort's courtyard.",
    highlights: ["Fort Ceremony", "Royal Music", "Grand Reception", "Traditional Rituals"],
    featured: false,
    clientName: "Aishwarya & Yuvraj Singh",
    clientTestimonial: "A fairy tale wedding at the most magnificent fort!",
    videoUrl: null
  },
  {
    title: "Intimate Garden Wedding",
    location: "Lonavala, Maharashtra, India",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    date: "2025-03-15",
    guests: 120,
    description: "A beautiful intimate garden wedding with lush greenery, floral arches, personalized vows, and a cozy dinner under twinkling lights.",
    highlights: ["Garden Setting", "Floral Arches", "Personalized Vows", "Twinkling Lights"],
    featured: false,
    clientName: "Shruti & Abhishek Kumar",
    clientTestimonial: "The perfect intimate wedding we always dreamed of!",
    videoUrl: null
  }
];

module.exports = portfolioData;