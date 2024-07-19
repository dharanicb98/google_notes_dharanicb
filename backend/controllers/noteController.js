const Note = require('../models/noteModel');

exports.createNote = async (req, res) => {
    const { title, content, tags, backgroundColor } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const note = new Note({
            userId: req.userId,
            title,
            content,
            tags: tags || [],
            backgroundColor: backgroundColor || '#ffffff'
        });
        await note.save();
        res.status(201).json({ note });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getNotes = async (req, res) => {
    const notes = await Note.find({ userId: req.userId, trashed: false, archived: false });
    res.status(200).json({ notes });
};

exports.getNoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findOne({ _id: id, userId: req.userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ note });
    } catch (error) {
        console.error('Error fetching note by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, backgroundColor } = req.body;
    const note = await Note.findByIdAndUpdate(id, { title, content, tags, backgroundColor, updatedAt: Date.now() }, { new: true });
    res.status(200).json({ note });
};

exports.deleteNote = async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndUpdate(id, { trashed: true });
    res.status(200).json({ message: 'Note trashed' });
};

exports.getArchivedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId, archived: true });
        res.status(200).json({ notes });
    } catch (error) {
        console.error('Error fetching archived notes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTrashedNotes = async (req, res) => {
    const notes = await Note.find({ userId: req.userId, trashed: true });
    res.status(200).json({ notes });
};

exports.archiveNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByIdAndUpdate(id, { archived: true, trashed: false }, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ note });
    } catch (error) {
        console.error('Error archiving note:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unarchiveNote = async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, { archived: false });
    res.status(200).json({ note });
};

exports.restoreNote = async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, { trashed: false });
    res.status(200).json({ note });
};

exports.permanentlyDeleteNote = async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note permanently deleted' });
};
