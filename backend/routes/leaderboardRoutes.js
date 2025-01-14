const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController'); // Import controller functions
const router = express.Router();



// GET /leaderboard - Get leaderboard with total score
router.get('/leaderboard',getLeaderboard);

module.exports = router;
