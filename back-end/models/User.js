const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userName: { type: String, require: true },
  userPassword: { type: String, require: true },
});

module.exports = mongoose.model("User", UserSchema);
