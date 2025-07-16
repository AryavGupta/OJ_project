const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const AiUsage = require('../models/AiUsage');
const { protect } = require('../middleware/authMiddleware');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

// Add this new route for fetching AI usage
router.get('/usage', protect, async (req, res) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    let usage = await AiUsage.findOne({ userId, date: today });
    if (!usage) {
      usage = await AiUsage.create({ userId, date: today, count: 0 });
    }
    
    const remaining = Math.max(0, 5 - usage.count);
    res.json({ remaining, used: usage.count, total: 5 });
  } catch (err) {
    console.error("Error fetching AI usage:", err);
    res.status(500).json({ error: "Failed to fetch AI usage" });
  }
});

router.post('/assist', protect, async (req, res) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const { mode, context } = req.body;

  const promptMap = {
    hint: `
You are a coding mentor. The user is stuck.
Problem: ${context.problem}
User's code:
${context.code}
Language: ${context.language}

Provide a helpful hint (not the solution). Focus on approach or missing concepts.
`,
    debug: `
You are a debugging expert.
Code:
${context.code}
Failed Test Cases:
${context.failedTests}

Explain the bug in 2 lines and suggest a fix with comments.
`,
    optimize: `
You are a code optimization expert.
Code:
${context.code}
Constraints: ${context.constraints}

Suggest improvements in:
1. Variable naming
2. Time/space complexity
3. Code readability
`,
    explain: `
You are a CS teacher.
Problem:
${context.problem}
Solution Code:
${context.code}

Explain the algorithm and key insights in beginner-friendly terms. Include time complexity.
`
  };

  try {
    const prompt = promptMap[mode];
    if (!prompt) return res.status(400).json({ error: "Invalid mode" });
    
    let usage = await AiUsage.findOne({ userId, date: today });
    if (!usage) {
      usage = await AiUsage.create({ userId, date: today, count: 0 });
    }
    if (usage.count >= 5) {
      return res.status(429).json({ error: "Daily Ask AI limit reached." });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    usage.count++;
    await usage.save();

    res.json({ result: text, remaining: 5 - usage.count });
  }
  catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Gemini Assistant failed" });
  }
});

module.exports = router;