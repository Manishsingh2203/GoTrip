const express = require("express");
const axios = require("axios");
const router = express.Router();

// RESTCOUNTRIES
router.get("/country", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Missing name" });

    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;
    const r = await axios.get(url);

    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: "REST Countries failed" });
  }
});

// WIKIPEDIA
router.get("/wiki", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ error: "Missing title" });

    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`;

    const r = await axios.get(url);
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: "Wikipedia failed" });
  }
});

// EXCHANGE RATE
router.get("/convert", async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    if (!from || !to)
      return res.status(400).json({ error: "Missing currency" });

    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;

    const r = await axios.get(url);
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: "Currency API failed" });
  }
});

module.exports = router;
