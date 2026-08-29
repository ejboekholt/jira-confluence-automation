# Weekly Status Report Generator Specification

## 1. Purpose

The Weekly Status Report Generator enables the delivery manager to produce a simple weekly stakeholder email for the Shell SSW team using Jira issue data. The system supports a manual trigger, gathers the relevant Jira issues for the single team, and formats them into a one-page plain-text report without introducing analysis, forecast, or risk-scoring logic.

The project is intentionally narrow: its objective is communication clarity for stakeholders, not operational analytics.

## 2. Scope

### In scope

- Single-team Jira reporting for Shell SSW
- Manual report generation trigger
- Jira-only data retrieval
- One-page stakeholder-ready email draft in plain text
- Fixed Jira project scope: `SHELSSW`
- Flat issue list of Story items with status, assignee, and last update
- Human review via copyable preview

### Out of scope

- Multi-team reporting
- Automated at-risk detection
- Risk scoring or issue severity classification
- Summary metrics or KPI rollups
- Forecasting or trend analysis
- Automated email send workflow
- Database persistence for v1
- Authentication or role-based access
- Portfolio-level reporting
- Any additional business intelligence features beyond the email draft

## 3. Users and Permissions

| Role | Capabilities |
| --- | --- |
| Delivery manager | Trigger report generation, review the plain-text email draft, copy it into email |
| Stakeholder | Receive the weekly status update from the delivery manager |

The system is designed for a single-user internal workflow. There is no login requirement, no multi-user roles, and no authorization model in v1.

## 4. Product Principles

- Jira is the authoritative source for team issue data.
- The system must serve one delivery team only: Shell SSW.
- Reporting output must remain factual and simple.
- The workflow must be manual and human-reviewed.
- No additional calculations, scorecards, or status interpretation are required.
- The report must remain readable in a standard email client without requiring a complex UI.
- The system must show the generated draft directly for copy/paste.

## 5. User Stories and Use Cases

### User Story US-01: Generate a weekly status report

As a delivery manager, I want to manually trigger a weekly report for Shell SSW so that I can prepare a simple status update for stakeholders.

Acceptance criteria:
- The user can click a single button to generate the report.
- The system retrieves Jira issues for the `SHELSSW` project.
- The report is created in a plain-text format suitable for email copy/paste.

### User Story US-02: Review the generated content before sending

As a delivery manager, I want to preview the generated report so that I can confirm it is accurate and suitable for stakeholders.

Acceptance criteria:
- A preview is displayed with the final draft content.
- The user can copy the plain-text body into email.
- The user retains final control over sending the email.

### User Story US-03: Handle Jira failures safely

As a delivery manager, I want failures in Jira access or data retrieval to be explicit so that I am not sent a misleading or incomplete report.

Acceptance criteria:
- Failed Jira calls return a readable error.
- No report is generated from incomplete data.
- The user can see the raw error message.

### Use Case UC-01: Build a weekly report for stakeholders

1. The delivery manager opens the application.
2. The user clicks `Generate weekly report`.
3. The frontend requests the report generation endpoint.
4. The backend fetches Jira issues for `SHELSSW` in the last 7 calendar days.
5. The backend filters for Story issues in `To Do`, `In Progress`, and `Done`.
6. The backend transforms the data into a plain-text email draft.
7. The user reviews the preview and copies it into email.

## 6. API Endpoints

The backend exposes a minimal API focused on report generation. The API is intentionally small and does not include analytics, auth endpoints, or persistence endpoints.

### 6.1 Authentication and headers

- No authentication is required in v1.
- The frontend sends JSON payloads for report generation requests.
- Responses use JSON with a consistent error contract.

### 6.2 Endpoint contract

| Method | Endpoint | Purpose | Request payload | Response |
| --- | --- | --- | --- | --- |
| GET | /api/health | Confirm backend availability | None | `200 OK` with service status |
| POST | /api/reports/generate | Generate a fresh weekly report | None or `{}` | Report object with subject, plain-text body, and issue list |

