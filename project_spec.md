# Weekly Status Report Generator - Technical Specification

## 1. Overview

The solution is a lightweight weekly status report generator for the Shell SSW delivery team. It pulls Jira issue data for the project key `SHELSSW`, formats it into a one-page plain-text email draft, and presents it to the delivery manager for copy/paste into email.

The scope is intentionally narrow: this is a manual, read-only reporting workflow for one team only, with no analytics, no risk detection, and no summary calculations.

## 2. Objective

Provide the delivery manager with a quick way to generate a weekly status email for Shell SSW based only on Jira data, without building a dashboard, scoring model, or automated email sending workflow.

## 3. Stakeholder and User

- Primary user: Delivery Manager
- Team covered: Shell SSW
- Jira project code: `SHELSSW`
- Audience: stakeholders receiving the one-page weekly update
- Operating model: manual trigger, human review, then copy into email client

## 4. Scope

### In scope

- Single team only: Shell SSW
- Jira as the only data source
- Manual trigger to generate the report
- One-page email draft in plain text
- Issue list with key, summary, status, assignee, and last update
- Include both active and closed issues for the report window
- Story-only reporting; other issue types are excluded
- Copyable preview for the user

### Out of scope

- Multi-team reporting
- Automated at-risk detection
- Summary calculations or KPI rollups
- Burn-down, velocity, forecast, or trend analysis
- Automated email sending
- Database-backed report history
- Auth or login flow
- Dependency analysis or issue prioritization logic

## 5. Functional Requirements

1. The system shall allow a user to manually trigger report generation.
2. The system shall fetch Jira issues for the `SHELSSW` project only.
3. The system shall include issues in the statuses `To Do`, `In Progress`, and `Done`.
4. The system shall include only Story issues; other issue types are excluded.
5. The system shall include closed items alongside active items in the same list.
6. The system shall not group the items by category; the report is a flat issue list.
7. The system shall extract the fields required for a simple weekly update, including:
   - Jira issue key
   - issue summary
   - current status
   - assignee
   - last updated date
8. The system shall format the data into a one-page email body in plain text.
9. The system shall present the generated output in a preview screen for easy copy/paste.
10. The system shall not add trend analysis, scoring, or risk labels.
11. The system shall not compute totals, percentages, or summary metrics.
12. The system shall return a plain error if Jira access fails.

## 6. Data Requirements

### Source system

- Jira

### Jira scope

The report shall be generated for the Jira project code `SHELSSW` only. The report query is based on a fixed last-7-calendar-days window and includes issues in `To Do`, `In Progress`, and `Done`.

### Required issue fields

- Issue key
- Summary
- Status
- Assignee
- Last updated date

### Data handling rules

- Fetch only the relevant project and statuses.
- Include no additional filters beyond the agreed Sprint/issue-scope rule.
- Keep the report factual and copy-ready for stakeholders.
- Do not apply any additional classification beyond Jira status and ownership.
- No persistent database is required for v1.

## 7. Manual Trigger Workflow

1. The delivery manager opens the report page.
2. The user clicks the `Generate weekly report` button.
3. The system queries Jira for the `SHELSSW` project and the last 7 calendar days.
4. The system filters for Story issues in `To Do`, `In Progress`, and `Done`.
5. The system formats the issue list into a plain-text email draft.
6. The user reviews the generated output in the preview.
7. The user copies the content into their email client and sends it manually.

This flow must be straightforward, repeatable, and free from additional automation.

## 8. Report Format

The output shall be a single-page email with the following structure:

- Subject line: `Weekly Status Report - Shell SSW`
- Team headline: `Shell SSW`
- Issue list with rows containing:
  - issue key
  - summary
  - status
  - assignee
  - last update
- No grouping, no summary block, no risk section

Example:

```text
Subject: Weekly Status Report - Shell SSW

Shell SSW

- SHELSSW-101 | Implement Jira report generator | In Progress | Jane Doe | 2026-08-28
- SHELSSW-102 | Fix onboarding issue | Done | John Smith | 2026-08-27
- SHELSSW-103 | Prepare stakeholder update | To Do | Alex Lee | 2026-08-26
```

The format must remain readable in email clients and should avoid complex layouts.

## 9. Design Constraints

- Very simple implementation
- One team only: Shell SSW
- Jira only as the source of truth
- Manual execution only
- No calculations
- No risk detection
- No summary section
- No automated email sending
- No database required in v1
- No auth requirement in v1
- Minimal configuration, ideally a static project key and report window

## 10. Acceptance Criteria

The feature is considered complete when:

- A user can trigger report generation manually.
- The system fetches Jira data for the `SHELSSW` project only.
- The report includes Story issues in `To Do`, `In Progress`, and `Done`.
- Closed items are included beside active items in the same list.
- The output is a one-page plain-text email draft.
- The report contains only Jira issue information relevant to the weekly update.
- No risk indicators, summaries, or calculations are produced.
- The report is suitable for copying into an email without extra transformation.
- If Jira access fails, the user sees the raw error message.

## 11. Non-Functional Requirements

- Minimal operational complexity
- Fast generation for a small Jira dataset
- Low maintenance and easy configuration
- Clear separation between Jira fetch and formatting logic
- Manual review before sending via email client
- Simple UI without login or multi-user access control

## 12. Out of Scope for Initial Version

- Automated email sending
- Portfolio-level reporting
- Multiple team dashboards
- AI-based issue assessment
- Trend analysis or forecasting
- Summary tables and risk scoring
- Database persistence
- Authentication or user roles
- Additional integrations beyond Jira

## 13. Implementation Guidance (Simple Version)

The initial solution should be implemented as a lightweight application with the following flow:

1. Read the static Jira project code `SHELSSW`.
2. Query Jira for issues updated in the last 7 calendar days.
3. Filter for `Story` issue type and statuses `To Do`, `In Progress`, and `Done`.
4. Extract the required fields.
5. Format the issue list into a plain-text email body.
6. Show the output in a preview for the user to copy into email.

This approach keeps the solution deployment-light, quick to build, and aligned with the stated business requirement.
