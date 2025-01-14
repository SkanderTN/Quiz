const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');


// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Use CORS middleware here
app.use(bodyParser.json());

// Sample User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    resetToken: { type: String, select: false },
    resetTokenExpiration: { type: Date, select: false },
    scores: {
        type: [Number],
        default: [0, 0, 0, 0]
    }
}, { versionKey: false });



const User = mongoose.model('User', UserSchema);




// Routes

// GET /getUsers
app.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// POST /addUser - Add a new user
app.post('/addUser', async (req, res) => {
    try {
        const { username, email, password, scores } = req.body;

        // Ensure required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email, and password are required' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new user with the hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Save the hashed password
            scores: scores || [0, 0, 0, 0] // Default to [0, 0, 0, 0] if not provided
        });

        // Save the user to the database
        await newUser.save();

        // Return the created user
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// POST /login - Login with hashed password comparison
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




// DELETE /deleteUserByusername/:username - Delete a user by username
app.delete('/deleteUserByusername/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const deletedUser = await User.findOneAndDelete({ username: username });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// POST /forgotpassword - Request password reset
app.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email' });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

        // Save the reset token and expiration
        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        res.status(200).json({ 
            message: 'Password reset token generated successfully',
            token: resetToken 
        });

    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST /resetpassword - Reset password
app.post('/resetpassword', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Please provide both token and new password' });
        }

        const user = await User.findOne({ 
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() } // Check if token hasn't expired
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password before saving it
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(newPassword, salt); // Hash the new password

        // Update the user's password
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        
        await user.save();
        
        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
});










// Sample Quiz Schema
const QuizSchema = new mongoose.Schema({
    question: String,
    correctAnswer: String,
    incorrectAnswers: [String] // Array of 3 incorrect answers
}, { versionKey: false });

const Quiz = mongoose.model('Quiz', QuizSchema);



// GET /getQuizById/:id - Fetch a quiz by its ID
app.get('/getQuizById/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the quiz by ID
        const quiz = await Quiz.findOne({ id: parseInt(id) });

        // If no quiz is found, return a 404 error
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Return the found quiz
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});







// GET /leaderboard - Get leaderboard with total score
app.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users

        // Calculate total score for each user
        const leaderboard = users.map(user => {
            const totalScore = user.scores.reduce((sum, score) => sum + score, 0);
            return { 
                username: user.username,
                scores: user.scores,
                totalScore: totalScore
            };
        });

        // Sort leaderboard by totalScore in descending order
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        // Return the sorted leaderboard
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});










// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
