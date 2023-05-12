const mongoose = require("mongoose");
const validator = require("validator");

const accountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of the string
    },
    accountNumber: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                // Custom validation function to check for positive integers
                return Number.isInteger(value);
            },
            message: "Account number must be a positive integer"
        }
    },
    accountType: {
        type: String,
        required: true // Limits the account type to specific values
    },
    accountBalance: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                // Custom validation function to check for positive numbers
                return validator.isDecimal(String(value)) && value >= 0;
            },
            message: "Account balance must be a non-negative number"
        }
    }
});

module.exports = accountSchema;