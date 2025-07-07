// seedTestCases.js
const mongoose = require("mongoose");
const TestCase = require("./models/TestCase");

const dotenv = require('dotenv');
dotenv.config();

// Replace this with your actual MongoDB URI
const MONGO_URI =process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Replace with actual problem IDs from your DB
const problem1 = "68697768070325a2aff37a8d";
const problem2 = "686bc875ec3bf6e0dfca26c2";

const testCases = [
  // 🔹 Problem 1: Find most frequent number
  {
    problemId: problem1,
    input: "6\n1 1 2 2 3 3",
    output: "1", // fallback
    accepts: ["1", "2", "3"], // any is fine, all same freq
    isSample: true,
  },
  {
    problemId: problem1,
    input: "5\n4 4 4 2 2",
    output: "4",
    accepts: ["4"],
    isSample: false,
  },
  {
    problemId: problem1,
    input: "7\n5 5 5 5 1 1 1",
    output: "5",
    accepts: ["5"],
    isSample: false,
  },

  // 🔹 Problem 2: Find max element
  {
    problemId: problem2,
    input: "6\n12 7 9 15 3 8",
    output: "15",
    accepts: ["15"],
    isSample: true,
  },
  {
    problemId: problem2,
    input: "4\n-5 -1 -10 -3",
    output: "-1",
    accepts: ["-1"],
    isSample: false,
  },
  {
    problemId: problem2,
    input: "3\n100 200 300",
    output: "300",
    accepts: ["300"],
    isSample: false,
  }
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