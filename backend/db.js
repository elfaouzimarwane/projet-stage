const mysql = require('mysql2');
require('dotenv').config({ path: './backend/.env' }); // Ensure the correct path to the .env file

// Check if the database exists and create it if it doesn't
const initializeDatabase = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
    if (err) {
      console.error('Error creating database:', err);
    } else {
      console.log('Database created or already exists.');
    }
    connection.end();
  });
};

initializeDatabase();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

module.exports = db;
