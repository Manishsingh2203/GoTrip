const express = require("express");
const router = express.Router();
const { getPexelsImage } = require("../services/pexelsService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const baseDeals = require("../utils/dealsSeed");

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safeJSON = (text) => {
  try {
    return JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    return null;
  }
};

router.get("/deals", async (req, res) => {
  try {
    let finalDeals = [];

    const model = gemini.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    for (let deal of baseDeals) {
      // --- AI Pricing Generation ---
      const prompt = `
        Generate pricing details in JSON for the deal:
        "${deal.title}" at "${deal.location}".
        Format:
        {
          "price": "₹x,xxx",
          "discount": "10-40% OFF",
          "rating": "4.0-5.0"
        }
      `;

      const response = await model.generateContent(prompt);
      const aiData =
        safeJSON(response.response.text()) || {
          price: "₹9,999",
          discount: "25% OFF",
          rating: "4.5",
        };

      // --- AI Image Generation ---
      const image = await getPexelsImage(
        `Cinematic premium travel hero image of ${deal.location}, ultra sharp, luxury feel, no text, no watermark`
      );

      // --- Final Deal Object ---
      finalDeals.push({
        ...deal,
        ...aiData,
        slug: deal.title.toLowerCase().replace(/\s+/g, "-"),
        image,
      });
    }

    res.json(finalDeals);
  } catch (err) {
    console.error("Deals Error:", err);
    res.status(500).json({ error: "Failed to generate deals" });
  }
});

module.exports = router;
