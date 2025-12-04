const express = require("express");
const router = express.Router();
const { getPexelsImage } = require("../services/pexelsService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CLEAN JSON
const safeJSON = (text) => {
  try {
    return JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    return null;
  }
};

router.get("/deal-details", async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "Slug missing!" });

    const model = gemini.getGenerativeModel({
      model: "gemini-pro", // safest & stable
    });

    const prompt = `
      Generate travel deal details for slug: ${slug}.
      Return ONLY JSON with:
      {
        "title": "",
        "location": "",
        "price": "",
        "discount": "",
        "duration": "",
        "rating": "",
        "highlights": ["", ""],
        "itinerary": ["", ""],
        "includes": ["", ""]
      }
    `;

    // GENERATE AI DATA
    const result = await model.generateContent(prompt);
    let deal = safeJSON(result.response.text());

    // If JSON fails
    if (!deal) {
      deal = {
        title: slug.replace(/-/g, " "),
        location: "Unknown",
        price: "₹9,999",
        discount: "20% OFF",
        duration: "3D/2N",
        rating: "4.5",
        highlights: [],
        itinerary: [],
        includes: []
      };
    }

    // SINGLE IMAGE
    const mainImage =
      (await getPexelsImage(`${deal.location} travel`)) ||
      (await getPexelsImage(`travel destination`));

    // GALLERY IMAGES (with fallback)
    const gallery = [
      (await getPexelsImage(`${deal.location} attractions`)),
      (await getPexelsImage(`${deal.location} city view`)),
      (await getPexelsImage(`${deal.location} hotels`)),
    ].filter(Boolean);

    deal.image = mainImage;
    deal.gallery = gallery;

    res.json(deal);

  } catch (err) {
    console.log("Deal Details Error:", err);
    res.status(500).json({ error: "Failed to generate deal details." });
  }
});

module.exports = router;
