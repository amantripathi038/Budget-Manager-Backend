const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Expenses = require("./expenseModel")

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
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"]
    },
    contact: {
        type: Number,
        validate: [validator.isNumeric, "Please Enter a valid Contact"],
    },
    expenses: [{ type: mongoose.Schema.Types.ObjectId }],
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
    await Expenses.findByIdAndDelete(id)
}

module.exports = mongoose.model("Users", userSchema);