const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileFor: {
        type: String,
        enum: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'],
        required: true
    },

    // Basic Info
    Name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    dob: { type: Date, required: true },
    maritalStatus: {
        type: String,
        enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
        required: true
    },
    height: { type: String, required: true }, // Example: "5ft 7in" or "170cm"
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

    // Family
    liveWithFamily: { type: Boolean, default: true },
    familyBackground: { type: String },

    // Education & Career
    highestQualification: { type: String, required: true },
    workDetails: { type: String, enum: ['Private', 'Government', 'Business', 'Self Employed', 'Not Working'] },
    income: { type: String }, // e.g., "5 LPA", "10k/month"

    // Languages
    motherTongue: { type: String },

    // Contact & Login
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile Extras
    aboutYourself: { type: String, required: true, trim: true },
    profileImage: {
        data: Buffer,
        contentType: String
    },// store image URL or filename

    // Auth Helpers
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createdAt: { type: Date, default: Date.now }
});

// Fix for OverwriteModelError: Check if model already exists before compiling
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;