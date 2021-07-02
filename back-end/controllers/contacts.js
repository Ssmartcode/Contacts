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
  if (!req.file) {
    return res.status(404).json({ message: "No image provided" });
  }
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
  const { userId } = req.userData;
  const contactId = req.params.id;

  let contact;
  try {
    contact = await Contact.findById(contactId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  if (contact.contactOwner.toString() === userId.toString()) {
    try {
      await Contact.findByIdAndDelete(contactId);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res
      .status(422)
      .json({ message: "You are not allowed to delete this" });
  }
  res.status(200).json({ message: "card deleted " + contactId });
};
