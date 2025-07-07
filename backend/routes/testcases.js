const express = require("express");
const router = express.Router();
const TestCase = require("../models/TestCase");
const { protect, admin } = require("../middleware/authMiddleware");

router.post('/', protect, admin, async (req, res) => {
  const { problemId, input, output, isSample } = req.body;
  try {
    const testCase = new TestCase({problemId, input, output, isSample});
    await testCase.save();
    res.status(201).json(testCase);
  } catch (err) {
    res.status(500).json({ message: "Error creating test case", error: err.message })
  }
});

router.get("/:problemId", protect, async (req, res) => {
  try {
    const testcases = await TestCase.find({problemId : req.params.problemId});
    res.json(testcases);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test cases", error: err.message });
  }
});

module.exports = router;
