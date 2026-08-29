const test = require('node:test');
const assert = require('node:assert/strict');
const { buildProjectJql, fetchProjectIssues, normalizeIssue, normalizeJiraBaseUrl } = require('./jiraService');

const originalFetch = global.fetch;

function mockFetch(jsonBody, ok = true, status = 200) {
  global.fetch = async () => ({
    ok,
    status,
    statusText: ok ? 'OK' : 'Bad Request',
    text: async () => ok ? JSON.stringify(jsonBody) : JSON.stringify({ errorMessages: ['Bad request'] }),
    json: async () => jsonBody,
  });
}

test('buildProjectJql uses the required Shell SSW filters', () => {
  const jql = buildProjectJql();

  assert.match(jql, /project = "SHELSSW"/i);
  assert.match(jql, /updated >= -7d/i);
  assert.match(jql, /issuetype = Story/i);
  assert.match(jql, /status in \("To Do", "In Progress", "Done"\)/i);
});

test('normalizeIssue maps Jira fields to the report model', () => {
  const normalized = normalizeIssue({
    key: 'SHELSSW-42',
    fields: {
      summary: 'Build status page',
      status: { name: 'In Progress' },
      assignee: { displayName: 'Jane Doe' },
      updated: '2026-08-01T10:00:00.000Z',
    },
  });

  assert.deepEqual(normalized, {
    key: 'SHELSSW-42',
    summary: 'Build status page',
    status: 'In Progress',
    assignee: 'Jane Doe',
    lastUpdated: '2026-08-01T10:00:00.000Z',
  });
});

test('normalizeJiraBaseUrl strips board URLs to the Jira instance origin', () => {
  assert.equal(
    normalizeJiraBaseUrl('https://jiraeu.epam.com/secure/RapidBoard.jspa?rapidView=323051&projectKey=SHELSSW&quickFilter=1142612#'),
    'https://jiraeu.epam.com'
  );
  assert.equal(normalizeJiraBaseUrl('https://jiraeu.epam.com'), 'https://jiraeu.epam.com');
});

test('fetchProjectIssues calls Jira with the required project and filter', async () => {
  process.env.JIRA_BASE_URL = 'https://jira.example.com';
  process.env.JIRA_EMAIL = 'test@example.com';
  process.env.JIRA_API_TOKEN = 'token';

  mockFetch({
    total: 1,
    issues: [{
      key: 'SHELSSW-14',
      fields: {
        summary: 'Prepare weekly report',
        status: { name: 'Done' },
        assignee: { displayName: 'Sam' },
        updated: '2026-08-28T09:30:00.000Z',
      },
    }],
  });

  const result = await fetchProjectIssues();

  assert.equal(result.project, 'SHELSSW');
  assert.equal(result.total, 1);
  assert.equal(result.issues[0].key, 'SHELSSW-14');
  assert.equal(result.issues[0].status, 'Done');
  assert.ok(result.jql.includes('SHELSSW'));
  assert.ok(result.jql.includes('-7d'));

  global.fetch = originalFetch;
});
