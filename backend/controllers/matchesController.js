const User = require('../models/user');

function getAge(dob) {
    const diff = new Date() - new Date(dob);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function calculateMatchScore(user, profile) {
    let score = 0;

    const ageDiff = Math.abs(getAge(user.dob) - getAge(profile.dob));
    if (ageDiff <= 5) score += 15;

    if (user.height === profile.height) score += 5;
    if (user.religion === profile.religion) score += 20;
    if (user.community === profile.community) score += 15;
    if (user.subCommunity === profile.subCommunity) score += 10;
    if (user.maritalStatus === profile.maritalStatus) score += 10;
    if (user.city === profile.city) score += 5;
    if (user.state === profile.state) score += 5;
    if (user.diet === profile.diet) score += 5;

    const commonLanguages = profile.languagesKnown.filter(lang => user.languagesKnown.includes(lang));
    score += commonLanguages.length * 2;

    return score;
}

// Controller
const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        let genderFilter = '';
        if (currentUser.gender === 'Male') genderFilter = 'Female';
        else if (currentUser.gender === 'Female') genderFilter = 'Male';

        const allProfiles = await User.find({
            _id: { $ne: currentUser._id },
            ...(genderFilter && { gender: genderFilter })
        });

        // Step 1: Calculate all scores
        const scoredProfiles = allProfiles.map(profile => ({
            profile,
            score: calculateMatchScore(currentUser, profile)
        }));

        // Step 2: Find maximum score
        const maxScore = Math.max(...scoredProfiles.map(item => item.score)) || 1;

        // Step 3: Calculate percentage relative to maxScore
        const withPercentage = scoredProfiles.map(item => ({
            ...item.profile._doc,
            score: item.score,
            percentage: Math.round((item.score / maxScore) * 100)
        }));

        // Step 4: Sort descending
        withPercentage.sort((a, b) => b.score - a.score);

        res.json(withPercentage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMatches };
