const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const adminAuth = require('../middleware/adminMiddleware');

router.get('/:id', adminAuth, userController.getUserInfo);
router.get('/search', userController.searchUsers);
router.get('/', adminAuth, userController.getAllUsers);
router.post('/makeAdmin', adminAuth, userController.makeAdmin);
router.post('/removeAdmin', adminAuth, userController.removeAdmin);
router.post('/block', adminAuth, userController.blockUser);
router.post('/unblock', adminAuth, userController.unblockUser);
router.delete('/delete', adminAuth, userController.deleteUsers);

module.exports = router;