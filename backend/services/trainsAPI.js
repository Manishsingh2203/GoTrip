const axios = require("axios");

const TRAIN_KEY = process.env.RAPID_TRAIN_KEY;

exports.searchTrains = async ({ from, to, date }) => {
  try {
    const url = "https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations";

    const resp = await axios.get(url, {
      params: { fromStationCode: from, toStationCode: to, dateOfJourney: date },
      headers: {
        "X-RapidAPI-Key": TRAIN_KEY,
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    });

    return resp.data?.data || [];
  } catch (err) {
    console.log("Train API FAILED:", err.response?.data || err.message);
    return []; // frontend me safe response
  }
};

exports.liveStatus = async ({ trainNo }) => {
  try {
    const url = "https://irctc1.p.rapidapi.com/api/v1/getTrainLiveStatus";

    const resp = await axios.get(url, {
      params: { trainNo },
      headers: {
        "X-RapidAPI-Key": TRAIN_KEY,
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    });

    return resp.data;
  } catch (err) {
    console.log("Live status error:", err.response?.data || err.message);
    return null;
  }
};
