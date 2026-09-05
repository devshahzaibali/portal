const express = require('express');
const applicationController = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post(
  '/jobs/:jobId/apply',
  protect,
  restrictTo('candidate'),
  upload.single('resume'),
  applicationController.applyToJob
);

router.get('/my-applications', protect, restrictTo('candidate'), applicationController.getMyApplications);

router.get('/:id', protect, applicationController.getApplicationById);

router.patch(
  '/:id/status',
  protect,
  restrictTo('recruiter', 'admin'),
  applicationController.updateApplicationStatus
);

module.exports = router;
