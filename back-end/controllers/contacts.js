const Contact = require("../models/Contact");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.get = async (req, res, next) => {
  const user = await User.findById(req.userData.userId).populate("contacts");
  const contacts = user.contacts;
  console.log(contacts);
  res.json({ contacts });
};
exports.create = async (req, res, next) => {
  const user = await User.findById(req.userData.userId);

  const {
    contactName,
    contactRelation,
    contactPhone,
    contactEmail,
    contactWebsite,
  } = req.body;

  const contact = new Contact({
    contactName,
    contactRelation,
    contactPhone,
    contactEmail,
    contactWebsite,
    contactImage: req.file.filename,
    contactOwner: req.userData.userId,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const newContact = await contact.save({ session });
    user.contacts.push(newContact);
    await user.save({ session });

    session.commitTransaction();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ contact });
};

exports.delete = async (req, res, next) => {
  res.json({ message: "card deleted" });
};
