const Place = require("../models/Place");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const geminiService = require("../services/geminiService");
const { getPexelsImage } = require("../services/pexelsService");

// ---------------- IMAGE SAFE FUNCTION ----------------
async function safeImageSearch(...queries) {
  for (const q of queries) {
    if (!q) continue;
    const img = await getPexelsImage(q);
    if (img) return img;
  }

  // 🔥 FIX — use correct placeholder size (200x200)
  return "/api/placeholder/200/200";
}

// ---------------- PRICE MAP FIX ----------------
function mapPriceRange(level) {
  if (!level) return "$$";

  const s = String(level).toLowerCase().trim();

  if (["$", "cheap", "budget", "economy"].includes(s)) return "$";
  if (["$$", "mid", "mid-range", "affordable", "moderate"].includes(s)) return "$$";
  if (["$$$", "expensive", "premium", "high-end"].includes(s)) return "$$$";
  if (["$$$$", "luxury", "ultra-luxury"].includes(s)) return "$$$$";

  return "$$";
}

// ---------------- MAIN SEED FUNCTION ----------------
async function seedUserPlacesIfNeeded(user) {
  const existing = await Place.countDocuments({ createdBy: user._id });

  if (existing >= 5) {
    console.log("✔ User already has places, skipping...");
    return;
  }

  console.log("🧠 Need 15 AI places → Generating...");

  const raw = await geminiService.generateUserIndianPlaces(user.email);

  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.log("❌ AI JSON parsing failed");
    console.log(raw);
    return;
  }

  const placesToInsert = [];

  for (const p of json.places) {
    const placeImg = await safeImageSearch(
      `${p.name} ${p.city} travel`,
      `${p.name} tourism`,
      `${p.city} India`,
      `${p.name} India`,
      `${p.name} best places`
    );

    placesToInsert.push({
      name: p.name,
      description: p.description,
      rating: p.rating ?? 4.3,
      category: p.category || "city",
      images: [placeImg],
      bestTimeToVisit: p.bestTime || [],
      activities: p.activities || [],
      createdBy: user._id,
      location: {
        city: p.city,
        country: "India",
        coordinates: {
          type: "Point",
          coordinates: [p.lng || 77.2, p.lat || 28.6]
        }
      }
    });
  }

  const savedPlaces = await Place.insertMany(placesToInsert);

  const hotelsToInsert = [];
  const restaurantsToInsert = [];

  for (let i = 0; i < savedPlaces.length; i++) {
    const saved = savedPlaces[i];
    const base = json.places[i];

    // ---------- HOTELS ----------
    for (const h of (base.hotels || []).slice(0, 3)) {
      const hotelImg = await safeImageSearch(
  `${saved.location.city} hotel`,
  `${saved.name} hotel`,
  `${saved.location.city} travel`,
  "india hotel",
  "best hotel india"
);


      hotelsToInsert.push({
        name: h.name,
        description: h.description || "",
        place: saved._id,
        rating: h.rating || 4.2,
        priceRange: mapPriceRange(h.priceRange || h.priceLevel),
        amenities: h.amenities || [],
        images: [hotelImg],
        location: {
          address: h.address || "",
          city: saved.location.city,
          country: "India"
        },
        createdBy: user._id
      });
    }

    // ---------- RESTAURANTS ----------
    for (const r of (base.restaurants || []).slice(0, 3)) {
     const restImg = await safeImageSearch(
  `${saved.location.city} food`,
  `${saved.location.city} restaurant`,
  `${saved.name} food`,
  "india food",
  "best food india"
);


      restaurantsToInsert.push({
        name: r.name,
        place: saved._id,
        rating: r.rating || 4.2,
        cuisine: r.cuisine || [],
        priceRange: mapPriceRange(r.priceRange || r.priceLevel),
        images: [restImg],
        location: {
          address: r.address || "",
          city: saved.location.city,
          country: "India"
        },
        createdBy: user._id
      });
    }
  }

  if (hotelsToInsert.length) await Hotel.insertMany(hotelsToInsert);
  if (restaurantsToInsert.length) await Restaurant.insertMany(restaurantsToInsert);

  console.log(`
✨ AI Data Added for User: ${user.email}
+ ${savedPlaces.length} places
+ ${hotelsToInsert.length} hotels
+ ${restaurantsToInsert.length} restaurants
  `);
}

module.exports = { seedUserPlacesIfNeeded };
