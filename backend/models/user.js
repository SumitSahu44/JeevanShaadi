const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileFor: {
        type: String,
        enum: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Friend'],
        required: true
    },

    // Basic Info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: Date, required: true },
    maritalStatus: {
        type: String,
        enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
        required: true
    },
    height: { type: String, required: true }, // Example: "5ft 7in" or "170cm"
    diet: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Other'], default: 'Other' },
    
    // Religion & Community
    religion: { type: String, required: true },
    community: { type: String, required: true },
    subCommunity: { type: String, default: 'Not Particular' },

    // Location
    livingIn: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },

    // Family
    liveWithFamily: { type: Boolean, default: true },
    fatherName: { type: String },
    motherName: { type: String },
    familyMembers: { type: Number, default: 0 },

    // Education & Career
    highestQualification: { type: String, required: true },
    collegeName: { type: String },
    workDetails: { type: String, enum: ['Private', 'Government', 'Business', 'Self Employed', 'Not Working'] },
    workAs: { type: String }, // e.g., "Software Developer", "HR"
    currentCompany: { type: String },
    income: { type: String }, // e.g., "5 LPA", "10k/month"

    // Languages
    languagesKnown: [{ type: String }],

    // Contact & Login
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile Extras
    aboutYourself: { type: String, trim: true },
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