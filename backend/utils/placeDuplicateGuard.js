const Place = require("../models/Place");

/**
 * Checks if a place is duplicate by:
 * - Case insensitive name match
 * - OR coordinates within 5km
 */
async function isDuplicatePlace(name, lng, lat) {
  // 1️⃣ Name-based dupes
  const nameExists = await Place.exists({
    name: { $regex: `^${name}$`, $options: "i" }
  });

  if (nameExists) return true;

  // 2️⃣ Coord-based dupes (5km range)
  const nearby = await Place.findOne({
    "location.coordinates": {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: 5000 // 5km
      }
    }
  }).lean();

  return Boolean(nearby);
}

module.exports = { isDuplicatePlace };
