const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/env");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

class GeminiService {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  async initializeModel() {
    console.log("🔧 Initializing Gemini AI...");

    const models = [
      "models/gemini-2.5-flash",
      "models/gemini-2.5-pro",
      "models/gemini-2.0-flash",
    ];

    for (const modelName of models) {
      try {
        console.log(`🧪 Trying model: ${modelName}`);
        this.model = genAI.getGenerativeModel({ model: modelName });

        const test = await this.model.generateContent("Hi");
        await test.response;

        console.log(`✅ Connected successfully: ${modelName}`);
        return;
      } catch (err) {
        console.warn(`❌ Failed: ${modelName}`, err.message);
      }
    }

    throw new Error("No working Gemini model found. Check your API Key or Billing.");
  }

  async generateContent(prompt) {
    if (!this.model) await this.initializeModel();

    const result = await this.model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  }


    // ======================================================
  // ⭐ MULTILINGUAL ENGINE (ADD THIS AFTER generateContent)
  // ======================================================

  async detectLanguage(text) {
    const prompt = `
Detect the language of this text:
"${text}"

Respond ONLY with the language code:
hi, en, ta, bn, mr, gu, te
    `;
    let lang = await this.generateContent(prompt);
    return lang.trim().split(/\s+/)[0].toLowerCase();
  }

  async translate(text, targetLang) {
    if (!text || !targetLang) return text;

    const prompt = `
Translate this to ${targetLang}.
Only give translated text:

"${text}"
    `;
    return (await this.generateContent(prompt)).trim();
  }

  async multilingualProcess(userText, promptBuilder) {
    const lang = await this.detectLanguage(userText);

    const englishText =
      lang === "en" ? userText : await this.translate(userText, "en");

    const finalPrompt = promptBuilder(englishText);

    const englishOutput = await this.generateContent(finalPrompt);

    if (lang !== "en") {
      return await this.translate(englishOutput, lang);
    }

    return englishOutput;
  }



  async generatePackingList(destination, duration, season, activities) {
    return this.generateContent(`
      Create a detailed packing list for:
      Destination: ${destination}
      Duration: ${duration} days
      Season: ${season}
      Activities: ${activities.join(", ")}
    `);
  }

  async generateSafetyTips(destination, travelType) {
    return this.generateContent(`
      Give travel safety tips for:
      Location: ${destination}
      Type: ${travelType} traveler
    `);
  }

  async generateItinerary(destination, duration, interests, budget) {
    const prompt = `
You are GoTrip AI — respond ONLY in valid JSON that I can parse.

Create a structured and balanced travel itinerary.

RESPONSE FORMAT:

{
  "tripOverview": "2-3 line summary",
  "bestTime": "Best time to visit",
  "duration": "${duration} days",
  "mustVisit": [
    { "name": "Place", "why": "1 line reason", "lat": 0, "lng": 0 }
  ],
  "dayWisePlan": [
    {
      "day": 1,
      "title": "Short title",
      "morning": "Activity + location",
      "afternoon": "Activity + location",
      "evening": "Activity + location",
      "food": "One food suggestion"
    }
  ],
  "budget": {
    "flight": "₹ value",
    "stay": "₹ value (per night × days)",
    "food": "₹ value total",
    "localTravel": "₹ value total",
    "activities": "₹ value total",
    "total": "₹ value total"
  },
  "travelTips": ["Tip 1", "Tip 2"],
  "safetyNotes": ["Safety 1", "Safety 2"],
  "packingList": ["Item 1", "Item 2"]
}

RULES:
- NO markdown
- NO emojis
- ONLY pure JSON
- ALWAYS include lat/lng for places
- Keep text clean

Trip Details:
Destination: ${destination}
Days: ${duration}
Interests: ${interests.join(', ')}
Budget Level: ${budget}
    `;

    return await this.generateContent(prompt);
  }

  async generateBudgetEstimate(destination, duration, travelers, style) {
    return this.generateContent(`
      Estimate budget for trip:
      Location: ${destination}
      Days: ${duration}
      People: ${travelers.adults} adults, ${travelers.children} kids
      Travel Style: ${style}
    `);
  }


  /*
  async chatAboutTravel(query, context) {
    return this.generateContent(`
      Travel Question: ${query}
      Context: ${context}
    `);
  }
*/

async chatAboutTravel(query, context) {
  return await this.multilingualProcess(query, (engQuery) => {
    return `
Travel Question: ${engQuery}
Context: ${context}
Give a clean answer. No markdown.
    `;
  });
}



  /* ********************************************************************
   * 🚀 NEW ADDITIONS — AI Flights / Trains / Hotels
   * (Existing code above is untouched)
   ******************************************************************** */

  async generateFlights({ from, to, date, passengers = 1, classType = "Economy" }) {
    const prompt = `
Respond ONLY in valid JSON array.

Generate 12 realistic flight search results between "${from}" and "${to}" for date "${date}".

Each item must include:

{
  "airline": "string",
  "flight_code": "string",
  "departure_time": "HH:MM",
  "arrival_time": "HH:MM",
  "duration": "string",
  "stops": 0,
  "stops_details": [],
  "price_in_INR": 0,
  "baggage_limit": "string",
  "refundable": true,
  "booking_redirect_url": "https://www.makemytrip.com/flights"
}

RULES:
- Only JSON
- No markdown
- No extra explanation
`;

    return await this.generateContent(prompt);
  }

  async generateTrains({ from, to, date }) {
    const prompt = `
Return ONLY a JSON array.

Generate 12 realistic trains between "${from}" and "${to}" for "${date}".

Each train must follow:

{
  "train_name": "string",
  "train_number": "string",
  "departure_time": "HH:MM",
  "arrival_time": "HH:MM",
  "duration": "string",
  "classes": [
     { "className": "3A", "availability": "Available", "price_in_INR": 0 },
     { "className": "2A", "availability": "WL 3", "price_in_INR": 0 }
  ],
  "booking_redirect_url": "https://www.irctc.co.in/"
}

Rules:
- Only JSON array
- No extra words
`;

    return await this.generateContent(prompt);
  }


  

  async generateHotels({ city, checkin, checkout, guests = 1 }) {
    const prompt = `
Respond ONLY in valid JSON array.

Generate 15 realistic hotels for "${city}" from "${checkin}" to "${checkout}".

Each item must be:

{
  "name": "string",
  "image_url": "string",
  "rating": 0,
  "price_per_night": 0,
  "location": "string",
  "amenities": ["WiFi", "Breakfast", "AC"],
  "description": "short paragraph",
  "booking_redirect_url": "https://www.makemytrip.com/hotels/"
}

Rules:
- Only JSON array
- No text above or below JSON
`;

    return await this.generateContent(prompt);
  }


async getGeminiHelpAnswer(query) {
  const prompt = `
You are GoTrip AI — the official assistant.
Answer politely, clearly and concisely.
Use simple language.
No markdown. No emojis.

User question: "${query}"
  `;

  return await this.generateContent(prompt);
}


  /* ********************************************************************
   * ⭐ REQUIRED WRAPPER — DO NOT REMOVE
   * aiTravelService expects .generate()
   ******************************************************************** */
  async generate(prompt, options = {}) {
    return await this.generateContent(prompt);
  }
}



 


module.exports = new GeminiService();
