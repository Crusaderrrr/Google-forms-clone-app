const express = require('express')
const router = express.Router();
const templateController = require('../../controllers/templateController');

router.get('/myTemplates', templateController.getAllTemplates);

module.exports = router;