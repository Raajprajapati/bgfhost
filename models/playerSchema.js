const mongoose = require('mongoose');
const playerSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true,
      maxlength: 15
    },
    country: { 
      type: String, 
      required: true,
      maxlength: 2
    },
    score: { 
      type: Number, 
      required: true 
    },
  }
);

 module.exports = mongoose.model('Player', playerSchema);