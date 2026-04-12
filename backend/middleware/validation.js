const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Job validation rules
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('category').isIn(['Police', 'Clerk', 'Teaching', 'Others']).withMessage('Invalid category'),
  body('salary').trim().notEmpty().withMessage('Salary is required'),
  body('lastDate').isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)'),
  body('applyLink').trim().notEmpty().withMessage('Apply link is required').isURL().withMessage('Apply link must be a valid URL'),
  body('eligibility.gender').optional().isIn(['Male', 'Female', 'Both']).withMessage('Gender must be Male, Female, or Both'),
  body('eligibility.minAge').optional().isInt({ min: 16, max: 60 }).withMessage('Min age must be between 16 and 60'),
  body('eligibility.maxAge').optional().isInt({ min: 16, max: 60 }).withMessage('Max age must be between 16 and 60'),
  body('eligibility.qualification').optional().isIn(['10th', '12th', 'Graduate']).withMessage('Invalid qualification'),
  validate,
];

// Auth validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Subscriber validation
const subscriberValidation = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('name').optional().trim().isLength({ max: 100 }),
  body('categories').optional().isArray(),
  validate,
];

module.exports = { jobValidation, loginValidation, subscriberValidation, validate };
