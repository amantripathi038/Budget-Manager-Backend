const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Expenses = require("./expenseModel");
const accountSchema = require("./accountModel");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        index: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"]
    },
    contact: {
        type: String,
    },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, index: true }],
    salary: {
        type: Number,
        default: 0
    },
    accounts: [accountSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Hash Password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

userSchema.methods.getAllExpenses = async function () {
    var expense = []
    for (var i = 0; i < this.expenses.length; i++) {
        expense.push(await Expenses.findById(this.expenses[i]))
    }
    return expense
}

userSchema.methods.removeExpense = async function (id) {
    this.expenses.remove(id)
    const exp = await Expenses.findById(id)
    this.salary += exp.amount || 0
    await Expenses.findByIdAndDelete(id)
}

const Users = mongoose.model("Users", userSchema);
Users.ensureIndexes()
module.exports = Users