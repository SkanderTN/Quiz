// routes/quizRoutes.js
const express = require('express');
const { getQuizById } = require('../controllers/quizController'); // Import controller functions
const router = express.Router();


// Get Quiz by ID
router.get('/:id', getQuizById);


module.exports = router;
