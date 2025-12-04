const gemini = require("../services/geminiService");
const { getPexelsImage } = require("../services/pexelsService");

// safe search helper
async function safeImageSearch(...queries) {
  for (const q of queries) {
    if (!q) continue;
    try {
      const img = await getPexelsImage(q);
      if (img) return img;
    } catch (e) {
      console.warn("Pexels query failed for:", q, e?.message || e);
    }
  }
  return "/api/placeholder/400/300";
}

exports.searchAI = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ success: false, message: "Query missing" });

    const prompt = `
Give top 6 travel places based on search:
Query: "${q}"

Respond ONLY in JSON array:

[
  {
    "name": "",
    "city": "",
    "country": "",
    "description": "",
    "rating": 4.5,
    "image": "",
    "bestTime": ["Month", "Month"],
    "activities": ["", ""]
  }
]
`;

    const aiText = await gemini.generateContent(prompt);

    let raw = aiText?.trim?.() || "";
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    let places = [];
    try {
      places = JSON.parse(raw);
      if (!Array.isArray(places)) places = [];
    } catch (err) {
      console.warn("AI JSON parse failed. Raw:", raw);
      places = [];
    }

    const enriched = await Promise.all(
      places.map(async (p) => {
        const queries = [
          `${p.name} ${p.city} travel`,
          `${p.city} ${p.name} tourism`,
          `${p.name} India`,
          `${p.city} India`,
          `${p.name} ${p.city} landmark`,
        ];

        const imageUrl = await safeImageSearch(...queries);

        return {
          name: p.name || "Unknown",
          city: p.city || "Unknown",
          country: p.country || "India",
          description: p.description || "",
          rating: p.rating || 4.2,
          bestTime: p.bestTime || [],
          activities: p.activities || [],
          hotels: p.hotels || [],
          restaurants: p.restaurants || [],
          image: imageUrl,
          images: [imageUrl],
          lat: p.lat ?? p.latitude ?? null,
          lng: p.lng ?? p.longitude ?? null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};



exports.detectCountry = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query missing" });
    }

    const prompt = `
Detect if the user search query refers to a location inside India or outside India.

Query: "${query}"

Respond ONLY in this JSON:
{
  "type": "india" | "world"
}
`;

    const raw = await gemini.generateContent(prompt);

    let clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    let result = { type: "world" };
    try {
      result = JSON.parse(clean);
    } catch (err) {
      console.log("AI country detection parse failed:", clean);
    }

    return res.json({
      success: true,
      countryType: result.type || "world"
    });

  } catch (err) {
    console.error("AI detectCountry error:", err);
    return res.status(500).json({ success: false, message: "Detection failed" });
  }
};
