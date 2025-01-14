const User = require('../models/User'); 

const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find();
        const leaderboard = users.map(user => {
            const totalScore = user.scores.reduce((sum, score) => sum + score, 0); 
            return { 
                username: user.username,
                scores: user.scores,
                totalScore: totalScore
            };
        });

        leaderboard.sort((a, b) => b.totalScore - a.totalScore);   
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {getLeaderboard};
