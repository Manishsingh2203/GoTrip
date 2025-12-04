const express = require("express");
const router = express.Router();
const { askHelp } = require("../controllers/helpController");

router.post("/ask", askHelp);

module.exports = router;
