const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe } = require('../controllers/subscriberController');
const { subscriberValidation } = require('../middleware/validation');

router.post('/', subscriberValidation, subscribe);
router.get('/unsubscribe', unsubscribe);

module.exports = router;
