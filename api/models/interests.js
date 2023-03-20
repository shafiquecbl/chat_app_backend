const mongoose = require('mongoose');

const interestschema = new mongoose.Schema({
    
    interest: {
        type: String,
    }
  

});

module.exports = mongoose.model("Interest", interestschema);