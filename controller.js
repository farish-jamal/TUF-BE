const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db.js");

exports.handleAdminRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const admin = await db.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);
    if (admin[0].length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = await db.query(
      "INSERT INTO admin (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    const token = jwt.sign(
      { id: newAdmin[0].id, role: "admin" },
      process.env.JWT_KEY
    );
    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error.message });
  }
};

exports.handleAdminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const [data] = await db.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);
    if (data[0].length === 0) {
      return res.status(400).json({ message: "Admin does not exist" });
    }
    const admin = data[0];
    console.log(admin);
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_KEY
    );
    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.handleGetCards = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM flashcards");
    if (data.length === 0)
      return res.status(404).json({ data: [], message: "No flashcard found" });
    return res
      .status(200)
      .json({ data: data[0], message: "All flashcard found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error.message });
  }
};

exports.handleAddCard = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer)
    return res
      .status(400)
      .json({ data: [], message: "All fields are required" });
  try {
    const data = db.query(
      `INSERT INTO flashcards (question, answer) VALUES ('${question}', '${answer}')`
    );
    return res.status(201).json({ message: "Card Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error.message });
  }
};

exports.handleUpdateCard = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  if (!question || !answer)
    return res
      .status(400)
      .json({ data: [], message: "All fields are required" });
  try {
    const data = db.query(
      `UPDATE flashcards SET question = '${question}', answer = '${answer}' WHERE id = ${id}`
    );
    return res.status(200).json({ message: "Card updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error.message });
  }
};

exports.handleDeleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.query(`DELETE FROM flashcards WHERE id = ${id}`);
    if (data[0].affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Card not found or already deleted" });
    }
    return res.status(200).json({ message: "Card Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error.message });
  }
};
