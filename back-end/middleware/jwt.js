const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "You need to be authenticated" });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = { userId: decodedToken.userId };
    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "You need to be authenticated" });
  }
};
module.exports = authenticateToken;
