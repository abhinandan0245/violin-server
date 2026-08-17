// src/scripts/seedArtists.js
const mongoose = require("mongoose");
const Artist = require("../modules/artist/artist.model");
const ArtistCategory = require("../modules/artistCategory/artistCategory.model");
require("dotenv").config();

// Fallback images
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80",
  "https://images.unsplash.com/photo-1526761122248-b31c93f8b2f9?w=400&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80",
  "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
  "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&q=80",
];

const artistsData = [
  // Singers & Vocalists
  {
    name: "Arijit Singh",
    price: 25,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/arijitsingh",
    facebook: "https://facebook.com/arijitsinghofficial",
    youtube: "https://youtube.com/@arijitsingh",
    website: "https://arijitsingh.com",
    languages: ["Hindi", "Bengali", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 18,
    bio: "Arijit Singh is an Indian playback singer known for his soulful voice. He has sung over 500 songs in multiple languages and is one of the most streamed artists in the world.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
  },
  {
    name: "Neha Kakkar",
    price: 10,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/nehakakkar",
    facebook: "https://facebook.com/NehaKakkarOfficial",
    youtube: "https://youtube.com/@nehakakkar",
    website: "https://nehakakkar.com",
    languages: ["Hindi", "Punjabi", "English"],
    availability: "available",
    location: "Delhi, India",
    experience: 15,
    bio: "Neha Kakkar is a popular Indian playback singer and music composer. She is known for her energetic performances and has sung numerous hit songs.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80",
  },
  {
    name: "Diljit Dosanjh",
    price: 35,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/diljitdosanjh",
    facebook: "https://facebook.com/DiljitDosanjhOfficial",
    youtube: "https://youtube.com/@diljitdosanjh",
    website: "https://diljitdosanjh.com",
    languages: ["Punjabi", "Hindi", "English"],
    availability: "busy",
    location: "Punjab, India",
    experience: 20,
    bio: "Diljit Dosanjh is an Indian singer, actor, and television personality. He is one of the highest-paid artists in the Punjabi music industry.",
    image:
      "https://images.unsplash.com/photo-1526761122248-b31c93f8b2f9?w=400&q=80",
  },
  {
    name: "Shreya Ghoshal",
    price: 20,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/shreyaghoshal",
    facebook: "https://facebook.com/ShreyaGhoshalOfficial",
    youtube: "https://youtube.com/@shreyaghoshal",
    website: "https://shreyaghoshal.com",
    languages: [
      "Hindi",
      "Bengali",
      "Tamil",
      "Telugu",
      "Kannada",
      "Malayalam",
      "English",
    ],
    availability: "available",
    location: "Mumbai, India",
    experience: 22,
    bio: "Shreya Ghoshal is an Indian playback singer who has sung in over 10 languages. She has won numerous awards including multiple Filmfare Awards.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
  },
  {
    name: "Sonu Nigam",
    price: 18,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/sonunigam",
    facebook: "https://facebook.com/SonuNigamOfficial",
    youtube: "https://youtube.com/@sonunigam",
    website: "https://sonunigam.com",
    languages: ["Hindi", "Kannada", "Tamil", "Telugu", "Bengali", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 30,
    bio: "Sonu Nigam is one of India's most versatile playback singers. With a career spanning over three decades, he has sung thousands of songs.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
  },
  {
    name: "Jubin Nautiyal",
    price: 15,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/jubinnautiyal",
    facebook: "https://facebook.com/JubinNautiyalOfficial",
    youtube: "https://youtube.com/@jubinnautiyal",
    website: "",
    languages: ["Hindi", "English"],
    availability: "on-tour",
    location: "Mumbai, India",
    experience: 10,
    bio: "Jubin Nautiyal is a contemporary Indian playback singer known for his hit songs like 'Tum Hi Aana' and 'Raatan Lambiyan'.",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80",
  },
  {
    name: "Palak Muchhal",
    price: 8,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/palakmuchhal",
    facebook: "https://facebook.com/PalakMuchhalOfficial",
    youtube: "https://youtube.com/@palakmuchhal",
    website: "https://palakmuchhal.com",
    languages: ["Hindi", "Tamil", "Telugu", "Kannada", "Marathi", "English"],
    availability: "available",
    location: "Indore, India",
    experience: 12,
    bio: "Palak Muchhal is an Indian playback singer and philanthropist. She has sung in multiple languages and is also known for her social work.",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
  },
  {
    name: "Mika Singh",
    price: 12,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/mikasingh",
    facebook: "https://facebook.com/MikaSinghOfficial",
    youtube: "https://youtube.com/@mikasingh",
    website: "https://mikasingh.com",
    languages: ["Hindi", "Punjabi", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 25,
    bio: "Mika Singh is a popular Indian singer and performer known for his energetic live shows and Bhangra-style music.",
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&q=80",
  },
  {
    name: "Shaan",
    price: 5,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/shaanofficial",
    facebook: "https://facebook.com/ShaanOfficial",
    youtube: "https://youtube.com/@shaan",
    website: "https://shaanofficial.com",
    languages: ["Hindi", "Bengali", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 28,
    bio: "Shaan is an Indian playback singer, actor, and television host. He is known for his versatile singing style.",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
  },
  {
    name: "Armaan Malik",
    price: 2,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/armaanmalik",
    facebook: "https://facebook.com/ArmaanMalikOfficial",
    youtube: "https://youtube.com/@armaanmalik",
    website: "https://armaanmalik.com",
    languages: ["Hindi", "English", "Tamil", "Telugu"],
    availability: "available",
    location: "Mumbai, India",
    experience: 10,
    bio: "Armaan Malik is a young and talented Indian playback singer known for his romantic and soulful songs.",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80",
  },

  // Bollywood Celebrities
  {
    name: "Shah Rukh Khan",
    price: 50,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/iamsrk",
    facebook: "https://facebook.com/SRK",
    youtube: "https://youtube.com/@srk",
    website: "https://srk.com",
    languages: ["Hindi", "English", "Urdu"],
    availability: "busy",
    location: "Mumbai, India",
    experience: 35,
    bio: "Shah Rukh Khan is one of the most famous actors in the world. Known as the 'King of Bollywood', he has starred in over 80 films.",
    image:
      "https://images.unsplash.com/photo-1526761122248-b31c93f8b2f9?w=400&q=80",
  },
  {
    name: "Deepika Padukone",
    price: 40,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/deepikapadukone",
    facebook: "https://facebook.com/DeepikaPadukone",
    youtube: "https://youtube.com/@deepikapadukone",
    website: "https://deepikapadukone.com",
    languages: ["Hindi", "English", "Kannada", "Tamil", "Telugu"],
    availability: "available",
    location: "Mumbai, India",
    experience: 15,
    bio: "Deepika Padukone is an Indian actress and producer. She is one of the highest-paid actresses in India.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80",
  },
  {
    name: "Ranveer Singh",
    price: 35,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/ranveersingh",
    facebook: "https://facebook.com/RanveerSingh",
    youtube: "https://youtube.com/@ranveersingh",
    website: "https://ranveersingh.com",
    languages: ["Hindi", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 12,
    bio: "Ranveer Singh is an Indian actor known for his energetic performances and versatility in Bollywood.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
  },

  // Instrumental Artists
  {
    name: "Anoushka Shankar",
    price: 15,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/anoushkashankar",
    facebook: "https://facebook.com/AnoushkaShankar",
    youtube: "https://youtube.com/@anoushkashankar",
    website: "https://anoushkashankar.com",
    languages: ["English", "Hindi"],
    availability: "available",
    location: "London, UK",
    experience: 25,
    bio: "Anoushka Shankar is a sitar player and composer. She is one of the most renowned classical musicians in the world.",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
  },
  {
    name: "Zakir Hussain",
    price: 20,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/zakirhussain",
    facebook: "https://facebook.com/ZakirHussain",
    youtube: "https://youtube.com/@zakirhussain",
    website: "https://zakirhussain.com",
    languages: ["Hindi", "English", "Urdu"],
    availability: "available",
    location: "Mumbai, India",
    experience: 40,
    bio: "Zakir Hussain is a tabla player and composer. He is one of the greatest tabla players of all time.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
  },

  // DJ & Electronic Music
  {
    name: "Nucleya",
    price: 8,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/nucleya",
    facebook: "https://facebook.com/Nucleya",
    youtube: "https://youtube.com/@nucleya",
    website: "https://nucleya.com",
    languages: ["English"],
    availability: "on-tour",
    location: "Delhi, India",
    experience: 15,
    bio: "Nucleya is an Indian electronic music producer and DJ. He is known for his unique blend of electronic and folk music.",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80",
  },
  {
    name: "Anu Malik",
    price: 10,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/anumalik",
    facebook: "https://facebook.com/AnuMalik",
    youtube: "https://youtube.com/@anumalik",
    website: "https://anumalik.com",
    languages: ["Hindi", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 30,
    bio: "Anu Malik is a music composer and singer. He is one of the most accomplished music directors in Bollywood.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
  },

  // Sufi & Qawwali Artists
  {
    name: "Rahat Fateh Ali Khan",
    price: 25,
    priceUnit: "lakh",
    featured: true,
    isActive: true,
    instagram: "https://instagram.com/rahatfatehalikhan",
    facebook: "https://facebook.com/RahatFatehAliKhan",
    youtube: "https://youtube.com/@rahatfatehalikhan",
    website: "https://rahatfatehalikhan.com",
    languages: ["Urdu", "Punjabi", "Hindi", "English"],
    availability: "available",
    location: "Lahore, Pakistan",
    experience: 30,
    bio: "Rahat Fateh Ali Khan is a Pakistani Qawwali singer and one of the most celebrated vocalists in the world.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
  },

  // Dance Performers
  {
    name: "Terence Lewis",
    price: 12,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/terencelewis",
    facebook: "https://facebook.com/TerenceLewis",
    youtube: "https://youtube.com/@terencelewis",
    website: "https://terencelewis.com",
    languages: ["Hindi", "English"],
    availability: "available",
    location: "Mumbai, India",
    experience: 20,
    bio: "Terence Lewis is a choreographer and dancer. He is one of the most influential dance personalities in India.",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
  },

  // Live Bands
  {
    name: "The Local Train",
    price: 6,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/thelocaltrain",
    facebook: "https://facebook.com/TheLocalTrain",
    youtube: "https://youtube.com/@thelocaltrain",
    website: "https://thelocaltrain.com",
    languages: ["Hindi", "English"],
    availability: "on-tour",
    location: "New Delhi, India",
    experience: 12,
    bio: "The Local Train is an Indian rock band known for their energetic performances and soulful music.",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80",
  },
  {
    name: "Indian Ocean",
    price: 8,
    priceUnit: "lakh",
    featured: false,
    isActive: true,
    instagram: "https://instagram.com/indianocean",
    facebook: "https://facebook.com/IndianOcean",
    youtube: "https://youtube.com/@indianocean",
    website: "https://indianocean.com",
    languages: ["Hindi", "English", "Sanskrit"],
    availability: "available",
    location: "Delhi, India",
    experience: 30,
    bio: "Indian Ocean is a contemporary Indian rock band known for their fusion of Indian folk and rock music.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
  },
];

async function seedArtists() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/violin-events",
    );
    console.log("✅ Connected to MongoDB");

    // Get all categories
    const categories = await ArtistCategory.find();
    console.log(`✅ Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.error("❌ No categories found. Please seed categories first.");
      process.exit(1);
    }

    // Create a category map by name
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Map artists to categories
    const categoryMapping = [
      {
        name: "Singers & Vocalists",
        artists: [
          "Arijit Singh",
          "Neha Kakkar",
          "Diljit Dosanjh",
          "Shreya Ghoshal",
          "Sonu Nigam",
          "Jubin Nautiyal",
          "Palak Muchhal",
          "Mika Singh",
          "Shaan",
          "Armaan Malik",
        ],
      },
      {
        name: "Bollywood Celebrities",
        artists: ["Shah Rukh Khan", "Deepika Padukone", "Ranveer Singh"],
      },
      {
        name: "Instrumental Artists",
        artists: ["Anoushka Shankar", "Zakir Hussain"],
      },
      { name: "DJ & Electronic Music", artists: ["Nucleya", "Anu Malik"] },
      { name: "Sufi & Qawwali Artists", artists: ["Rahat Fateh Ali Khan"] },
      { name: "Dance Performers", artists: ["Terence Lewis"] },
      { name: "Live Bands", artists: ["The Local Train", "Indian Ocean"] },
    ];

    // Clear existing artists
    const deleted = await Artist.deleteMany({});
    console.log(`🗑️ Cleared ${deleted.deletedCount} existing artists`);

    // Prepare artists with category IDs
    const artistsWithCategories = artistsData.map((artist) => {
      let categoryId = null;

      // Find the category for this artist
      for (const mapping of categoryMapping) {
        if (mapping.artists.includes(artist.name)) {
          categoryId = categoryMap[mapping.name];
          break;
        }
      }

      // If no category found, assign to "Singers & Vocalists" as default
      if (!categoryId) {
        categoryId = categoryMap["Singers & Vocalists"];
      }

      return {
        ...artist,
        category: categoryId,
      };
    });

    // Filter out artists without valid category
    const validArtists = artistsWithCategories.filter(
      (artist) => artist.category,
    );

    if (validArtists.length === 0) {
      console.error(
        "❌ No valid artists to insert. Please check category mapping.",
      );
      process.exit(1);
    }

    // Insert artists
    const inserted = await Artist.insertMany(validArtists);
    console.log(`✅ Inserted ${inserted.length} artists`);

    // Verify
    const count = await Artist.countDocuments();
    console.log(`📊 Total artists in DB: ${count}`);

    // Show all artists with categories
    const allArtists = await Artist.find().populate("category", "name");
    console.log("\n📋 All Artists:");
    allArtists.forEach((artist, i) => {
      console.log(
        `  ${i + 1}. ${artist.name} (${artist.category?.name || "No Category"}) - ${artist.featured ? "⭐ Featured" : ""} ${artist.isActive ? "✅ Active" : "❌ Inactive"}`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding artists:", error);
    process.exit(1);
  }
}

seedArtists();
