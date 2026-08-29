const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPlainTextReport, formatIssueLine } = require('./reportFormatter');

test('formatIssueLine includes the required Jira fields in plain text', () => {
  const line = formatIssueLine({
    key: 'SHELSSW-14',
    summary: 'Prepare weekly report',
    status: 'Done',
    assignee: 'Sam',
    lastUpdated: '2026-08-28T09:30:00.000Z',
  });

  assert.match(line, /SHELSSW-14/);
  assert.match(line, /Prepare weekly report/);
  assert.match(line, /Done/);
  assert.match(line, /Sam/);
  assert.match(line, /2026-08-28/);
});

test('buildPlainTextReport creates a one-page plain text draft with no summary block', () => {
  const report = buildPlainTextReport([
    {
      key: 'SHELSSW-14',
      summary: 'Prepare weekly report',
      status: 'Done',
      assignee: 'Sam',
      lastUpdated: '2026-08-28T09:30:00.000Z',
    },
    {
      key: 'SHELSSW-15',
      summary: 'Prepare demo notes',
      status: 'In Progress',
      assignee: 'Alex',
      lastUpdated: '2026-08-29T11:00:00.000Z',
    },
  ], 'SHELLSSW');

  assert.equal(report.subject, 'Weekly status report - SHELLSSW');
  assert.match(report.body, /Subject: Weekly status report - SHELLSSW/);
  assert.match(report.body, /Team: SHELLSSW/);
  assert.match(report.body, /SHELSSW-14/);
  assert.match(report.body, /SHELSSW-15/);
  assert.doesNotMatch(report.body, /Risk|Summary|Overall/);
});
