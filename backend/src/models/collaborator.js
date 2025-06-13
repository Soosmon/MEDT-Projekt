const db = require('./db');

async function getCollaboratorsByNote(noteId) {
  const [rows] = await db.query('SELECT * FROM Collaborator WHERE noteId = ?', [noteId]);
  return rows;
}

async function addCollaborator(collab) {
  const { noteId, userId, role } = collab;
  const [result] = await db.query(
    'INSERT INTO Collaborator (noteId, userId, role) VALUES (?, ?, ?)',
    [noteId, userId, role]
  );
  return { id: result.insertId, ...collab };
}

async function removeCollaborator(id) {
  await db.query('DELETE FROM Collaborator WHERE id = ?', [id]);
}

module.exports = { getCollaboratorsByNote, addCollaborator, removeCollaborator };
