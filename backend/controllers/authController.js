const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, fullName, email, password } = req.body;
    
    // Validate required fields
    if (!fullName || !username || !email || !password) {
      console.log('Missing required fields:', { fullName, username, email, password: !!password });
      return res.status(400).json({ 
        msg: 'Please provide all required fields',
        missing: {
          fullName: !fullName,
          username: !username,
          email: !email,
          password: !password
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ msg: 'Please provide a valid email address' });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    console.log('Checking for existing user with email or username:', { email, username });
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log('User already exists:', { 
        existingEmail: user.email === email,
        existingUsername: user.username === username 
      });
      if (user.email === email) {
        return res.status(400).json({ msg: 'Email already registered' });
      }
      return res.status(400).json({ msg: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    console.log('Creating new user with data:', { 
      fullName, 
      username, 
      email, 
      hasPassword: !!hashedPassword 
    });
    user = new User({ 
      fullName,
      username,
      email, 
      password: hashedPassword 
    });

    await user.save();
    console.log('User saved successfully:', { userId: user._id });
    
    // Create JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        fullName: user.fullName,
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Registration error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });
    res.status(500).json({ 
      msg: 'Server error', 
      error: err.message,
      code: err.code 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    // Create JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Return token and user
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    // req.user is set by the auth middleware to the userId
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 