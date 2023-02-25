const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  _id: { type: String },
  username: { type: String },
  email: { type: String },
  avatar: { type: Number, default: 1 },
  history: [{ type: Object, default: null }],
  favorite: [{ type: Object, default: null }],
});

module.exports = mongoose.model("profile", profileSchema);
