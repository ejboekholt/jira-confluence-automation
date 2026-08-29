# Weekly Status Report Generator Specification

## 1. Purpose

The Weekly Status Report Generator enables a delivery manager to produce a simple weekly stakeholder email for the Shell SSW team using Jira issue data. The system supports a manual trigger, gathers the relevant Jira issues for one team, and formats them into a one-page, email-ready report without introducing analysis, forecast, or risk-scoring logic.

The project is intentionally narrow: its objective is communication clarity for stakeholders, not operational analytics.

## 2. Scope

### In scope

- Single-team Jira reporting for Shell SSW
- Manual report generation trigger
- Jira-only data retrieval
- One-page stakeholder-ready email output
- Team-specific Jira project, board, or JQL configuration
- Basic issue presentation using Jira summary, status, assignee, and update context
- Human review before email distribution

### Out of scope

- Multi-team reporting
- Automated at-risk detection
- Risk scoring or issue severity classification
- Summary metrics or KPI rollups
- Forecasting or trend analysis
- Automated email send workflow
- Portfolio-level reporting
- Any additional business intelligence features beyond the email draft

## 3. Users and Permissions

| Role | Capabilities |
| --- | --- |
| Delivery manager | Trigger report generation, review Jira-based report content, send or share the final email |
| Shell SSW team lead | Review the generated weekly report and confirm team context |
| Stakeholder | Receive the emailed weekly status update |
| Administrator | Configure the Jira project or filter used for Shell SSW report generation |

The system is designed for a small internal operating model. Role checks are minimal and focused on access to the correct Jira project and report generation settings.

## 4. Product Principles

- Jira is the authoritative source for team issue data.
- The system must serve one delivery team only: Shell SSW.
- Reporting output must remain factual and simple.
- The workflow must be manual and human-reviewed.
- No additional calculations, scorecards, or status interpretation are required.
- The report must remain readable in a standard email client without requiring a complex UI.

## 5. User Stories and Use Cases

### User Story US-01: Generate a weekly status report

As a delivery manager, I want to manually trigger a weekly report for Shell SSW so that I can prepare a simple status update for stakeholders.

Acceptance criteria:
- The user can click a single action to generate the report.
- The system retrieves the Jira issues for the configured Shell SSW context.
- The report is created in a format suitable for email copy/paste.

### User Story US-02: Review the generated content before sending

As a delivery manager, I want to preview the generated report before sending it so that I can confirm it is accurate and suitable for stakeholders.

Acceptance criteria:
- A preview is displayed with the final draft content.
- The user can copy or export the plain text body.
- The user retains final control over sending the email.

### User Story US-03: Configure the team-specific Jira scope

As an administrator, I want to configure the Jira project or filter representing Shell SSW so that only the correct team’s work appears in the report.

Acceptance criteria:
- The Jira target is stored as configuration.
- The report generation logic uses only the configured issue set.
- Invalid or missing configuration is surfaced as a clear error.

### User Story US-04: Handle Jira failures safely

As a delivery manager, I want failures in Jira access or data retrieval to be explicit so that I am not sent a misleading or incomplete report.

Acceptance criteria:
- Failed Jira calls return a readable error.
- No report is generated from incomplete data.
- The user can retry once the issue is corrected.

### Use Case UC-01: Build a weekly report for stakeholders

1. The user opens the application.
2. The user clicks “Generate weekly report”.
3. The frontend requests the report generation endpoint.
4. The backend fetches Jira issues for the configured Shell SSW scope.
5. The backend transforms the data into a plain text or Markdown email body.
6. The user reviews the preview.
7. The user copies the content into email or shares it with stakeholders.

### Use Case UC-02: Change Jira team context

1. The administrator opens settings.
2. The administrator updates the Jira project, board, or JQL used for Shell SSW.
3. The system validates the configuration.
4. The new configuration is stored and used for future report generation.

## 6. API Endpoints

The backend exposes a minimal API focused on report generation and configuration. The API is intentionally small and does not include analytics or automated scheduling endpoints.

### 6.1 Authentication and headers

- All endpoints are protected by standard backend session or token handling as required by the deployment environment.
- The frontend sends JSON payloads for write operations.
- Responses use JSON with a consistent status contract.

### 6.2 Endpoint contract

| Method | Endpoint | Purpose | Request payload | Response |
| --- | --- | --- | --- | --- |
| GET | /api/health | Confirm backend availability | None | `200 OK` with service status |
| GET | /api/config/team | Return saved Shell SSW Jira configuration | None | Team config including project, board, or JQL |
| PUT | /api/config/team | Update the Shell SSW Jira configuration | `{ teamName, jiraProjectKey, jiraBoardId, jiraJql }` | Updated config object or validation error |
| POST | /api/reports/generate | Generate a fresh weekly report | `{ teamId?: string, jiraContext?: object }` | Report object with status, preview content, and metadata |
| GET | /api/reports/latest | Fetch the most recent generated report | None | Latest report draft and timestamps |
| GET | /api/reports/:id | Fetch a specific generated report | None | Saved report content and metadata |

