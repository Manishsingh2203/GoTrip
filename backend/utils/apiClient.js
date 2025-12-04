const axios = require('axios');

class ApiClient {
  constructor(baseURL, headers = {}) {
    this.client = axios.create({
      baseURL,
      headers,
      timeout: 10000
    });

    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('API Client Error:', error.message);
        throw error;
      }
    );
  }

  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }
}


/* ------------------------------------------------------------------ */
/* 🔥 AI JSON Extraction Helpers (ADDED ONLY – no modification above) */
/* ------------------------------------------------------------------ */

// Extract pure JSON array/object from messy Gemini output
function extractJSON(text) {
  if (!text) return null;

  // Match JSON array
  const arrayMatch = text.match(/(\[.*\])/s);
  if (arrayMatch) return arrayMatch[1];

  // Match single JSON object
  const objMatch = text.match(/(\{.*\})/s);
  if (objMatch) return objMatch[1];

  return null;
}

// Safely parse JSON without breaking app
function parseJsonSafely(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    // Try extraction
    const extracted = extractJSON(text);
    if (extracted) {
      try {
        return JSON.parse(extracted);
      } catch (err) {
        return null;
      }
    }
  }

  return null;
}


module.exports = {
  ApiClient,
  extractJSON,
  parseJsonSafely
};
