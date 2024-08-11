const express = require("express");
const {
  handleGetCards,
  handleAddCard,
  handleUpdateCard,
  handleDeleteCard,
  handleAdminLogin,
  handleAdminRegister
} = require("./controller");
const { admin } = require("./middlware");
const router = express.Router();

router.route("/admin/register").post(handleAdminRegister);
router.route("/admin/login").post(handleAdminLogin);
router.route("/flashcards").get(handleGetCards).post(admin, handleAddCard);
router.route("/flashcards/:id").put(admin, handleUpdateCard);
router.route("/flashcards/:id").delete(admin, handleDeleteCard);

module.exports = router;
