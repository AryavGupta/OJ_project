const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const Submission = require('../models/Submission');
const TestCase = require('../models/TestCase');
// const API_COMPILER = require('../../frontend/src/services/apiCompiler');
const API_COMPILER = require('../services/apiCompiler');

router.post('/', protect, async (req, res) => {
  const { code, language, problemId } = req.body;
  const userId = req.user._id;

  try {
    const testCases = await TestCase.find({ problemId, isSample: false });

    if (!testCases.length) {
      return res.status(400).json({ message: "No tc found!!" });
    }

    let allPassed = true;
    const testCaseResults = [];

    for (let tc of testCases) {
      try {
        const response = await API_COMPILER.post("/run", {
          code,
          language,
          input: tc.input,
        });

        const actualOutput = response.data.output.trim();
        const expectedOutputs = tc.accepts?.length ? tc.accepts.map(o => o.trim()) : [tc.output.trim()];
        
        const passed = expectedOutputs.includes(actualOutput);
        // const expectedOutput = tc.output.trim();
        // const passed = actualOutput === expectedOutput;

        if (!passed) allPassed = false;

        testCaseResults.push({
          input: tc.input,
          expectedOutput: expectedOutputs[0],
          actualOutput,
          passed,
        });

      } catch (err) {
        console.error("Compiler error : ", err.response?.data || err.message);
        return res.status(200).json({
          verdict: "Compilation Error",
          testCaseResults: [],
          error: err.response?.data?.error || "Compilation failed.",
        });
      }
    }
    const verdict = allPassed ? "Accepted" : "Wrong Answer";
    const submission = new Submission({
      userId,
      problemId,
      language,
      code,
      verdict,
      output: testCaseResults.map(t => t.actualOutput).join("\n---\n"),
      testCaseResults,
    });

    await submission.save();
    res.status(200).json({ message: "Submitted", verdict, testCaseResults });
  } catch (err) {
    console.error("Submit error : ", err);
    res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = router;