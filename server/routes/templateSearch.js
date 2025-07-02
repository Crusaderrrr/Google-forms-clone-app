const express = require('express')
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/templates', templateController.searchTemplates);

module.exports = router;