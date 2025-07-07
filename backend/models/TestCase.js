const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  output: { 
    type: String, 
    required: true 
  },
  accepts: {
    type: [String],
    default: [],
  },
  isSample: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("TestCase", testCaseSchema);