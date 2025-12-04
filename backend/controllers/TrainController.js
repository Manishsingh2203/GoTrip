const trainsAPI = require("../services/trainsAPI");

exports.searchTrains = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ message: "from, to, date required" });
    }

    const trains = await trainsAPI.searchTrains({ from, to, date });

    res.json({ success: true, trains });
  } catch (err) {
    next(err);
  }
};

exports.liveStatus = async (req, res, next) => {
  try {
    const { trainNo } = req.query;

    const status = await trainsAPI.liveStatus({ trainNo });

    res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
};
