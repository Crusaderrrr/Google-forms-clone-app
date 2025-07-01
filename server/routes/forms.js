const express = require('express');
const router = express.Router();
const formController = require('../../controllers/formController');

router.post('/create', formController.createForm);
router.get('/formInfo/:id', formController.getFormInfo);
router.get('/', formController.getAllForms);
router.delete('/delete', formController.deleteForms);
router.put('/update', formController.updateForm);

module.exports = router;