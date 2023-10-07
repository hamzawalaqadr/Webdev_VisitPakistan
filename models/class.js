const mongoose = require('mongoose')



const classSchema = new mongoose.Schema({
    name: String,
    desc: String,
  });
  
  module.exports = mongoose.model('Class', classSchema)