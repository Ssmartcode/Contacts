// user realated routes
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// signup
exports.signup = async (req, res, next) => {
  const { userName, userPassword } = req.body;
  const user = new User({ userName, userPassword });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(201).json({ message: "User created", user: userName });
};

// login
exports.login = async (req, res, next) => {
  const { userName, userPassword } = req.body;
  let user;
  try {
    user = await User.findOne({ userName });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.userPassword === userPassword) {
    // create a token for the user
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "30m",
    });
    return res.status(200).json({
      token,
      userName: user.userName,
    });
  } else res.status(404).json({ message: "User not found" });
};
