const mongoose = require('mongoose');

const adminschema = new mongoose.Schema({
    
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
  

});

module.exports = mongoose.model("Admin", adminschema);