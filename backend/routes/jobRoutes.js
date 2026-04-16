// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, filterJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, optionalProtect, authorizeRoles } = require('../middleware/auth');
const { jobValidation } = require('../middleware/validation');

router.get('/filter', filterJobs);
router.get('/', optionalProtect, getAllJobs);
router.get('/:id', optionalProtect, getJobById);
router.post('/', protect, authorizeRoles('admin', 'superadmin'), jobValidation, createJob);
router.put('/:id', protect, authorizeRoles('admin', 'superadmin'), jobValidation, updateJob);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteJob);

module.exports = router;
