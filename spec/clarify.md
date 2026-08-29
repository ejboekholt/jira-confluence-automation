# Weekly Status Report Generator Clarification and Decisions

## Review scope

This clarification document captures the decisions that define the v1 scope for the Weekly Status Report Generator. These decisions are now treated as the source of truth for implementation.

## Resolved decisions

### G-01: Reporting period

Decision: The report covers the last 7 calendar days.

### G-02: Jira project and status scope

Decision: The Jira project key is `SHELSSW`.
The report includes issues in the following statuses:
- `To Do`
- `In Progress`
- `Done`

### G-03: Output format

Decision: The output is a plain-text email draft, one page in length, copyable from the preview, with no automated send in v1.

### G-04: Issue content and format

Decision: The report includes closed items alongside active items in the same flat list. It does not group issues.
Only Story issues are included.
The report contains:
- issue key
- summary
- status
- assignee
- last update

The report includes no summary block or group headings.

### G-05: Jira filter scope

Decision: The report includes all issues in the `SHELSSW` project that match the agreed status and Story-only rules. There are no additional filters.

### G-06: User model

Decision: The app is a single-user tool for the delivery manager only.

### G-07: Database requirement

Decision: No database is required in v1.

### G-08: Authentication requirement

Decision: No auth is required in v1. The app is an internal tool accessed by URL only.

### G-09: Trigger behavior

Decision: The report is generated immediately when the user clicks the button. The result is displayed in a preview so the user can copy it into email.

### G-10: Error handling

Decision: If the system fails to fetch Jira data, it displays the plain error returned by the system.

### C-01: Configuration style

Decision: Keep the configuration static and minimal.

### C-02: Product role model

Decision: The product remains a single delivery-manager workflow.

### C-03: Database strategy

Decision: Do not add a database for the initial implementation.

## Approved v1 scope

The v1 version must remain deliberately small and factual:

- one team only
- Jira-only source
- manual trigger only
- plain-text report preview
- no automation
- no scoring
- no risk detection
- no summary metrics
- no auth
- no database

## Implementation note

Anything beyond this scope should be treated as a future enhancement, not part of the first release.
