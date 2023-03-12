const mongoose = require("mongoose");
const validator = require("validator")

const expenseSchema = new mongoose.Schema({
    name: { type: String },
    amount: { type: Number },
    category: { type: String },
    description: { type: String },
    date: { type: String }
})

module.exports = mongoose.model("Expenses", expenseSchema);