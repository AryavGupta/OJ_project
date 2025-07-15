// seedTestCases.js
const mongoose = require("mongoose");
const TestCase = require("./models/TestCase");

const dotenv = require('dotenv');
dotenv.config();

// Replace this with your actual MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Replace with actual problem IDs from your DB
const problem1 = "68636cf6233b08050718f9d9";
// const problem2 = "686bc875ec3bf6e0dfca26c2";

const testCases = [
  // 🔹 Problem 1: Find most frequent number
  
  {
    problemId: problem1,
    input: "(())[{}]",
    output: "true",
    accepts: ["true"],
    isSample: true
  },
  {
    problemId: problem1,
    input: "()[]{}",
    output: "true",
    accepts: ["true"],
    isSample: false
  },
  {
    problemId: problem1,
    input: "{[()()]}",
    output: "true",
    accepts: ["true"],
    isSample: false
  },
  {
    problemId: problem1,
    input: " ",
    output: "true",
    accepts: ["true"],
    isSample: false
  },
  {
    problemId: problem1,
    input: "(]",
    output: "false",
    accepts: ["false"],
    isSample: false
  },
  {
    problemId: problem1,
    input: "([)]",
    output: "false",
    accepts: ["false"],
    isSample: false
  },
  {
    problemId: problem1,
    input: "((((",
    output: "false",
    accepts: ["false"],
    isSample: false
  },
  {
    problemId: problem1,
    input: "(()))",
    output: "false",
    accepts: ["false"],
    isSample: false
  },


  
];

async function seed() {
  try {
    await TestCase.insertMany(testCases);
    console.log("Test cases seeded successfully");
  } catch (err) {
    console.error("Error seeding test cases:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

seed();