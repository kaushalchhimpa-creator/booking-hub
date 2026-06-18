const express = require('express');
const router = express.Router();
const { getProviders } = require('../controllers/providerController'); // Destructuring check kijiye


router.get('/', getProviders);

module.exports = router;