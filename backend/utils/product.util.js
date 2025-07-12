const generateProductId = (userId, productName) => {
  const timestamp = Date.now(); // UNIX ms timestamp
  const cleanName = productName.trim().toUpperCase().replace(/\s+/g, "_");
  return `${userId}_${cleanName}_${timestamp}`;
};

module.exports = {
  generateProductId
};