### 6.3 Request and response details

#### GET /api/config/team

Returns:

```json
{
  "teamName": "Shell SSW",
  "jiraProjectKey": "SSW",
  "jiraBoardId": "123",
  "jiraJql": "project = SSW AND sprint in openSprints()",
  "updatedAt": "2026-08-29T12:00:00Z"
}
```

#### PUT /api/config/team

Request body:

```json
{
  "teamName": "Shell SSW",
  "jiraProjectKey": "SSW",
  "jiraBoardId": "123",
  "jiraJql": "project = SSW AND sprint in openSprints()"
}
```

Validation rules:
- Exactly one Jira scoping method is required: project key, board ID, or JQL.
- The project or JQL must represent the Shell SSW team only.
- Empty or invalid values must return `400 Bad Request`.

#### POST /api/reports/generate

Request body:

```json
{
  "teamId": "shell-ssw"
}
```

Successful response:

```json
{
  "id": "rpt_123",
  "status": "generated",
  "generatedAt": "2026-08-29T12:10:00Z",
  "subject": "Weekly Status Report - Shell SSW",
  "body": "Hello stakeholders,\n\nHere is this week\'s update...",
  "issues": [
    {
      "key": "SSW-101",
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
  "message": "Unable to retrieve Jira issues for the configured Shell SSW scope."
}
```

### 6.4 Backend responsibilities

- The backend is responsible for Jira access and report content assembly.
- The backend must validate configuration before making Jira calls.
- The backend must format and return the email-ready content in plain text or Markdown.
- The backend must not add risk labels, summary calculations, or other interpretation.

## 7. UI Screens

The frontend is intentionally simple and focused on a single workflow: configure the scope, trigger generation, and review the report.

### Screen UI-01: Weekly report dashboard

Purpose:
- Provide the main entry point for report generation.

Elements:
- Page title: “Weekly Status Report”
- Team name label: “Shell SSW”
- “Generate weekly report” action button
- Status indicator for last report time
- Link or button to open previous report preview
- Error banner for Jira or config problems

### Screen UI-02: Report preview

Purpose:
- Display the generated email content before it is sent.

Elements:
- Subject line
- Email body preview in plain text or Markdown render
- List of Jira issues included in the report
- Copy to clipboard button
- Return to dashboard button

### Screen UI-03: Team configuration screen

Purpose:
- Maintain the Jira context used for the report.

Elements:
- Team name field
- Jira project key field
- Jira board ID field
- Jira JQL field
- Save configuration action
- Validation message for invalid configuration

### Screen UI-04: Error state

Purpose:
- Surface failures clearly and without ambiguity.

Elements:
- Message: “Unable to retrieve Jira issues for the configured team.”
- Retry button
- Guidance to verify the Jira project or JQL configuration

### Screen states

- Empty state: no report has been generated yet
- Loading state: report is being assembled from Jira
- Success state: preview shows the generated email content
- Error state: Jira configuration or API failure is displayed

## 8. Data Model

The database remains intentionally lightweight. It stores only configuration and operational metadata required for the report workflow.

### 8.1 Table: team_settings

Stores the Jira scope for the Shell SSW team.

| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL / UUID | Primary key |
| team_name | VARCHAR(100) | Fixed value such as “Shell SSW” |
| jira_project_key | VARCHAR(50) | Jira project key, if used |
| jira_board_id | VARCHAR(50) | Jira board ID, if used |
| jira_jql | TEXT | JQL filter representing the team scope |
| is_active | BOOLEAN | Marks the active team configuration |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

Notes:
- Only one active team configuration is expected.
- The database stores the Jira scoping configuration, not the report content itself.

### 8.2 Table: report_runs

Stores each report generation event and associated metadata.

| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL / UUID | Primary key |
| team_setting_id | INTEGER / UUID | Reference to the active team configuration |
| status | VARCHAR(20) | `generated`, `failed`, or `partial` |
| subject | VARCHAR(255) | Report subject line |
| generated_at | TIMESTAMP | When the report was created |
| error_message | TEXT | Optional error text if generation failed |
| issue_count | INTEGER | Number of Jira issues included |
| created_at | TIMESTAMP | Record creation time |

Notes:
- This table supports auditability and allows the user to view recent report activity.
- It does not include analytics or rollups.

### 8.3 Table: report_issues

Stores the Jira issue list used in the generated report.

