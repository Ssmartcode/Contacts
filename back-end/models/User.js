const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userName: { type: String, require: true },
  userPassword: { type: String, require: true },
  contacts: [{ type: mongoose.Types.ObjectId, ref: "Contact" }],
});

module.exports = mongoose.model("User", UserSchema);
