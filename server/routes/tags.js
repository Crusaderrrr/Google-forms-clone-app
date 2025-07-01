const express = require('express');
const router = express.Router();
const tagController = require('../../controllers/tagController')

router.get('/search', tagController.searchTags);
router.get('/all', tagController.getAllTags);

module.exports = router;