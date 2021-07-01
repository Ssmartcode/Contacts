// user realated routes
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// signup
exports.signup = async (req, res, next) => {
  const { userName, userPassword } = req.body;
  const existingUser = await User.findOne({ userName });
  console.log(existingUser);
  if (existingUser)
    return res.status(401).json({ message: "This user name is taken" });

  const user = new User({ userName, userPassword, contacts: [] });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
  res.status(201).json({ message: "User created", token, userName: userName });
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
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
    return res.status(200).json({
      token,
      userName: user.userName,
    });
  } else res.status(404).json({ message: "User not found" });
};
