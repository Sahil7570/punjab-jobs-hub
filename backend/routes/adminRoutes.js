const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/stats', protect, authorizeRoles('admin', 'superadmin'), getDashboardStats);

module.exports = router;
