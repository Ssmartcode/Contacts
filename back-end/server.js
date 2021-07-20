const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Could not connect to DB\n", err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "images")));

app.use("/users", require("./routes/users"));
app.use("/contacts", require("./routes/contacts"));

app.listen(process.env.PORT || "5000", () => {
  console.log("Connected on port 5000");
});
