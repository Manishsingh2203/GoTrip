const mongoose = require("mongoose");

const UserPlaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    state: String,
    city: String,
    country: { type: String, default: "India" },

    lat: Number,
    lng: Number,
    image: String,
    rating: Number,

    description: String,
    bestTime: String,

    activities: [
      {
        title: String,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPlace", UserPlaceSchema);
