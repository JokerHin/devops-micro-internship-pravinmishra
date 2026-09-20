// Production Config Sample - Cleaned
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || "";

function initApp() {
  return Boolean(AWS_ACCESS_KEY);
}

module.exports = { initApp };
