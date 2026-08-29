# Weekly Status Report Generator Constitution

## Project Identity

### Project name

Weekly Status Report Generator

### Purpose

Provide a lightweight weekly stakeholder reporting tool for a single delivery team. The system retrieves Jira issue data for the Shell SSW team, formats it into a simple one-page report, and enables a delivery manager to generate an email-ready status update.

### Target user

- Primary user: Delivery Manager
- Report recipient: Stakeholders receiving the weekly update
- Scope: One team only: Shell SSW

## Technical Baseline

- Frontend: React 18 with Vite
- Backend: Node.js with Express
- Database: Not required for v1; do not introduce PostgreSQL for this project unless a later requirement explicitly requires it
- Integration: Jira as the exclusive source of issue data
- Output: Plain-text email draft suitable for copy/paste into an email client
- Configuration: Static runtime configuration such as Jira URL and project key, kept minimal

Dependency versions must be explicit and reviewed before changes. Secrets must be stored via environment variables or secure runtime configuration and must never be committed to source control.

## Core Project Principles

1. Keep the solution intentionally simple.
2. Report only one team: Shell SSW.
3. Use Jira as the single source of truth.
4. Require a manual trigger for report generation.
5. Produce plain, readable stakeholder content.
6. Avoid analytics, forecasts, risk logic, and summary metrics.
7. Keep the delivery manager in control of final email review and sending.
8. Keep configuration static and minimal.

## Scope Boundaries

### In scope

- Single-team Jira issue fetching for project `SHELSSW`
- Manual report generation
- Basic Jira issue formatting for email consumption
- One-page stakeholder-ready report
- Single project-level Jira configuration
- Copyable plain-text report preview
- Error display for Jira request failures

### Out of scope

- Multi-team reporting
- Automated at-risk detection
- Summary calculations or KPI aggregation
- Burn-down, trend, or velocity analysis
- Automated email sending
- Portfolio or program reporting
- Risk scoring, status scoring, or recommendations
- Authentication or user roles
- Database persistence for v1
- Any business logic beyond data retrieval and formatting

## Functional Rules

- The system must allow the delivery manager to trigger report generation by clicking a button.
- The system must fetch Jira data for the configured Shell SSW project only.
- The system must use the Jira project code `SHELSSW` as the canonical team scope.
- The system must include issues in `To Do`, `In Progress`, and `Done`.
- The system must include only Story issue types.
- The system must include closed items alongside active items in the same list.
- The system must not group or summarize the issue list beyond a flat list presentation.
- The system must format the data into a concise, email-friendly plain-text body.
- The system must not calculate totals, summaries, or risk labels.
- The system must not create a dashboard or analytics layer in the initial version.
- The system must display the generated report so the user can copy it directly into an email.
- The system must show the raw Jira error if the call fails.

## Data Rules

- Jira is the authoritative source for issue data.
- Only issues relevant to the Shell SSW project are included.
- The report window is the last 7 calendar days.
- The report includes all matching Story issues in `To Do`, `In Progress`, and `Done`.
- Raw Jira data must be preserved without additional interpretation or scoring.
- The report must remain factual and presentation-ready without hidden logic.
- No database is required for the v1 workflow.

## Folder Structure Conventions

### Frontend

- React 18 + Vite application for the user interface
- Keep UI simple and focused on generating and previewing the report
- Business logic should stay minimal and not duplicate Jira query behavior
- Prefer straightforward components and minimal state complexity

### Backend

- Node.js + Express server responsible for Jira access and report generation
- API routes should handle request/response flow only
- Service layer should encapsulate Jira querying and formatting
- No scheduling, background jobs, or analytics jobs are required in v1

### Runtime config

- Keep environment and project configuration in a minimal `.env` or config file
- Do not create a database schema unless a later requirement demands it

### Project structure

```text
project/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   └── package.json
├── config/
│   └── env.example
├── docs/
├── docker-compose.yml
├── .env.example
├── README.md
└── package.json
```

## Coding Standards

### Naming

- Use PascalCase for React components and exported types.
- Use camelCase for variables, functions, and API objects.
- Use kebab-case for file and directory names.
- Use descriptive domain names such as `jiraIssue`, `reportTemplate`, and `teamContext`.

### File organization

- Keep frontend components small and presentation-focused.
- Keep backend routes, controllers, and services separated by responsibility.
- Put Jira integration logic behind a dedicated service boundary.
- Keep formatting logic separate from fetch logic.
- Do not over-engineer abstractions for a simple use case.

### Quality expectations

- Favor clarity and maintainability over cleverness.
- Validate input and configuration at the API boundary.
- Handle Jira access failures explicitly and return readable error messages.
- Keep logs concise and avoid leaking secrets.
- Add only the tests required to confirm the core workflow works.

## Development Workflow

Every feature or change follows this sequence:

1. Confirm the requirement against the project specification.
2. Clarify the exact data source, team scope, and output format.
3. Implement the smallest viable change.
4. Validate the behavior with focused tests or manual checks.
5. Confirm that the report remains simple, factual, and stakeholder-ready.

A change is complete only when it meets the specification and does not introduce unnecessary complexity.

## Governance and Exceptions

This project must stay within the original narrow scope. Any request to add dashboards, analytics, risk scoring, automatic email sending, role-based access, or multi-team reporting must be treated as a new scope decision and documented before implementation.

Exceptions require a clear rationale, a documented impact assessment, and explicit approval before they are implemented. Simplicity and scope control take precedence over feature expansion.
