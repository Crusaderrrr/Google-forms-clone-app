const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController')

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/guest', userController.guest);

module.exports = router;