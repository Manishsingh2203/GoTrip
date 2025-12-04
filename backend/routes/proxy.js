const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/country", async (req, res) => {
  try {
    const { country } = req.query;
    const url = `https://restcountries.com/v3.1/name/${country}`;
    const { data } = await axios.get(url);
    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/wiki", async (req, res) => {
  try {
    const { title } = req.query;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const { data } = await axios.get(url);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
