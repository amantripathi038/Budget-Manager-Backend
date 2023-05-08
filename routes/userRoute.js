const express = require("express")
const { register, login, addExpense, removeExpense, getUser, removeMany, updateProfile, changePassword, creditSalary, editExpense, addAccount, deleteAccount } = require("../controllers/userController")
const { isAuthenticatedUser } = require("../middleware/auth")

const router = express.Router()

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/addExpense").post(isAuthenticatedUser, addExpense)

router.route("/removeExpense").post(isAuthenticatedUser, removeExpense)

router.route("/removeMany").post(isAuthenticatedUser, removeMany)

router.route('/getUser').post(isAuthenticatedUser, getUser)

router.route('/updateProfile').post(isAuthenticatedUser, updateProfile)

router.route('/changePassword').post(isAuthenticatedUser, changePassword)

router.route('/creditSalary').post(isAuthenticatedUser, creditSalary)

router.route('/editExpense').post(isAuthenticatedUser, editExpense)

router.route('/addAccount').post(isAuthenticatedUser, addAccount)

router.route('/deleteAccount').post(isAuthenticatedUser, deleteAccount)
module.exports = router;