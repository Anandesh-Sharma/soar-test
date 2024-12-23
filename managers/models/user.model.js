const mongoose = require('mongoose');
const { SUPERADMIN, SCHOOL_ADMIN } = require('../../libs/utils');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: [SUPERADMIN, SCHOOL_ADMIN], 
    required: true 
  },
  // If the user is a school admin, they may be associated with a specific school
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);