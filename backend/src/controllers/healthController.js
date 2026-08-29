const { getHealthStatus } = require('../services/healthService');

function getHealth(req, res) {
  const health = getHealthStatus();
  res.status(200).json(health);
}

module.exports = {
  getHealth,
};
