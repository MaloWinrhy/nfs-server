const express = require('express');
const { getAllPresentations, getPresentationById, createPresentation, updatePresentation, deletePresentation } = require('../controllers/presentationController');

const router = express.Router();



router.get('/', getAllPresentations);
router.get('/:id', getPresentationById);
router.post('/', createPresentation);
router.put('/:id', updatePresentation);
router.delete('/:id', deletePresentation);

module.exports = router;