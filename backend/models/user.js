// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {                     // NEW
        type: String,
        unique: true,
        required: true
    },
    profileFor: {
        type: String,
        enum: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'],
        required: true
    },

    // Basic Info
    Name: { type: String,  trim: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    dob: { type: Date, required: true },
    maritalStatus: {
        type: String,
        enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
        required: true
    },
    height: { type: String, required: true },
    weight: { type: String },
    diet: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Other'], default: 'Other' },

    // Religion & Community
    religion: { type: String, required: true },
    community: { type: String, required: true },
    subCommunity: { type: String },
    noCasteBar: { type: Boolean, default: false },

    // Location
    livingIn: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },

    // Family (NEW FIELDS)
    liveWithFamily: { type: Boolean, default: true },
    familyBackground: { type: String },
    motherOccupation: { type: String },               // dropdown
    fatherOccupation: { type: String },               // dropdown
    siblings: { type: String },                       // free text
    maritalStatusFamily: {                            // renamed to avoid clash with personal maritalStatus
        type: String,
        enum: ['Married', 'Unmarried']
    },

    // Education & Career
    highestQualification: { type: String, required: true },
    workDetails: { type: String, enum: ['Private', 'Government', 'Business', 'Self Employed', 'Not Working'] },
    income: { type: String },

    // Languages
    motherTongue: { type: String },
    // Contact & Login
    email: { type: String,  unique: true, lowercase: true },
    mobile: { type: String,  unique: true },
    password: { type: String, required: true },
// Add these to your userSchema
isOnline: { type: Boolean, default: false },
chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatChat' }] , // Ref to new Chat model
    // Profile Extras
    aboutYourself: { type: String,  trim: true },
    profileImage: {
        data: Buffer,
        contentType: String
    },

    // Auth Helpers
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createdAt: { type: Date, default: Date.now }
});

// Ensure model is compiled only once
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;