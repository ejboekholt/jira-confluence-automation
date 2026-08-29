function formatDateForDisplay(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
}

function formatIssueLine(issue) {
  const key = issue?.key || 'Unknown';
  const summary = issue?.summary || 'No summary available';
  const status = issue?.status || 'Unknown';
  const assignee = issue?.assignee || 'Unassigned';
  const lastUpdated = formatDateForDisplay(issue?.lastUpdated || issue?.updated || '');

  return `- ${key} | ${summary} | ${status} | ${assignee} | ${lastUpdated}`;
}

function buildPlainTextReport(issues = [], teamName = 'SHELLSSW') {
  const issueLines = issues.length > 0
    ? issues.map(formatIssueLine).join('\n')
    : '- No issues found for the selected report window.';

  const subject = `Weekly status report - ${teamName}`;
  const body = [
    `Subject: ${subject}`,
    '',
    `Team: ${teamName}`,
    '',
    issueLines,
  ].join('\n');

  return {
    subject,
    team: teamName,
    body,
    issues: issues.map((issue) => ({
      key: issue?.key || '',
      summary: issue?.summary || '',
      status: issue?.status || '',
      assignee: issue?.assignee || '',
      lastUpdated: issue?.lastUpdated || issue?.updated || '',
    })),
  };
}

module.exports = {
  buildPlainTextReport,
  formatIssueLine,
  formatDateForDisplay,
};
