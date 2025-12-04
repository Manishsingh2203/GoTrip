const router = require("express").Router();
const { searchTrains, liveStatus } = require("../controllers/TrainController");

router.get("/search", searchTrains);
router.get("/status", liveStatus);

module.exports = router;
