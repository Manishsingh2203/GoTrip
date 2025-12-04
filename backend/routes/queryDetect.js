const express = require("express");
const router = express.Router();
const queryDetectController = require("../controllers/queryDetectController");

router.post("/detect", queryDetectController.detectQueryType);

module.exports = router;
