const fs = require('fs');
const path = require('path');

// Ruta para agregar un comentario
const addComment = (req, res) => {
  const { name, comment, detail, urlPicture } = req.body;

  if (!name || !comment || !detail || !urlPicture) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const newComment = { name, comment, detail, urlPicture };

  fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
    }

    const comments = JSON.parse(data || '[]');
    comments.push(newComment);

    fs.writeFile(path.join(__dirname, '../data/comments.json'), JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo guardar el comentario.' });
      }
      res.status(201).json({ message: 'Comentario guardado exitosamente.' });
    });
  });
};

// Ruta para leer los comentarios
const getComments = (req, res) => {
  fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
    }
    const comments = JSON.parse(data || '[]');
    res.status(200).json({ comments });
  });
};

// Ruta para actualizar un comentario
const updateComment = (req, res) => {
  const { name, comment, detail, urlPicture } = req.body;
  const { id } = req.params;

  if (!name || !comment || !detail || !urlPicture) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
    }

    const comments = JSON.parse(data || '[]');

    if (!comments[id]) {
      return res.status(404).json({ error: 'Comentario no encontrado.' });
    }

    comments[id] = { name, comment, detail, urlPicture };

    fs.writeFile(path.join(__dirname, '../data/comments.json'), JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo actualizar el comentario.' });
      }
      res.status(200).json({ message: 'Comentario actualizado exitosamente.' });
    });
  });
};

// Ruta para eliminar un comentario
const deleteComment = (req, res) => {
  const { id } = req.params;

  fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
    }

    const comments = JSON.parse(data || '[]');

    if (!comments[id]) {
      return res.status(404).json({ error: 'Comentario no encontrado.' });
    }

    comments.splice(id, 1);

    fs.writeFile(path.join(__dirname, '../data/comments.json'), JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo eliminar el comentario.' });
      }
      res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
    });
  });
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
