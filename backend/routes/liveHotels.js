const router = require("express").Router();
const HotelService = require("../services/liveHotels");

router.get("/", async (req, res) => {
  const { city, checkin, checkout } = req.query;

  const resp = await HotelService.searchHotels(city, checkin, checkout);
  res.json(resp);
});

module.exports = router;
