const express = require('express')
const router = express.Router();
const templateController = require('../../controllers/templateController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/myTemplates', templateController.getAllTemplates);
router.post('/create', upload.single('image'), templateController.createTemplate);
router.get('/latest', templateController.getLatestTemplates);


module.exports = router;