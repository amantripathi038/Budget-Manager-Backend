const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    goalName: {
        type: String,
        required: true,
        trim: true
    },
    goalStatus: {
        type: String,
        default: 'active',
        enum: ['active', 'paused', 'completed']
    },
    targetAmount: {
        type: Number,
        required: true
    },
    savedAmount: {
        type: Number,
        default: 0
    },
    desiredDate: {
        type: String
    }
});

module.exports = goalSchema