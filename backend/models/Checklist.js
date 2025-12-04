const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema({
  userId: String,
  title: String,
  items: [
    {
      text: String,
      completed: Boolean,
    },
  ],
});

module.exports = mongoose.model("Checklist", checklistSchema);
