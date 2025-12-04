const { generateHelpResponse } = require("../services/helpService");

exports.askHelp = async (req, res) => {
  try {
    const { query } = req.body;

    const answer = await generateHelpResponse(query);
    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.json({ answer: "Something went wrong." });
  }
};
