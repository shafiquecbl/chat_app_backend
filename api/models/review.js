const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Review", reviewSchema);