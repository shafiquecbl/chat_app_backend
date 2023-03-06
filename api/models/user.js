const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    interests: {
        type: [String],
        required: true,
        default: []
    },
    contacts: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            lastMessage: {
                type: String,
                required: false
            },
            createdAt: {
                type: Date,
                required: false
            },
            safe: {
                type: Boolean,
                required: false,
                default: false
            }

        }],
        required: false,
        default: []
    },
    image: {
        type: String,
        required: false
    },
    infoVisibility: {
        type: Boolean,
        required: false,
        default: true
    },
    rating: {
        type: Number,
        required: false,
        default: 0.0
    },
    ratingCount: {
        type: Number,
        required: false,
        default: 0,
    },
    online: {
        type: Boolean,
        required: false,
        default: false
    },
    token: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    },

});

module.exports = mongoose.model("User", userSchema);