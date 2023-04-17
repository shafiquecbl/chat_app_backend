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
    about: {
        type: String,
        required: false
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
    firebaseToken: {
        type: String,
        required: false
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
            favorite: {
                type: Boolean,
                required: false,
                default: false
            },
            createdAt: {
                type: Date,
                required: false
            },
            ended: {
                type: Boolean,
                required: false,
                default: false
            },
            image: {
                type: Boolean,
                required: false
            },
            request: {
                type: String,
                required: false,
            },
            sender: {
                type: String,
                required: false
            },
            startTime: {
                type: Date,
                required: false
            },

        }],
        required: false,
        default: []
    },
    image: {
        type: String,
        required: false
    },
    listenStatus: {
        type: Boolean,
        required: false,
        default: false
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