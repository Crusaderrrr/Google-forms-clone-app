const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.post('/submit', commentsController.submitComments)

module.exports = router;