require('dotenv').config();

module.exports = {
  PORT: Number(process.env.PORT || 3001),
  JIRA_BASE_URL: process.env.JIRA_BASE_URL || '',
  JIRA_EMAIL: process.env.JIRA_EMAIL || '',
  JIRA_API_TOKEN: process.env.JIRA_API_TOKEN || '',
};
