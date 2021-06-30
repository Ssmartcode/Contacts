const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  contactName: { type: String, require: true },
  contactRelation: { type: String, require: true },
  contactPhone: { type: String, require: true },
  contactEmail: { type: String, require: true },
  contactWebsite: { type: String, require: true },
  contactImage: { type: String, require: true },
});

module.exports = mongoose.model("Contact", ContactSchema);
