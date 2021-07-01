const express = require("express");
const { imageUpload } = require("../middleware/multer");

const router = express.Router();

contactsController = require("../controllers/contacts");

router.use(require("../middleware/jwt"));

router.get("/", contactsController.get);

router.post("/", imageUpload.single("contactImage"), contactsController.create);

router.delete("/:id", contactsController.delete);

module.exports = router;
