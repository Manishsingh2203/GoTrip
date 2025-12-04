// routes/safety.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Simple proxy that tries travel-advisory.info then returns a normalized object.
// You can replace this with Riskline / TravelSafe / Amadeus if you have API keys.
router.get('/advisory', async (req, res) => {
  try {
    const country = req.query.country;
    if (!country) return res.status(400).json({ error: 'country required' });

    // Option A: try travel-advisory.info (public)
    try {
      // travel-advisory.info root endpoint returns data keyed by ISO code.
      const ta = await axios.get('https://www.travel-advisory.info/api');
      // attempt to find by country name (best-effort)
      const data = ta.data?.data || {};
      // naive search: loop keys and match name
      let found = null;
      for (const code of Object.keys(data)) {
        const item = data[code];
        if (!item || !item.name) continue;
        if (item.name.toLowerCase() === country.toLowerCase() || (item.name && item.name.toLowerCase().includes(country.toLowerCase()))) {
          found = item;
          break;
        }
      }
      if (found) {
        const score = (found.advisory?.score ? Math.min(100, Math.round(found.advisory.score * 20)) : 50);
        return res.json({
          score,
          level: found.advisory?.message || 'Advisory',
          summary: found.advisory?.source || 'travel-advisory.info',
          source: 'travel-advisory.info'
        });
      }
    } catch (e) {
      // fallback quietly
    }

    // Option B: fallback – return a neutral response (so frontend still works)
    return res.json({
      score: 65,
      level: 'Exercise normal precautions',
      summary: 'No detailed advisory available via public sources. Use a premium provider for accurate travel risk.',
      source: 'fallback'
    });
  } catch (e) {
    return res.status(500).json({ error: 'safety lookup failed' });
  }
});

module.exports = router;
