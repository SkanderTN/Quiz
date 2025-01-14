const User = require('../models/User'); // Adjust the path as needed

// Function to get the leaderboard
const getLeaderboard = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Calculate total score for each user
        const leaderboard = users.map(user => {
            const totalScore = user.scores.reduce((sum, score) => sum + score, 0); // Calculate total score
            return { 
                username: user.username,
                scores: user.scores,
                totalScore: totalScore
            };
        });

        // Sort the leaderboard by total score in descending order
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        // Send the sorted leaderboard as the response
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {getLeaderboard};
