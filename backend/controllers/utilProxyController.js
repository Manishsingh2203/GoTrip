const axios = require("axios");

// 🌍 COUNTRY INFO (RestCountries API)
exports.getCountryInfo = async (req, res) => {
  try {
    const country = req.query.country;
    if (!country) {
      return res.status(400).json({ success: false, message: "country query missing" });
    }

    const url = `https://restcountries.com/v3.1/name/${country}?fullText=false`;
    const { data } = await axios.get(url);

    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Country API failed", error: err.message });
  }
};


// 📘 WIKIPEDIA SUMMARY
exports.getWikiSummary = async (req, res) => {
  try {
    const title = req.query.title;
    if (!title) {
      return res.status(400).json({ success: false, message: "title query missing" });
    }

    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const { data } = await axios.get(url);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Wiki API failed", error: err.message });
  }
};


// 💱 CURRENCY EXCHANGE
exports.getExchangeRate = async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const target = req.query.target || "INR";

    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`;
    const { data } = await axios.get(url);

    res.json({ success: true, rate: data.rates[target] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Exchange API failed", error: err.message });
  }
};
