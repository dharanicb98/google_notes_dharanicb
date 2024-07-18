const Note = require('../models/noteModel');

exports.createNote = async (req, res) => {
    const { title, content, tags, backgroundColor } = req.body;
    const note = new Note({
        userId: req.userId,
        title,
        content,
        tags,
        backgroundColor
    });
    await note.save();
    res.status(201).json({ note });
};

exports.getNotes = async (req, res) => {
    const notes = await Note.find({ userId: req.userId, trashed: false, archived: false });
    res.status(200).json({ notes });
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
    const notes = await Note.find({ userId: req.userId, archived: true });
    res.status(200).json({ notes });
};

exports.getTrashedNotes = async (req, res) => {
    const notes = await Note.find({ userId: req.userId, trashed: true });
    res.status(200).json({ notes });
};

exports.archiveNote = async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, { archived: true, trashed: false });
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
