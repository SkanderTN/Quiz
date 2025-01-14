const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    incorrectAnswers: { type: [String], required: true, validate: (arr) => arr.length === 3 }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
