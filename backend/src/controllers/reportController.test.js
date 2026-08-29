const test = require('node:test');
const assert = require('node:assert/strict');
const { generateReport } = require('./reportController');

function createResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

test('generateReport returns generated report when Jira succeeds', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: async () => JSON.stringify({
      total: 1,
      issues: [{
        key: 'SHELSSW-1',
        fields: {
          summary: 'Test issue',
          status: { name: 'In Progress' },
          assignee: { displayName: 'Alex' },
          updated: '2026-08-29T12:00:00.000Z',
        },
      }],
    }),
    json: async () => ({
      total: 1,
      issues: [{
        key: 'SHELSSW-1',
        fields: {
          summary: 'Test issue',
          status: { name: 'In Progress' },
          assignee: { displayName: 'Alex' },
          updated: '2026-08-29T12:00:00.000Z',
        },
      }],
    }),
  });

  process.env.JIRA_BASE_URL = 'https://jira.example.com';
  process.env.JIRA_EMAIL = 'test@example.com';
  process.env.JIRA_API_TOKEN = 'abc';

  const res = createResponse();
  await generateReport({}, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.subject, 'Weekly status report - SHELLSSW');
  assert.match(res.payload.body, /SHELSSW-1/);
  assert.equal(res.payload.issueCount, 1);

  global.fetch = originalFetch;
});

test('generateReport returns raw system error if Jira fails', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    text: async () => 'Authentication failed',
  });

  process.env.JIRA_BASE_URL = 'https://jira.example.com';
  process.env.JIRA_EMAIL = 'test@example.com';
  process.env.JIRA_API_TOKEN = 'bad';

  const res = createResponse();
  await generateReport({}, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.payload.error, 'Authentication failed');

  global.fetch = originalFetch;
});
