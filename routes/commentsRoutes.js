const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// Rutas de los comentarios
router.post('/', commentsController.addComment);
router.get('/', commentsController.getComments);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;
