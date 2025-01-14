const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FullName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Scores: { type: [Number], default: [0, 0, 0, 0] },
});

module.exports = mongoose.model('User', userSchema);
