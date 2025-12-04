const geminiService = require("../services/geminiService");

exports.detectQueryType = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const prompt = `
Your job is to identify what the user wants: flight search, train search, hotel search, or destination search.

Extract clean structured JSON.

RESPONSE FORMAT (NO extra text):

{
  "type": "flight/train/hotel/place",
  "parsed": {
    "from": "",
    "to": "",
    "date": "",
    "city": "",
    "checkin": "",
    "checkout": ""
  }
}

Rules:
- If user mentions words like "flight", "fly", airline names → type = "flight"
- If user mentions "train", "railway", train names → type = "train"
- If user mentions "hotel", "stay", "room", "book hotel" → type = "hotel"
- If user searches place name → type = "place"
- Date should be guessed if user uses "tomorrow", "next week", etc.
- If hotel: require city, checkin, checkout
- If flight/train: require from, to, date
- Output only pure JSON.

User query: "${query}"
    `;

    const aiText = await geminiService.generate(prompt);

    let json;
    try {
      json = JSON.parse(aiText);
    } catch (e) {
      return res.status(200).json({
        success: true,
        type: "place",
        parsed: {}
      });
    }

    return res.status(200).json({
      success: true,
      type: json.type || "place",
      parsed: json.parsed || {}
    });

  } catch (err) {
    console.log("❌ Query detect error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
