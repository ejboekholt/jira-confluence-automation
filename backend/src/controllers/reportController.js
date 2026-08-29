const { fetchProjectIssues } = require('../services/jiraService');
const { buildPlainTextReport } = require('../services/reportFormatter');

async function generateReport(req, res) {
  try {
    const jiraData = await fetchProjectIssues();
    const report = buildPlainTextReport(jiraData.issues, 'SHELLSSW');

    res.status(200).json({
      subject: report.subject,
      team: report.team,
      generatedAt: new Date().toISOString(),
      issueCount: jiraData.issues.length,
      issues: report.issues,
      body: report.body,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  generateReport,
};
