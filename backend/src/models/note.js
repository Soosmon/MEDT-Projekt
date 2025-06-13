const db = require('./db');

// Holt alle Notizen, bei denen der User entweder Besitzer oder Collaborator ist
async function getAllNotesForUser(userId) {
  const [rows] = await db.query(`
    SELECT DISTINCT n.*, u.username AS lastEditorName
    FROM Note n
    LEFT JOIN User u ON u.id = n.lastEditorId
    LEFT JOIN Collaborator c ON c.noteId = n.id
    WHERE n.ownerId = ? OR c.userId = ?
  `, [userId, userId]);
  return rows;
}

async function getNoteById(id) {
  const [rows] = await db.query('SELECT * FROM Note WHERE id = ?', [id]);
  return rows[0];
}

async function createNote(note) {
  const { title, content, ownerId } = note;
  // lastEditorId ist beim Erstellen der Besitzer
  const [result] = await db.query(
    'INSERT INTO Note (title, content, ownerId, lastEditorId) VALUES (?, ?, ?, ?)',
    [title, content, ownerId, ownerId]
  );
  return { id: result.insertId, ...note, lastEditorId: ownerId };
}

async function updateNote(id, note) {
  const { title, content, lastEditorId } = note;
  await db.query(
    'UPDATE Note SET title = ?, content = ?, lastEditorId = ? WHERE id = ?',
    [title, content, lastEditorId, id]
  );
}

async function deleteNote(id) {
  // Erst alle Collaborators zur Note löschen
  await db.query('DELETE FROM Collaborator WHERE noteId = ?', [id]);
  // Dann die Note selbst löschen
  await db.query('DELETE FROM Note WHERE id = ?', [id]);
}

module.exports = { getAllNotesForUser, getNoteById, createNote, updateNote, deleteNote };
