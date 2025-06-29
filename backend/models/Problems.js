const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true,
    unique : true,
  },
  statement : {
    type : String,
    required : true,
  },
  sampleInput : {
    type : String, 
    required : true,
  },
  sampleOutput : {
    type : String,
    required : true,
  },
  constraints: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  tags: [String],
   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

}, {timestamps : true});

module.exports = mongoose.model('Problem', problemSchema);