const axios = require('axios');

exports.getCountryInfo = async (req, res, next) => {
  try {
    const { codeOrName } = req.params;
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(codeOrName)}`;
    const r = await axios.get(url);
    res.json({ success: true, data: r.data });
  } catch (err) { next(err); }
};

exports.getWikipediaSummary = async (req, res, next) => {
  try {
    const { title } = req.params;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const r = await axios.get(url);
    res.json({ success: true, data: r.data });
  } catch (err) { next(err); }
};

exports.getExchangeRate = async (req, res, next) => {
  try {
    const { base = 'USD', target = 'INR' } = req.query;
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`;
    const r = await axios.get(url);
    res.json({ success: true, data: r.data });
  } catch (err) { next(err); }
};
