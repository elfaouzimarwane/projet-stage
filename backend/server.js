const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
require('dotenv').config({ path: './backend/.env' }); // Ensure the correct path to the .env file
const routes = require('./routes'); // Import routes
const { verifyToken, isAdmin } = require('./authMiddleware'); // Import middleware

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Use CORS middleware with specific origin

// Use routes
app.use(routes);

// Error handling middleware
app.use((err, req, res) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
