const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/convert", async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    const api = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const r = await axios.get(api);

    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: "Conversion failed" });
  }
});

module.exports = router;
