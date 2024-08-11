const db = require("./db");
const jwt = require("jsonwebtoken");

exports.admin = async (req, res, next) => {
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    const data = jwt.verify(token, process.env.JWT_KEY);
    if (!data) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }
    if (data.role !== "admin") {
      return res.status(400).json({ message: "Only admin will have access." });
    }
    let currUser = await db.query(`Select * from admin Where id = ${data.id};`);
    if (currUser[0].length === 0) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    req.user = currUser[0][0];
    next();
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
