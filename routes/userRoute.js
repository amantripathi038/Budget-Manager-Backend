const express = require("express")
const { register, login, addExpense, removeExpense, getUser, removeMany } = require("../controllers/userController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router()

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/addExpense").post(isAuthenticatedUser, addExpense)

router.route("/removeExpense").post(isAuthenticatedUser, removeExpense)

router.route("/removeMany").post(isAuthenticatedUser, removeMany)

router.route('/getUser').post(isAuthenticatedUser, getUser)

module.exports = router;