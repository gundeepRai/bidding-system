const Hashids = require('hashids');
require('dotenv').config();

const hashids = new Hashids(process.env.HASHID_SALT || "default_salt", 10); // 10-char minimum

/**
 * Generate a custom user ID from email.
 * @param {string} email
 * @returns {string} e.g., USER_4xZk23AbC9
 */
const generateUserId = (email) => {
  const hex = Buffer.from(email.trim().toLowerCase()).toString('hex');  // Convert email to hex
  const hash = hashids.encodeHex(hex);                                  // Encode to short hash
  return `USER_${hash}`;
};

module.exports = {
  generateUserId
};
