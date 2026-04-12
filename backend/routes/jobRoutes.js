// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, filterJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { jobValidation } = require('../middleware/validation');

router.get('/filter', filterJobs);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
