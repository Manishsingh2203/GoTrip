const SavedPlace = require('../models/SavedPlace');

exports.savePlace = async (req, res, next) => {
  try {
    const user = req.user;
    const { placeId, data, notes, tags } = req.body;
    const saved = await SavedPlace.create({
      user: user._id,
      placeId: placeId || null,
      data,
      notes,
      tags: tags || []
    });
    res.status(201).json({ success: true, data: saved });
  } catch (err) { next(err); }
};

exports.getSavedPlaces = async (req, res, next) => {
  try {
    const user = req.user;
    const items = await SavedPlace.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) { next(err); }
};

exports.deleteSavedPlace = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id;
    await SavedPlace.deleteOne({ _id: id, user: user._id });
    res.json({ success: true });
  } catch (err) { next(err); }
};
