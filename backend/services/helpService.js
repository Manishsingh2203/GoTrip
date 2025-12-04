const gemini = require("./geminiService");

exports.generateHelpResponse = async (query) => {
  try {
    return await gemini.getGeminiHelpAnswer(query);
  } catch (err) {
    console.error("Help Service Error:", err);
    return "Sorry, I couldn't process your request.";
  }
};
