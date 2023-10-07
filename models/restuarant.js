const mongoose = require('mongoose')

  const restuarantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }, 
    itemID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }]

  });
  
  module.exports = mongoose.model('Restuarant', restuarantSchema)