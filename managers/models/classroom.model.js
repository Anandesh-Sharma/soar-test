const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  classroomName: { type: String, required: true },
  capacity: { type: Number, required: true },
  resources: [{ type: String }],
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Classroom', ClassroomSchema);