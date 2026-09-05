const express = require('express');
const { body } = require('express-validator');
const interviewController = require('../controllers/interviewController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/applications/:applicationId/interview',
  protect,
  restrictTo('recruiter'),
  [
    body('scheduledAt').isISO8601().withMessage('scheduledAt must be a valid date'),
    body('mode').isIn(['online', 'onsite']).withMessage('mode must be online or onsite'),
  ],
  validate,
  interviewController.scheduleInterview
);

router.get('/:applicationId', protect, interviewController.getInterviewForApplication);

router.patch('/:id', protect, restrictTo('recruiter'), interviewController.updateInterview);

module.exports = router;
