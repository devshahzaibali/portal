const express = require('express');
const { body } = require('express-validator');
const jobController = require('../controllers/jobController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Public
router.get('/', jobController.getJobs);

// Recruiter my-jobs list (must come before /:id)
router.get('/my-jobs', protect, restrictTo('recruiter'), jobController.getMyJobs);

// Job detail is public, but must also work for a logged-in recruiter/admin
// viewing their own non-approved job — so protect() is not applied here.
// req.user will simply be undefined for anonymous requests.
router.get('/:id', (req, res, next) => {
  // Soft-auth: attach req.user if a valid token is present, but don't block
  // the request if it's missing (matches "public, but owner/admin can see more").
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  return protect(req, res, next);
}, jobController.getJobById);

// Recruiter-only
router.post(
  '/',
  protect,
  restrictTo('recruiter'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('type').isIn(['full-time', 'part-time', 'internship', 'contract']).withMessage('Invalid job type'),
    body('workMode').isIn(['remote', 'onsite', 'hybrid']).withMessage('Invalid work mode'),
    body('deadline').isISO8601().toDate().withMessage('Deadline must be a valid date').custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
    body('salaryMin').optional().isNumeric().withMessage('salaryMin must be a number'),
    body('salaryMax').optional().isNumeric().withMessage('salaryMax must be a number').custom((value, { req }) => {
      if (req.body.salaryMin !== undefined && Number(value) < Number(req.body.salaryMin)) {
        throw new Error('salaryMax must be greater than or equal to salaryMin');
      }
      return true;
    }),
  ],
  validate,
  jobController.createJob
);

router.patch('/:id', protect, restrictTo('recruiter'), jobController.updateJob);
router.delete('/:id', protect, restrictTo('recruiter'), jobController.deleteJob);
router.get('/:id/applications', protect, restrictTo('recruiter'), jobController.getJobApplications);

// Admin-only
router.patch('/:id/approve', protect, restrictTo('admin'), jobController.approveJob);

module.exports = router;
