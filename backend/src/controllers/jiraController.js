const { fetchProjectIssues } = require('../services/jiraService');

async function getProjectIssues(req, res) {
  try {
    const issues = await fetchProjectIssues();
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getProjectIssues,
};
