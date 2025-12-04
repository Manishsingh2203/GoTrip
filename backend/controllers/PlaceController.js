const Place = require('../models/Place');
const ErrorResponse = require('../utils/errorResponse');
const gemini = require("../services/geminiService");
// Normalize helper
const normalizePlace = (p) => ({
  _id: p._id,
  name: p.name || "Unknown Place",
  description: p.description || "A wonderful destination.",
  category: p.category || "nature",
  rating: p.rating ?? 4.2,
  images: p.images?.length ? p.images : ["/api/placeholder/400/300"],
  entryFee: p.entryFee ?? 0,

  bestTimeToVisit: p.bestTimeToVisit || [],
  activities: p.activities || [],

  location: {
    city: p.location?.city || "Unknown",
    country: p.location?.country || "India",
    coordinates: p.location?.coordinates || {
      type: "Point",
      coordinates: [77.2090, 28.6139] // Default Delhi
    }
  }
});

// @desc Get All Places
exports.getPlaces = async (req, res, next) => {
  try {
    const places = await Place.find().lean();
    const normalized = places.map(normalizePlace);

    res.status(200).json({
      success: true,
      count: normalized.length,
      data: normalized
    });

  } catch (error) {
    next(error);
  }
};

// @desc Get Single Place
exports.getPlace = async (req, res, next) => {
  try {
    const p = await Place.findById(req.params.id).lean();

    if (!p) {
      return next(new ErrorResponse('Place not found', 404));
    }

    const place = normalizePlace(p);

    res.status(200).json({
      success: true,
      data: place
    });

  } catch (error) {
    next(error);
  }
};

// @desc Create Place
exports.createPlace = async (req, res, next) => {
  try {
    req.body.createdBy = req.user?.id;
    const place = await Place.create(req.body);
    res.status(201).json({
      success: true,
      data: normalizePlace(place.toObject())
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update Place
exports.updatePlace = async (req, res, next) => {
  try {
    let place = await Place.findById(req.params.id);

    if (!place) {
      return next(new ErrorResponse('Place not found', 404));
    }

    // If role-based restriction exists
    if (place.createdBy?.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this place', 403));
    }

    place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: normalizePlace(place.toObject())
    });

  } catch (error) {
    next(error);
  }
};

// @desc Delete Place
exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return next(new ErrorResponse('Place not found', 404));
    }

    if (place.createdBy?.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this place', 403));
    }

    await place.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Place deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc Search Places
exports.searchPlaces = async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const places = await Place.find(query).lean();
    const normalized = places.map(normalizePlace);

    res.status(200).json({
      success: true,
      count: normalized.length,
      data: normalized
    });

  } catch (error) {
    next(error);
  }
};

// @desc Places by Category
exports.getPlacesByCategory = async (req, res, next) => {
  try {
    const places = await Place.find({ category: req.params.name }).lean();
    const normalized = places.map(normalizePlace);

    res.status(200).json({
      success: true,
      count: normalized.length,
      data: normalized
    });

  } catch (error) {
    next(error);
  }
};


exports.searchGlobalPlaces = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(new ErrorResponse("Query missing", 400));
    }

    const prompt = `
    Give 10 travel places worldwide for:
    Search: ${q}

    Respond ONLY IN JSON:
    [
      {
        "name": "Name",
        "city": "City",
        "country": "Country",
        "rating": 4.5,
        "image": "https://image-url.jpg",
        "description": "Short text",
        "bestTimeToVisit": ["Season 1", "Season 2"],
        "activities": ["Activity1", "Activity2"]
      }
    ]
    `;

    const aiText = await gemini.generateContent(prompt);

    const result = JSON.parse(aiText);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });

  } catch (error) {
    console.log("AI Search Error:", error.message);
    next(new ErrorResponse("AI Global Search failed", 500));
  }
};


// @desc AI + DB Fallback Search
exports.searchAIPlaces = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return next(new ErrorResponse("Search query required", 400));
    }

    console.log("🔍 AI Search request:", q);

    // 1️⃣ Step 1 — Try Local DB First
    const dbResults = await Place.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).lean();

    // If DB found results → return them
    if (dbResults.length > 0) {
      console.log(`📌 Found ${dbResults.length} DB matches`);
      return res.status(200).json({
        success: true,
        source: "database",
        count: dbResults.length,
        data: dbResults.map(normalizePlace),
      });
    }

    console.log("⚠️ No DB results → using Gemini...");

    // 2️⃣ Step 2 — AI SEARCH FALLBACK
    const prompt = `
    You are GoTrip AI.

    Return a list of 8 real travel places for:
    Search: "${q}"

    RETURN ONLY VALID JSON:
    [
      {
        "name": "Place Name",
        "city": "City",
        "country": "Country",
        "rating": 4.5,
        "image": "https://image-url",
        "description": "Short helpful line",
        "bestTimeToVisit": ["Season1", "Season2"],
        "activities": ["Thing1", "Thing2", "Thing3"]
      }
    ]

    RULES:
    - No markdown
    - No prose
    - Only JSON
    - Real places only
    - Do NOT include coordinates
    `;

    const aiResponse = await gemini.generateContent(prompt);
    const places = JSON.parse(aiResponse);

    // Not saving to DB — for now just return
    return res.status(200).json({
      success: true,
      source: "ai",
      count: places.length,
      data: places,
    });

  } catch (err) {
    console.error("❌ AI Search Crash:", err.message);
    return next(new ErrorResponse("AI Search failed", 500));
  }
};
