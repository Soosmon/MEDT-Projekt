const express = require('express');
const router = express.Router();
const noteModel = require('../models/note');

// GET all notes for a user (by userId query param)
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId erforderlich' });
  try {
    const notes = await noteModel.getAllNotesForUser(userId);
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET note by id
router.get('/:id', async (req, res) => {
  try {
    const note = await noteModel.getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Notiz nicht gefunden' });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create note
const { broadcastNotesChanged } = require('../websocket/server');
router.post('/', async (req, res) => {
  try {
    const note = await noteModel.createNote(req.body);
    broadcastNotesChanged();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    await noteModel.updateNote(req.params.id, req.body);
    broadcastNotesChanged();
    res.status(200).json({ message: 'Notiz aktualisiert' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    await noteModel.deleteNote(req.params.id);
    broadcastNotesChanged();
    res.status(200).json({ message: 'Notiz gelöscht' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
