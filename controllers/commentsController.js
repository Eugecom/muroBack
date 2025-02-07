// const fs = require('fs').promises;
// const path = require('path');

// const commentsFile = path.join(__dirname, '../data/comments.json');

// // Asegurarse de que el archivo `comments.json` exista, si no, crear uno vacío
// const ensureCommentsFileExists = async () => {
//   try {
//     await fs.access(commentsFile);
//   } catch (err) {
//     // Si el archivo no existe, crearlo vacío
//     await fs.writeFile(commentsFile, JSON.stringify([]));
//   }
// };

// // Leer los comentarios de forma segura
// const readComments = async () => {
//   await ensureCommentsFileExists(); // Asegurarse de que el archivo existe antes de leerlo
//   try {
//     const rawData = await fs.readFile(commentsFile, 'utf8');
//     const data = JSON.parse(rawData);
//     return Array.isArray(data) ? data : [];
//   } catch (err) {
//     console.error('Error al leer el archivo de comentarios:', err);
//     return [];
//   }
// };

// // Escribir los comentarios en el archivo
// const writeComments = async (comments) => {
//   try {
//     const tempFile = commentsFile + '.tmp';
//     await fs.writeFile(tempFile, JSON.stringify(comments, null, 2), 'utf8');
//     await fs.rename(tempFile, commentsFile);
    
//   } catch (err) {
//     console.error('Error al escribir en el archivo de comentarios:', err);
//   }
// };

// // Agregar un nuevo comentario
// const addComment = async (req, res) => {
//   const { name, comment, detail, urlPicture } = req.body;

//   if (!name || !comment || !detail || !urlPicture) {
//     return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
//   }

//   const comments = await readComments();
//   const newComment = { name, comment, detail, urlPicture };

//   comments.push(newComment);
//   await writeComments(comments);

//   return res.status(201).json({ message: 'Comentario guardado exitosamente.' });
// };

// // Obtener todos los comentarios
// const getComments = async (req, res) => {
//   const comments = await readComments();
//   return res.status(200).json({ comments });
// };

// // Actualizar un comentario
// const updateComment = async (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const { name, comment, detail, urlPicture } = req.body;

//   if (isNaN(id)) {
//     return res.status(400).json({ error: 'Índice no válido.' });
//   }

//   const comments = await readComments();

//   if (id < 0 || id >= comments.length) {
//     return res.status(400).json({ error: 'Índice fuera de rango.' });
//   }

//   comments[id] = { name, comment, detail, urlPicture };
//   await writeComments(comments);

//   return res.status(200).json({ message: 'Comentario actualizado exitosamente.' });
// };

// // Eliminar un comentario
// const deleteComment = async (req, res) => {
//   const { index } = req.params;
//   const comments = await readComments();

//   if (index < 0 || index >= comments.length) {
//     return res.status(404).json({ error: 'Comentario no encontrado.' });
//   }

//   comments.splice(index, 1);
//   await writeComments(comments);

//   return res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
// };

// module.exports = {
//   addComment,
//   getComments,
//   updateComment,
//   deleteComment,
// };







const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: 'postgresql://eugenio:hLk6nqJdERW5ub16ptp8dbHxL265Wku7@dpg-cuiijphu0jms738pk8p0-a.oregon-postgres.render.com/murodemontana',
  ssl: { rejectUnauthorized: false }
});     


// Agregar un nuevo comentario
const addComment = async (req, res) => {
  const { name, comment, detail, urlPicture } = req.body;

  if (!name || !comment || !detail || !urlPicture) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    await pool.query(
      'INSERT INTO comments (name, comment, detail, urlPicture) VALUES ($1, $2, $3, $4)',
      [name, comment, detail, urlPicture]
    );
    return res.status(201).json({ message: 'Comentario guardado exitosamente.' });
  } catch (err) {
    console.error('Error al agregar comentario:', err);
    return res.status(500).json({ error: 'Error al agregar comentario.' });
  }
};

// Obtener todos los comentarios
const getComments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments');
    return res.status(200).json({ comments: result.rows });
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    return res.status(500).json({ error: 'Error al obtener comentarios.' });
  }
};

// Actualizar un comentario por ID
const updateComment = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, comment, detail, urlPicture } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID no válido.' });
  }

  try {
    const result = await pool.query(
      'UPDATE comments SET name = $1, comment = $2, detail = $3, urlPicture = $4 WHERE id = $5',
      [name, comment, detail, urlPicture, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado.' });
    }

    return res.status(200).json({ message: 'Comentario actualizado exitosamente.' });
  } catch (err) {
    console.error('Error al actualizar comentario:', err);
    return res.status(500).json({ error: 'Error al actualizar comentario.' });
  }
};

// Eliminar un comentario por ID
const deleteComment = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID no válido.' });
  }

  try {
    const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado.' });
    }

    return res.status(200).json({ message: 'Comentario eliminado exitosamente.' });
  } catch (err) {
    console.error('Error al eliminar comentario:', err);
    return res.status(500).json({ error: 'Error al eliminar comentario.' });
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
