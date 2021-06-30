const Contact = require("../models/Contact");

exports.get = async (req, res, next) => {
  const contacts = await Contact.find({});
  res.json({ contacts });
};
exports.create = async (req, res, next) => {
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
  });

  try {
    await contact.save();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json(contact);
};

exports.delete = async (req, res, next) => {
  res.json({ message: "card deleted" });
};
