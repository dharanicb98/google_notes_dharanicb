const express = require('express');
const {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
    unarchiveNote,
    getNoteById,
    getArchivedNotes,
    getTrashedNotes,
    archiveNote,
    restoreNote,
    permanentlyDeleteNote
} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// Base routes for notes
router.post('/', createNote);
router.get('/', getNotes);

// Routes for specific note categories
router.get('/archived', getArchivedNotes);
router.get('/trashed', getTrashedNotes);

// Routes for individual note operations
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.put('/archive/:id', archiveNote);
router.put('/unarchive/:id', unarchiveNote);
router.put('/restore/:id', restoreNote);
router.delete('/permanently/:id', permanentlyDeleteNote);

module.exports = router;
