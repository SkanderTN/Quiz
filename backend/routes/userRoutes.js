const express = require('express');
const { getUsers, createUser, loginUser, deleteUser } = require('../controllers/userController');
const { forgetPassword, resetPassword } = require('../controllers/userController');
const router = express.Router();

// Get all users
router.get('/', getUsers);

// Register (Create a new user)
router.post('/register', createUser);

// Login (Authenticate user)
router.post('/login', loginUser);

// Delete user by name
router.delete('/:username', deleteUser);

// Forget password
router.post('/forget-password', forgetPassword);

// Reset password
router.post('/reset-password', resetPassword);



module.exports = router;
