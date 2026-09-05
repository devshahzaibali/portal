const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/candidate', protect, restrictTo('candidate'), dashboardController.candidateDashboard);
router.get('/recruiter', protect, restrictTo('recruiter'), dashboardController.recruiterDashboard);
router.get('/admin', protect, restrictTo('admin'), dashboardController.adminDashboard);

module.exports = router;
