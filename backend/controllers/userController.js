const User = require('../models/User');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, scores } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    const newUser = new User({
      username,
      email,
      password,
      scores: scores || [0, 0, 0, 0]   
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Delete user by username
const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Forget password
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = 'generated-reset-token';

        // Save the reset token to the user (this is a placeholder, implement your own logic)
        user.resetToken = resetToken;
        await user.save();

        // Send the reset token to the user's email (this is a placeholder, implement your own email sending logic)
        console.log(`Reset token sent to email: ${email}`);

        res.status(200).json({ message: 'Reset token sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        const user = await User.findOne({ resetToken });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update the user's password (this is a placeholder, implement your own password hashing logic)
        user.password = newPassword;
        user.resetToken = undefined; // Clear the reset token
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = { getUsers, createUser, loginUser, deleteUser, forgetPassword, resetPassword };
module.exports = { getUsers, createUser, loginUser, deleteUser };
