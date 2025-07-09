const mongoose = require('mongoose');
 
const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Compilation Error", "Runtime Error"],
    default: "Pending",
  },
  output: String,
  testCaseResults: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      passed: Boolean,
    },
  ],
}, {timestamps : true});

module.exports = mongoose.model("Submission", submissionSchema);