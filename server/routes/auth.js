const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController')
const blocked = require('../middleware/blockedMiddleware');

router.post('/login', blocked, userController.login);
router.post('/signup', userController.signup);
router.post('/guest', userController.guest);
router.get('/me', userController.getMe);

module.exports = router;