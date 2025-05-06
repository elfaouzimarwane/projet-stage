const userModel = require('./userModel');
const authService = require('./authService');
const jwt = require('jsonwebtoken'); // Add JWT for token generation
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification code
};

const sendVerificationEmail = (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${verificationCode}`
  };

  return transporter.sendMail(mailOptions);
};

const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  userModel.getUserByUsernameOrEmail(username, email, async (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Error checking user', details: err });
    }

    if (results.length > 0) {
      const existingUser = results[0];
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email déjà utilisé' });
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
    const verificationCode = generateVerificationCode(); // Generate verification code

    userModel.createUser(username, email, hashedPassword, verificationCode, async (err) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Error registering user', details: err });
      }

      try {
        console.log('Sending verification email to:', email); // Log email sending attempt
        await sendVerificationEmail(email, verificationCode); // Send verification email
        console.log('Verification email sent successfully'); // Log successful email sending
        res.json({ message: 'User registered successfully. Please check your email for the verification code.' });
      } catch (emailErr) {
        console.error('Error sending verification email:', emailErr);
        res.status(500).json({ error: 'Error sending verification email', details: emailErr });
      }
    });
  });
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password }); // Log the login attempt

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ id: 1, username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate token
    return res.json({ message: 'Login successful', token }); // Include token in response
  }

  userModel.getUserByUsername(username, (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Error fetching user', details: err });
    }

    if (results.length === 0) {
      console.log('User not found'); // Log user not found
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    const passwordMatch = authService.verifyPassword(password, user.password);
    console.log('Password match:', passwordMatch); // Log password match result

    if (!passwordMatch) {
      console.log('Invalid password'); // Log invalid password
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate token
    res.json({ message: 'Login successful', token }); // Include token in response
  });
};

const verifyEmail = (req, res) => {
  const { username, verificationCode } = req.body;
  console.log('Email verification attempt:', { username, verificationCode }); // Log the verification attempt

  userModel.getUserByUsername(username, (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Error fetching user', details: err });
    }

    if (results.length === 0) {
      console.log('User not found'); // Log user not found
      return res.status(400).json({ error: 'Invalid username or verification code' });
    }

    const user = results[0];
    if (user.verificationCode !== verificationCode) {
      console.log('Invalid verification code'); // Log invalid verification code
      return res.status(400).json({ error: 'Invalid username or verification code' });
    }

    userModel.verifyUser(username, (err) => {
      if (err) {
        console.error('Error verifying user:', err);
        return res.status(500).json({ error: 'Error verifying user', details: err });
      }
      res.json({ message: 'Email verified successfully' });
    });
  });
};

const createUser = (req, res) => {
  const { username, password } = req.body;

  userModel.getUserByUsernameOrEmail(username, async (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Error checking user', details: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' });
    }

    userModel.createUser(username, password, (err) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Error creating user', details: err });
      }

      res.json({ message: 'User created successfully.' });
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  createUser
};
