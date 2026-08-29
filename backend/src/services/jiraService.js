function getJiraConfig() {
  return {
    baseUrl: process.env.JIRA_BASE_URL || '',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
  };
}

function buildProjectJql() {
  return 'project = "SHELSSW" AND updated >= -7d AND issuetype = Story AND status in ("To Do", "In Progress", "Done") ORDER BY updated DESC';
}

function normalizeIssue(issue) {
  return {
    key: issue?.key || '',
    summary: issue?.fields?.summary || '',
    status: issue?.fields?.status?.name || '',
    assignee: issue?.fields?.assignee?.displayName || issue?.fields?.assignee?.name || '',
    lastUpdated: issue?.fields?.updated || '',
  };
}

async function fetchProjectIssues() {
  const { baseUrl, email, apiToken } = getJiraConfig();

  if (!baseUrl) {
    throw new Error('JIRA_BASE_URL is required');
  }

  if (!email) {
    throw new Error('JIRA_EMAIL is required');
  }

  if (!apiToken) {
    throw new Error('JIRA_API_TOKEN is required');
  }

  const jiraUrl = new URL('/rest/api/2/search', baseUrl);
  jiraUrl.searchParams.set('jql', buildProjectJql());
  jiraUrl.searchParams.set('maxResults', '100');
  jiraUrl.searchParams.set('fields', 'key,summary,status,assignee,updated,issuetype');

  const response = await fetch(jiraUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    const rawText = await response.text();
    throw new Error(rawText || `${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const issues = (payload.issues || []).map(normalizeIssue);

  return {
    project: 'SHELSSW',
    jql: buildProjectJql(),
    total: payload.total || issues.length,
    issues,
  };
}

module.exports = {
  buildProjectJql,
  normalizeIssue,
  fetchProjectIssues,
};
