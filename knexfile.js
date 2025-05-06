require('dotenv').config({ path: './backend/.env' });

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'visiteurdb',
    },
    migrations: {
      directory: './backend/migrations',
    },
  },
};