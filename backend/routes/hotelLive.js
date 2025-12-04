const router = require("express").Router();
const { searchHotels } = require("../controllers/HotelLiveController");

router.get("/search", searchHotels);

module.exports = router;
