const Problem = require('../models/Problems');

// Get all problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({message : err.message});
  }
};

// Get a single problem by id
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if(!problem){
      res.status(400).json({message : "Problem not found"});
    }
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// create new prob by admin only
const createProblem = async (req, res) => {
  const {title, statement, sampleInput, sampleOutput, constraints, difficulty, tags } = req.body;
  try {
    const newProblem = new Problem({
      title,
      statement,
      sampleInput,
      sampleOutput,
      constraints,
      difficulty,
      tags,
      author : req.user.id,
    });
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {new : true});
    if(!updated){
      res.status(404).json({message : "Problem not found"});
    }
    res.status(200).json(updated);    
  } catch (err) {
    res.status(500).json({message : err.message});
  }
};

// Delete a prob by admin only
const deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({message : "Problem deleted successfully!!"});
  } catch (err) {
    res.status(500).json({message : err.message});
  }
};

module.exports = {
  getAllProblems,
  getProblemById, 
  createProblem,
  updateProblem,
  deleteProblem,
};