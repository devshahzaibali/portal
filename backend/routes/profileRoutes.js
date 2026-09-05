const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect, restrictTo('candidate'));

router.get('/', profileController.getMyProfile);

router.patch(
  '/',
  [
    body().custom((value, { req }) => {
      const allowed = ['headline', 'skills', 'education', 'experience', 'resumeUrl', 'portfolioUrl'];
      const hasAtLeastOne = allowed.some((f) => req.body[f] !== undefined);
      if (!hasAtLeastOne) {
        throw new Error('At least one profile field must be provided');
      }
      return true;
    }),
  ],
  validate,
  profileController.updateMyProfile
);

module.exports = router;
