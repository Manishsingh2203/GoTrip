const express = require("express");
const router = express.Router();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CLEAN JSON
const safeJSON = (txt) => {
  try {
    return JSON.parse(txt.replace(/```json/g, "").replace(/```/g, ""));
  } catch {
    return null;
  }
};

// LIVE WEATHER FETCH
const getWeather = async (city) => {
  try {
    const res = await axios.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );

    return {
      temp: res.data?.current_condition?.[0]?.temp_C || null,
      desc: res.data?.current_condition?.[0]?.weatherDesc?.[0]?.value || "",
    };
  } catch {
    return null;
  }
};

router.post("/checklist-ai", async (req, res) => {
  try {
    const { query } = req.body;

    // Try detecting destination from query
    const destinationMatch = query.match(/(\w+) trip|\bto (\w+)/i);
    const destination = destinationMatch
      ? destinationMatch[1] || destinationMatch[2]
      : "";

    const weather = destination ? await getWeather(destination) : null;

    const model = gemini.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const prompt = `
User Query: "${query}"

Weather Details:
- Temperature: ${weather?.temp || "Unknown"}°C
- Condition: ${weather?.desc || "Unknown"}

Generate a TRAVEL PACKING CHECKLIST in STRICT JSON format:
{
  "title": "",
  "language": "detect-from-user-input",
  "items": [
    { "text": "", "completed": false }
  ]
}

IMPORTANT RULES:
- Always respond in user's language or writing style.
- Use weather + destination logic.
- Include important essentials automatically.
`;

    const output = await model.generateContent(prompt);
    const data = safeJSON(output.response.text());

    if (!data) {
      return res.json({
        title: "Auto Packing Checklist",
        items: [
          { text: "Passport", completed: false },
          { text: "Clothes", completed: false },
          { text: "Phone Charger", completed: false },
        ],
      });
    }

    res.json(data);
  } catch (err) {
    console.log("Checklist AI Error:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;
