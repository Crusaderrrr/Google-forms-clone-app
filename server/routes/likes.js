const express = require('express');
const router = express.Router();
const likesController = require('../../controllers/likesController');

router.post('/submit', likesController.submitLike);
router.delete('/delete', likesController.deleteLike);

module.exports = router;