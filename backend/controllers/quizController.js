// controllers/quizController.js
const Quiz = require('../models/Quiz');



// Get Quiz by ID
const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findOne({ id: parseInt(id) }); // Ensure ID is treated as a number

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getQuizzes, addQuiz };