| Column | Type | Description |
| --- | --- | --- |
| id | SERIAL / UUID | Primary key |
| report_run_id | INTEGER / UUID | Parent report run |
| jira_issue_key | VARCHAR(50) | Jira issue key |
| summary | TEXT | Jira issue title |
| status | VARCHAR(100) | Jira current status |
| assignee | VARCHAR(200) | Human-readable assignee name |
| updated_at | TIMESTAMP | Jira issue last update timestamp |
| created_at | TIMESTAMP | Record creation time |

Notes:
- This table keeps a snapshot of the issue list for each report run.
- It preserves the factual Jira data used in the email body.

### 8.4 Data retention guidance

- Keep data only as needed for operational auditability.
- Store the latest active team configuration and recent report run records.
- Do not add derived metrics or historical trend tables in v1.

## 9. Functional Requirements

### 9.1 Jira data retrieval

- The system MUST allow configuration of a single Jira project, board, or JQL filter that corresponds to the Shell SSW team.
- The system MUST fetch Jira issues only for that configured team context.
- The system MUST support a manual trigger to generate a report from the current Jira state.
- The data retrieval layer MUST support authentication via environment-managed credentials and must not expose secrets in logs or UI output.
- The system MUST retrieve only the fields needed for communication, such as:
  - issue key
  - issue summary
  - current status
  - assignee
  - last updated date, if used for context

### 9.2 Report composition

- The generated output MUST be a simple email body or Markdown-formatted draft.
- The report MUST fit on a single page in a standard email client.
- The report MUST include a clear subject line and a concise summary introduction.
- The report MUST present Jira issues in a readable, stakeholder-friendly format.
- The system MUST not calculate totals, scores, percentages, or status summaries.
- The report MUST not include deduced risk levels or at-risk indicators.
- The system MUST not add any analytical interpretation beyond the raw Jira issue data.

### 9.3 User interaction

- The front end MUST provide a button or action to generate a report manually.
- The application MUST display a report preview before final delivery.
- The user MUST be able to copy the generated content into an email or export it as plain text or Markdown.
- The system MUST preserve a human review step before the report is distributed.

### 9.4 Data quality and validation

- The system MUST validate the configured Jira team context before generating a report.
- The system MUST fail clearly if Jira data cannot be retrieved or the project scope is invalid.
- Empty issue lists MUST be handled explicitly and shown as a valid but empty result rather than silently treated as success.
- The system MUST retain the raw Jira issue data in the report output without applying unsupported classification.

## 10. Non-Functional Requirements

### 10.1 Simplicity

- The initial implementation MUST remain intentionally minimal.
- The system MUST support only one team and one Jira scope.
- The codebase MUST avoid unnecessary abstractions or advanced analytics components.

### 10.2 Reliability

- The system MUST handle missing or transient Jira access issues without crashing.
- Errors MUST be surfaced to the user in a clear and actionable way.
- The report generation flow MUST be repeatable and deterministic for the same Jira state.

### 10.3 Performance

- Typical report generation for the Shell SSW team should complete quickly enough for ad hoc weekly use.
- The system should avoid unnecessary data processing beyond the required Jira fields and formatting logic.

### 10.4 Security and configuration

- Jira credentials and API tokens MUST be managed via environment variables or secure deployment configuration.
- Secrets MUST NOT be stored in source code or committed into the repository.
- The system MUST avoid exposing internal Jira configuration in end-user views.

### 10.5 Maintainability

- Jira fetch logic and report formatting logic MUST be separated into distinct modules or services.
- The project MUST keep the frontend and backend responsibilities clear.
- A future update should be able to replace the Jira filter or report format without rewriting the whole application.

## 11. Technical Baseline

- Frontend: React 18 with Vite
- Backend: Node.js with Express
- Database: PostgreSQL 15, running via Docker
- Local orchestration: Docker Compose
- Data source: Jira only
- Output format: plain text or Markdown for email copy/paste

## 12. Data Contracts

The system stores minimal metadata required for configuration and report traceability:

- configured team name
- configured Jira project or JQL filter
- last successful generation timestamp
- last error message, if any
- snapshot of Jira issues used in the most recent generated report

The database MUST remain lightweight and must not be used to perform analytics or scoring. It exists to support configuration and operational traceability, not reporting intelligence.

## 13. Acceptance Criteria

- A user can trigger a report generation manually.
- The system fetches Jira issues for the configured Shell SSW team only.
- The generated output is a one-page, email-ready weekly status draft.
- The draft includes factual Jira issue details without extra interpretation.
- The system does not produce at-risk detection, summary calculations, or forecast logic.
- The user can review the output before sending it.
- The system handles Jira configuration or access errors with clear messaging and no silent failure.

## 14. Project Principles for Future Change

This project must remain within its original scope. Any future request to add dashboards, scorecards, portfolio views, risk modeling, or automated sending must be treated as a new product decision and a separate specification change.
