const express = require('express');
const {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/ProblemController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllProblems);
router.get('/:id', getProblemById);
router.post('/', protect, admin, createProblem);  // admin protected routes
router.put('/:id', protect, admin, updateProblem);  // admin protected routes
router.delete('/:id', protect, admin, deleteProblem);  // admin protected routes

module.exports = router;