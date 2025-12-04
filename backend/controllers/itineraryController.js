const Itinerary = require('../models/Itinerary');

exports.createItinerary = async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { ...req.body, user: user._id };
    const it = await Itinerary.create(payload);
    res.status(201).json({ success: true, data: it });
  } catch (err) { next(err); }
};

exports.getMyItineraries = async (req, res, next) => {
  try {
    const data = await Itinerary.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

exports.updateItinerary = async (req, res, next) => {
  try {
    const it = await Itinerary.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    res.json({ success: true, data: it });
  } catch (err) { next(err); }
};

exports.deleteItinerary = async (req, res, next) => {
  try {
    await Itinerary.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) { next(err); }
};
