const express = require('express');
const { createNote, getNotes, updateNote, deleteNote, getArchivedNotes, getTrashedNotes, archiveNote, restoreNote, permanentlyDeleteNote } = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.get('/archived', getArchivedNotes);
router.get('/trashed', getTrashedNotes);
router.put('/archive/:id', archiveNote);
router.put('/restore/:id', restoreNote);
router.delete('/permanently/:id', permanentlyDeleteNote);

module.exports = router;