### 6.3 Request and response details

#### GET /api/health

Returns:

```json
{
  "status": "ok"
}
```

#### POST /api/reports/generate

Request body:

```json
{}
```

Successful response:

```json
{
  "subject": "Weekly Status Report - Shell SSW",
  "teamName": "Shell SSW",
  "generatedAt": "2026-08-29T12:10:00Z",
  "body": "Shell SSW\n\n- SHELSSW-101 | Implement Jira report generator | In Progress | Jane Doe | 2026-08-28\n- SHELSSW-102 | Fix onboarding issue | Done | John Smith | 2026-08-27",
  "issues": [
    {
      "key": "SHELSSW-101",
      "summary": "Implement Jira report generator",
      "status": "In Progress",
      "assignee": "Jane Doe",
      "updatedAt": "2026-08-28T09:00:00Z"
    }
  ]
}
```

Error response:

```json
{
  "status": "error",
  "message": "Jira request failed: ..."
}
```

### 6.4 Backend responsibilities

- The backend is responsible for Jira access and report content assembly.
- The backend must query the `SHELSSW` project only.
- The backend must filter for Story issues in `To Do`, `In Progress`, and `Done`.
- The backend must format the email-ready content in plain text.
- The backend must not add risk labels, summary calculations, or other interpretation.

## 7. UI Screens

The frontend is intentionally simple and focused on a single workflow: trigger generation and review the report.

### Screen UI-01: Weekly report page

Purpose:
- Provide the main entry point for report generation.

Elements:
- Page title: `Weekly Status Report`
- Team name label: `Shell SSW`
- `Generate weekly report` action button
- Plain-text preview area containing the generated email draft
- Error banner for Jira failures

### Screen UI-02: Error state

Purpose:
- Surface Jira access failures clearly.

Elements:
- Simple error message text
- No retry flow beyond re-triggering the button

## 8. Data Model

For v1, there is no persistent database. The application uses a minimal runtime configuration and returns generated report content in memory.

### Runtime configuration

```json
{
  "jiraProjectKey": "SHELSSW",
  "reportWindowDays": 7,
  "statuses": ["To Do", "In Progress", "Done"],
  "issueType": "Story"
}
```

### Report object

```json
{
  "subject": "Weekly Status Report - Shell SSW",
  "teamName": "Shell SSW",
  "generatedAt": "2026-08-29T12:10:00Z",
  "body": "Shell SSW\n\n- SHELSSW-101 | Implement Jira report generator | In Progress | Jane Doe | 2026-08-28",
  "issues": [
    {
      "key": "SHELSSW-101",
      "summary": "Implement Jira report generator",
      "status": "In Progress",
      "assignee": "Jane Doe",
      "updatedAt": "2026-08-28T09:00:00Z"
    }
  ]
}
```

### Data model rules

- No database tables are required for v1.
- The app reads only a very small static config object.
- All report data is derived directly from Jira at runtime.
- There is no persistent report history or audit trail in this version.

## 9. Acceptance Criteria

The feature is considered complete when:

- A user can trigger generation manually from the frontend.
- The system fetches Jira data for the `SHELSSW` project only.
- The report includes Story issues in `To Do`, `In Progress`, and `Done`.
- Closed items are included alongside active items in the same list.
- The report is a one-page plain-text email draft.
- The user can copy the generated content into an email client.
- No risk indicators, summaries, or calculations are produced.
- If Jira access fails, the raw error message is displayed.

## 10. Non-Functional Requirements

- Minimal operational complexity
- Fast generation for a small Jira dataset
- Low maintenance and easy configuration
- Clear separation between Jira fetch and formatting logic
- Manual review before sending to stakeholders
- No login or user management in v1

## 11. Out of Scope for Initial Version

- Automated email sending
- Database persistence
- User authentication
- Multi-team dashboards
- Portfolio reporting
- AI-based issue assessment
- Trend analysis or forecasting
- Summary tables and risk scoring
- Additional integrations beyond Jira
