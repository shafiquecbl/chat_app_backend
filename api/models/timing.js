const mongoose = require('mongoose');

const timeschema = new mongoose.Schema({
    
    time_duration: {
        type: Number,
    },
    date:{
        type: Date,
        default:Date.now
    }
  

});

module.exports = mongoose.model("Timing", timeschema);