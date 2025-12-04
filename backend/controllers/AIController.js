const geminiService = require('../services/geminiService');
const ErrorResponse = require('../utils/errorResponse');


// =========================
// PACKING LIST
// =========================
exports.generatePackingList = async (req, res, next) => {
  try {
    const { destination, duration, season, activities } = req.body;

    if (!destination || !duration || !season || !activities) {
      return next(new ErrorResponse('Please provide destination, duration, season, and activities', 400));
    }

    const packingList = await geminiService.generatePackingList(
      destination,
      duration,
      season,
      activities
    );

    res.status(200).json({ success: true, data: packingList });

  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

// =========================
// SAFETY TIPS
// =========================
exports.generateSafetyTips = async (req, res, next) => {
  try {
    const { destination, travelType } = req.body;

    if (!destination || !travelType) {
      return next(new ErrorResponse('Please provide destination and travel type', 400));
    }

    const safetyTips = await geminiService.generateSafetyTips(destination, travelType);

    res.status(200).json({ success: true, data: safetyTips });

  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

// =========================
// ITINERARY
// =========================
exports.generateItinerary = async (req, res, next) => {
  try {
    const { destination, duration, interests, budget } = req.body;

    if (!destination || !duration || !interests || !budget) {
      return next(new ErrorResponse('Please provide destination, duration, interests, and budget', 400));
    }

    const itinerary = await geminiService.generateItinerary(
      destination,
      duration,
      interests,
      budget
    );

    res.status(200).json({ success: true, data: itinerary });

  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

// =========================
// BUDGET ESTIMATE
// =========================
exports.generateBudgetEstimate = async (req, res, next) => {
  try {
    const { destination, duration, travelers, style } = req.body;

    if (!destination || !duration || !travelers || !style) {
      return next(new ErrorResponse('Please provide destination, duration, travelers, and style', 400));
    }

    const budgetEstimate = await geminiService.generateBudgetEstimate(
      destination,
      duration,
      travelers,
      style
    );

    res.status(200).json({ success: true, data: budgetEstimate });

  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

// =========================
// AI CHAT — FIXED ✔
// =========================
exports.chatAboutTravel = async (req, res, next) => {
  try {
    let { query, message, context } = req.body;

    // Normalize inputs
    if (message?.query && !query) {
      query = message.query;
    }
    if (typeof message === "string" && !query) {
      query = message;
    }

    // Validate
    if (!query) {
      return next(new ErrorResponse("Please provide a query", 400));
    }

    query = String(query).trim();
    if (!query.length) {
      return next(new ErrorResponse("Query cannot be empty", 400));
    }

    // Fix context
    let safeContext = "";

    if (typeof context === "string") {
      safeContext = context;
    } else if (typeof context === "object" && context !== null) {
      safeContext = JSON.stringify(context);
    }

    console.log("💬 Incoming Chat Body:", { query, context: safeContext });

    const response = await geminiService.chatAboutTravel(query, safeContext);

    return res.status(200).json({ success: true, data: response });

  } catch (error) {
    console.error("AI Chat error:", error);
    return next(new ErrorResponse(error.message, 500));
  }
};

// =========================
// VOICE PLAN (Still Safe)
// =========================
exports.voicePlan = async (req, res, next) => {
  try {
    const { query } = req.body;

    const prompt = `
You are GoTrip AI. User said this via voice:

"${query}"

1) First, understand:
- Destination
- Number of days
- Budget level (budget / mid-range / luxury)
- Main interests (array of words)
- Travelers (adults, children)

2) Then create the same JSON itinerary format we use for generateItinerary:
{
  "tripOverview": "...",
  "bestTime": "...",
  "duration": "... days",
  "mustVisit": [ { "name": "...", "why": "...", "lat": 0, "lng": 0 } ],
  "dayWisePlan": [...],
  "budget": {...},
  "travelTips": [...],
  "safetyNotes": [...],
  "packingList": [...]
}

Rules:
- Respond with ONLY valid JSON, no extra text.
`;

    const raw = await geminiService.generateContent(prompt);

    const data = JSON.parse(
      raw.replace(/```json/gi, "").replace(/```/g, "").trim()
    );

    res.json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to generate trip from voice.",
    });
  }
};




// =========================
// LANGUAGE DETECTION API
// =========================
exports.detectLanguage = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const lang = await geminiService.detectLanguage(text);

    res.status(200).json({
      success: true,
      lang,
    });

  } catch (err) {
    console.error("LANG DETECT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Language detection failed",
    });
  }
};
