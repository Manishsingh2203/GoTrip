const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const gemini = require('./geminiService');
const { getPexelsImage } = require("./pexelsService");
const { isDuplicatePlace } = require("../utils/placeDuplicateGuard");

// Auto detect category
function getCategory(name) {
  name = name.toLowerCase();
  if (name.includes("beach") || name.includes("island") || name.includes("goa")) return "beach";
  if (name.includes("fort") || name.includes("palace")) return "historical";
  if (name.includes("temple") || name.includes("rishikesh")) return "religious";
  if (name.includes("lake") || name.includes("park")) return "park";
  if (name.includes("museum")) return "museum";
  if (name.includes("trek") || name.includes("ladakh")) return "adventure";
  if (name.includes("manali") || name.includes("shimla")) return "mountain";
  return "city";
}

async function generateIndianPlaces(count = 15) {
  const prompt = `
  You are GoTrip AI.
  Respond only in valid JSON array.

  Generate ${count} unique Indian travel places.

  Each place must follow:

{
  "name": "Manali",
  "city": "Manali",
  "lat": 32.2396,
  "lng": 77.1887,
  "description": "Short sentence",
  "rating": 4.3,
  "bestTime": ["March", "April", "May"],
  "activities": ["Trekking", "Cafe hopping", "Paragliding"],
  "hotels": [
    { "name": "Hotel XYZ", "address": "Mall Road", "rating": 4.2, "priceLevel": "mid-range" }
  ],
  "restaurants": [
    { "name": "Cafe 123", "address": "Old Manali", "rating": 4.4, "cuisine": "Italian", "priceLevel": "budget" }
  ]
}
  `;

  const raw = await gemini.generateContent(prompt);

  try {
    let json = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(json);
  } catch (err) {
    console.error("❌ Gemini returned bad JSON:", raw);
    throw new Error("Invalid JSON returned by Gemini");
  }
}

async function seedIndianPlacesIfNeeded() {
  const TARGET = 20;
  const existing = await Place.countDocuments({ "location.country": "India" });

  if (existing >= TARGET) {
    console.log(`🇮🇳 Already have ${existing} Indian places → No AI call needed`);
    return;
  }

  const need = TARGET - existing;
  console.log(`🧠 Need ${need} more Indian places → Generating...`);

  const aiPlaces = await generateIndianPlaces(need);
  const placeDocs = [];

  for (const p of aiPlaces) {
    const isDuplicate = await isDuplicatePlace(p.name, p.lng, p.lat);
    if (isDuplicate) {
      console.log(`⏭️ Skipped duplicate: ${p.name}`);
      continue;
    }

    const img =
      await getPexelsImage(`${p.name} ${p.city} travel tourism`) ||
      await getPexelsImage(`${p.name} India`) ||
      "/api/placeholder/400/300";

    placeDocs.push({
      name: p.name,
      description: p.description,
      rating: p.rating ?? 4.3,
      category: getCategory(p.name),
      images: [img],
      bestTimeToVisit: p.bestTime || [],
      activities: p.activities || [],
      location: {
        address: `${p.name}, ${p.city}`,
        city: p.city,
        country: "India",
        coordinates: {
          type: "Point",
          coordinates: [p.lng, p.lat]
        }
      }
    });
  }

  const savedPlaces = await Place.insertMany(placeDocs);

  const hotelDocs = [];
  const restaurantDocs = [];

  savedPlaces.forEach((saved, i) => {
    const base = aiPlaces[i];

    // HOTELS
    (base.hotels || []).slice(0, 3).forEach(h => {
      hotelDocs.push({
        name: h.name,
        description: "",
        place: saved._id,
        rating: h.rating || 4.2,
        priceRange: h.priceLevel || "$$",
        amenities: [],
        images: ["/api/placeholder/200/200"],  // FIXED
        location: {
          address: h.address || "",
          city: saved.location.city,
          country: "India"
        }
      });
    });

    // RESTAURANTS
    (base.restaurants || []).slice(0, 3).forEach(r => {
      restaurantDocs.push({
        name: r.name,
        place: saved._id,
        rating: r.rating || 4.2,
        cuisine: Array.isArray(r.cuisine) ? r.cuisine : [r.cuisine],
        priceRange: r.priceLevel || "$$",
        images: ["/api/placeholder/200/200"],  // FIXED
        location: {
          address: r.address || "",
          city: saved.location.city,
          country: "India"
        }
      });
    });
  });

  if (hotelDocs.length) await Hotel.insertMany(hotelDocs);
  if (restaurantDocs.length) await Restaurant.insertMany(restaurantDocs);

  console.log(`
✨ AI Places Added:
+ ${savedPlaces.length} places
+ ${hotelDocs.length} hotels
+ ${restaurantDocs.length} restaurants
`);
}

module.exports = {
  seedIndianPlacesIfNeeded
};
