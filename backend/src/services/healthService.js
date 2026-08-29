function getHealthStatus() {
  return {
    status: 'ok',
    app: 'shell-ssw-status-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  getHealthStatus,
};
