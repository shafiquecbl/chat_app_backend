const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    },

});

module.exports = mongoose.model("Message", messageSchema);