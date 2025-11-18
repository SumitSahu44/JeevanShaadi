const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  education: String,
  occupation: String,
  annualIncome: Number,
  familyDetails: {
    fatherName: String,
    motherName: String,
    siblings: Number,
  },
  hobbies: [String],
  interests: [String],
  aboutMe: String,
  photos: [{
    data: Buffer,
    contentType: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);