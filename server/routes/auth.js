const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prismaClient')
const userController = require('../../controllers/userController')

router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;