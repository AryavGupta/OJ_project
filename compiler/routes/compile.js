const express = require('express');
const router = express.Router();

const executeCode = require('../utils/executeCode');
 
router.post('/', async (req, res) => {
  const { language, code, input } = req.body;
  if (!language || !code) {
    return res.status(400).json({ error: "Missing required fields!" });
  }

  try {
    const output = await executeCode(language, code, input);
    res.status(200).json({ output });
  } catch (err) {
    console.error("Compiler Error:", err); // 👈 this will show full error
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;