const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Problem = require("./models/Problems");
const TestCase = require("./models/TestCase");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const problemsData = [
  {
    title: "Number of Provinces",
    statement:
      "You are given an n x n matrix isConnected where isConnected[i][j] = 1 means the ith and jth cities are directly connected, and 0 otherwise. A province is a group of directly or indirectly connected cities. Return the total number of provinces.",
    sampleInput: "3\n1 1 0\n1 1 0\n0 0 1",
    sampleOutput: "2",
    constraints:
      "1 <= n <= 200\nisConnected[i][j] == 1 or 0\nisConnected[i][i] == 1",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "BFS"],
  },
  {
    title: "Number of Connected Components",
    statement:
      "You are given an undirected graph with n nodes labeled from 0 to n - 1 and a list of edges. Return the number of connected components in the graph.",
    sampleInput: "5\n4\n0 1\n1 2\n3 4\n2 3",
    sampleOutput: "1",
    constraints:
      "1 <= n <= 10^5\n0 <= edges.length <= 10^5\n0 <= u, v < n",
    difficulty: "Medium",
    tags: ["Graph", "Union Find", "DFS"],
  },
];

const testCasesData = {
  "Number of Provinces": [
    {
      input: "3\n1 1 0\n1 1 0\n0 0 1",
      output: "2",
      accepts: ["2"],
      isSample: true,
    },
    {
      input: "3\n1 0 0\n0 1 0\n0 0 1",
      output: "3",
      accepts: ["3"],
      isSample: false,
    },
    {
      input: "3\n1 1 1\n1 1 1\n1 1 1",
      output: "1",
      accepts: ["1"],
      isSample: false,
    },
    {
      input: "4\n1 0 0 1\n0 1 1 0\n0 1 1 1\n1 0 1 1",
      output: "1",
      accepts: ["1"],
      isSample: false,
    },
  ],
  "Number of Connected Components": [
    {
      input: "5\n4\n0 1\n1 2\n3 4\n2 3",
      output: "1",
      accepts: ["1"],
      isSample: true,
    },
    {
      input: "5\n2\n0 1\n3 4",
      output: "3",
      accepts: ["3"],
      isSample: false,
    },
    {
      input: "4\n0",
      output: "4",
      accepts: ["4"],
      isSample: false,
    },
    {
      input: "6\n3\n0 1\n2 3\n4 5",
      output: "3",
      accepts: ["3"],
      isSample: false,
    },
  ],
};

async function seed() {
  try {
    const titles = problemsData.map((p) => p.title);
    await Problem.deleteMany({ title: { $in: titles } });

    const insertedProblems = await Problem.insertMany(problemsData);
    console.log("✅ Problems inserted:", insertedProblems.map(p => p.title));

    const titleToId = {};
    insertedProblems.forEach((p) => {
      titleToId[p.title] = p._id;
    });

    const allTestCases = [];
    for (const [title, testCases] of Object.entries(testCasesData)) {
      const problemId = titleToId[title];
      testCases.forEach((test) => {
        allTestCases.push({ ...test, problemId });
      });
    }

    await TestCase.insertMany(allTestCases);
    console.log("✅ Test cases inserted:", allTestCases.length);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

seed();
