const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/companies', adminController.getCompanies);
router.patch('/companies/:id/approve', adminController.approveCompany);

router.get('/users', adminController.getUsers);
router.patch('/users/:id/deactivate', adminController.deactivateUser);

router.get('/jobs', adminController.getJobsForModeration);

module.exports = router;
