const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect, restrictTo('recruiter'));

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Company name is required')],
  validate,
  companyController.createCompany
);

router.get('/my-company', companyController.getMyCompany);

router.patch('/:id', companyController.updateCompany);

module.exports = router;
