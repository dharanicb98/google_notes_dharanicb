const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Label', labelSchema);
