const bcrypt = require('bcrypt');

const verifyPassword = (inputPassword, storedPassword) => {
  console.log('Verifying password:', { inputPassword, storedPassword }); // Log passwords being compared
  return inputPassword === storedPassword; // Direct comparison for plain text passwords
};

module.exports = {
  verifyPassword
};
