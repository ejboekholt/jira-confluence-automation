# Weekly Status Report Generator Constitution

## Project Identity

### Project name
Weekly Status Report Generator

### Purpose
Provide a lightweight weekly stakeholder reporting tool for a single delivery team. The system retrieves Jira issue data for the Shell SSW team, formats it into a simple one-page report, and enables a manual trigger for generating an email-ready status update.

### Target users
- Delivery manager
- Shell SSW team lead
- Senior stakeholders receiving weekly status updates
- Internal operations users who need quick, human-reviewed communications

## Technical Baseline

- Frontend: React 18 with Vite
- Backend: Node.js with Express
- Database: PostgreSQL 15 running via Docker
- Local environment: Docker Compose for database and service orchestration
- Integration: Jira as the exclusive source of issue data
- Output: Simple email-ready report in plain text or Markdown

Dependency versions must be explicit and reviewed before changes. Secrets must be stored via environment variables or secure runtime configuration and must never be committed to source control.

## Core Project Principles

1. Keep the solution intentionally simple.
2. Report only one team: Shell SSW.
3. Use Jira as the single source of truth.
4. Require a manual trigger for report generation.
5. Produce plain, readable stakeholder content.
6. Avoid analytics, forecasts, risk logic, and summary metrics.
7. Keep the user in control of final email review and sending.

## Scope Boundaries

### In scope
- Single-team Jira issue fetching
- Manual report generation
- Basic Jira issue formatting for email consumption
- One-page stakeholder-ready report
- Team-specific Jira project or filter configuration
- Simple copy/paste or email-body output

### Out of scope
- Multi-team reporting
- Automated at-risk detection
- Summary calculations or KPI aggregation
- Burn-down, trend, or velocity analysis
- Automated email sending
- Portfolio or program reporting
- Risk scoring, status scoring, or recommendations
- Any business logic beyond data retrieval and formatting

## Functional Rules

- The system must allow a user to manually trigger report generation.
- The system must fetch Jira data for the configured Shell SSW team only.
- The system must use a single Jira project, board, or JQL filter representing that team.
- The system must extract a minimal set of Jira fields needed for a stakeholder update, such as issue key, summary, status, assignee, and update timestamp if needed.
- The system must format the data into a concise, email-friendly body.
- The system must not calculate totals, summaries, or risk labels.
- The system must not create a dashboard or analytics layer in the initial version.
- The system must provide a human review step before sending the draft to stakeholders.

## Data Rules

- Jira is the authoritative source for issue data.
- Only issues relevant to the Shell SSW team are included.
- Data retrieval must be scoped to a single configured team context.
- Raw Jira data must be preserved without extra interpretation or scoring.
- The report must remain factual and presentation-ready without hidden logic.

## Folder Structure Conventions

### Frontend
- React 18 + Vite application for the user interface
- Keep UI simple and focused on triggering report generation and displaying the report preview
- Business logic should stay minimal and not duplicate Jira query behavior
- Prefer straightforward components and minimal state complexity

### Backend
- Node.js + Express server responsible for Jira access and report generation
- API routes should handle request/response flow only
- Service layer should encapsulate Jira querying and formatting
- No complex scheduling or background analytics jobs are required in v1

### Database
- PostgreSQL 15 is required for persistence when needed
- Use the database only for light configuration and report metadata if required
- Do not introduce unnecessary schema complexity for a simple reporting workflow

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
├── database/
│   ├── docker/
│   └── init/
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

This project must stay within the original narrow scope. Any request to add dashboards, analytics, risk scoring, automatic email sending, or multi-team reporting must be treated as a new scope decision and documented before implementation.

Exceptions require a clear rationale, a documented impact assessment, and explicit approval before they are implemented. Simplicity and scope control take precedence over feature expansion.
