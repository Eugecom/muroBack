// const fs = require('fs');
// const path = require('path');

// const addComment = (req, res) => {
//   const { name, comment, detail, urlPicture } = req.body;

//   if (!name || !comment || !detail || !urlPicture) {
//     return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
//   }

//   const newComment = { name, comment, detail, urlPicture };

//   fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
//     }

//     const comments = JSON.parse(data || '[]');
//     comments.push(newComment);

//     fs.writeFile(path.join(__dirname, '../data/comments.json'), JSON.stringify(comments, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'No se pudo guardar el comentario.' });
//       }
//       res.status(201).json({ message: 'Comentario guardado exitosamente.' });
//     });
//   });
// };

// const getComments = (req, res) => {
//   fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
//     }
//     const comments = JSON.parse(data || '[]');
//     res.status(200).json({ comments });
//   });
// };

// const updateComment = (req, res) => {
//   const { name, comment, detail, urlPicture } = req.body;
//   const { id } = req.params;

//   if (!name || !comment || !detail || !urlPicture) {
//     return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
//   }

//   fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
//     }

//     const comments = JSON.parse(data || '[]');

//     if (!comments[id]) {
//       return res.status(404).json({ error: 'Comentario no encontrado.' });
//     }

//     comments[id] = { name, comment, detail, urlPicture };

//     fs.writeFile(path.join(__dirname, '../data/comments.json'), JSON.stringify(comments, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'No se pudo actualizar el comentario.' });
//       }
//       res.status(200).json({ message: 'Comentario actualizado exitosamente.' });
//     });
//   });
// };

// const deleteComment = (req, res) => {
//   const { id } = req.params;

//   fs.readFile(path.join(__dirname, '../data/comments.json'), 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'No se pudieron leer los comentarios.' });
//     }

//     const comments = JSON.parse(data || '[]');

//     if (!comments[id]) {
//       return res.status(404).json({ error: 'Comentario no encontrado.' });
//     }

//     comments.splice(id, 1);

//     fs.writeFile(path.join(__dirname, '../data/comments.json'), JSON.stringify(comments, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'No se pudo eliminar el comentario.' });
//       }
//       res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
//     });
//   });
// };

// module.exports = {
//   addComment,
//   getComments,
//   updateComment,
//   deleteComment,
// };












const fs = require('fs');
const path = require('path');

const commentsFile = path.join(__dirname, '../data/comments.json');

// Función para leer comentarios de forma segura
const readComments = () => {
  try {
    if (!fs.existsSync(commentsFile)) return [];
    const data = fs.readFileSync(commentsFile, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
    return [];
  }
};

// Función para escribir comentarios de forma segura
const writeComments = (comments) => {
  try {
    fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escribir en el archivo JSON:', err);
  }
};

// Agregar un nuevo comentario
const addComment = (req, res) => {
  const { name, comment, detail, urlPicture } = req.body;

  if (!name || !comment || !detail || !urlPicture) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const comments = readComments();
  const newComment = { id: comments.length + 1, name, comment, detail, urlPicture };
  comments.push(newComment);
  writeComments(comments);

  res.status(201).json({ message: 'Comentario guardado exitosamente.' });
};

// Obtener comentarios
const getComments = (req, res) => {
  const comments = readComments();
  res.status(200).json({ comments });
};

// Actualizar comentario
const updateComment = (req, res) => {
  const { name, comment, detail, urlPicture } = req.body;
  const { id } = req.params;
  const comments = readComments();

  const index = comments.findIndex((c) => c.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'Comentario no encontrado.' });
  }

  comments[index] = { id: Number(id), name, comment, detail, urlPicture };
  writeComments(comments);

  res.status(200).json({ message: 'Comentario actualizado exitosamente.' });
};

// Eliminar comentario
// Eliminar comentario por posición en el array
const deleteComment = (req, res) => {
  const { index } = req.params;  // Usar el índice
  let comments = readComments();

  if (index < 0 || index >= comments.length) {
    return res.status(404).json({ error: 'Comentario no encontrado.' });
  }

  comments.splice(index, 1); // Eliminar el comentario en la posición indicada
  writeComments(comments);

  res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
};


module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
