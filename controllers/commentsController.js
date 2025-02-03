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











const fs = require('fs').promises;
const path = require('path');

const commentsFile = path.join(__dirname, '../data/comments.json');

// Asegurarse de que el archivo `comments.json` exista, si no, crear uno vacío
const ensureCommentsFileExists = async () => {
  try {
    await fs.access(commentsFile);
  } catch (err) {
    // Si el archivo no existe, crearlo vacío
    await fs.writeFile(commentsFile, JSON.stringify([]));
  }
};

// Leer los comentarios de forma segura
const readComments = async () => {
  await ensureCommentsFileExists(); // Asegurarse de que el archivo existe antes de leerlo
  try {
    const rawData = await fs.readFile(commentsFile, 'utf8');
    const data = JSON.parse(rawData);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error al leer el archivo de comentarios:', err);
    return [];
  }
};

// Escribir los comentarios en el archivo
const writeComments = async (comments) => {
  try {
    await fs.writeFile(commentsFile, JSON.stringify(comments, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al escribir en el archivo de comentarios:', err);
  }
};

// Agregar un nuevo comentario
const addComment = async (req, res) => {
  const { name, comment, detail, urlPicture } = req.body;

  if (!name || !comment || !detail || !urlPicture) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const comments = await readComments();
  const newComment = { name, comment, detail, urlPicture };

  comments.push(newComment);
  await writeComments(comments);

  return res.status(201).json({ message: 'Comentario guardado exitosamente.' });
};

// Obtener todos los comentarios
const getComments = async (req, res) => {
  const comments = await readComments();
  return res.status(200).json({ comments });
};

// Actualizar un comentario
const updateComment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, comment, detail, urlPicture } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Índice no válido.' });
  }

  const comments = await readComments();

  if (id < 0 || id >= comments.length) {
    return res.status(400).json({ error: 'Índice fuera de rango.' });
  }

  comments[id] = { name, comment, detail, urlPicture };
  await writeComments(comments);

  return res.status(200).json({ message: 'Comentario actualizado exitosamente.' });
};

// Eliminar un comentario
const deleteComment = async (req, res) => {
  const { index } = req.params;
  const comments = await readComments();

  if (index < 0 || index >= comments.length) {
    return res.status(404).json({ error: 'Comentario no encontrado.' });
  }

  comments.splice(index, 1);
  await writeComments(comments);

  return res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
