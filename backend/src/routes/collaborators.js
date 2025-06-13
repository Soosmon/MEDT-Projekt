const express = require('express');
const router = express.Router();
const collabModel = require('../models/collaborator');

// GET collaborators for a note
router.get('/:noteId', async (req, res) => {
  try {
    const collabs = await collabModel.getCollaboratorsByNote(req.params.noteId);
    res.status(200).json(collabs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add collaborator
router.post('/', async (req, res) => {
  try {
    const collab = await collabModel.addCollaborator(req.body);
    res.status(201).json(collab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE collaborator
router.delete('/:id', async (req, res) => {
  try {
    await collabModel.removeCollaborator(req.params.id);
    res.status(200).json({ message: 'Collaborator entfernt' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
