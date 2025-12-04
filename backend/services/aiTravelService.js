// backend/services/aiTravelService.js
const geminiService = require("./geminiService");
const seedData = require("../utils/seedData");
const { parseJsonSafely } = require("../utils/apiClient");

const MODEL = process.env.GEMINI_MODEL || "models/gemini-1.5-mini";
const MAX_TOKENS = parseInt(process.env.AI_RESPONSE_MAX_TOKENS || "800", 10);
const TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || "0.2");

async function callGemini(prompt) {
  try {
    const raw = await geminiService.generate(prompt, {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    if (!raw) return null;

    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return parseJsonSafely(clean);
  } catch (e) {
    console.log("❌ Gemini Error:", e.message);
    return null;
  }
}

/* -------------------- FLIGHTS -------------------- */
exports.fetchFlights = async ({ from, to, date }) => {
  const prompt = `
Generate 10 realistic flight options between "${from}" and "${to}" on "${date}".
Return ONLY a JSON array. 
Each object MUST have:
- airline
- flight_code
- departure_time
- arrival_time
- duration
- stops
- stops_details
- price_in_INR
- baggage_limit
- refundable
- booking_redirect_url
`;

  const parsed = await callGemini(prompt);
  if (Array.isArray(parsed) && parsed.length) return parsed;

  return seedData.getSeedFlights({ from, to, date });
};

/* -------------------- TRAINS -------------------- */
exports.fetchTrains = async ({ from, to, date }) => {
  const prompt = `
Generate 10 realistic Indian trains from "${from}" to "${to}" on "${date}".
Return ONLY JSON array. Each object:
- train_name
- train_number
- departure_time
- arrival_time
- duration
- classes: [{ className, availability, price_in_INR }]
- booking_redirect_url
`;

  const parsed = await callGemini(prompt);
  if (Array.isArray(parsed) && parsed.length) return parsed;

  return seedData.getSeedTrains({ from, to, date });
};

/* -------------------- HOTELS -------------------- */
exports.fetchHotels = async ({ city, checkin, checkout }) => {
  const prompt = `
Generate 15 realistic hotels in "${city}".
Return ONLY JSON array with:
- name
- image_url
- rating
- price_per_night
- location
- amenities
- description
- booking_redirect_url
`;

  const parsed = await callGemini(prompt);
  if (Array.isArray(parsed) && parsed.length) return parsed;

  return seedData.getSeedHotels({ city });
};
