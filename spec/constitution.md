# Jira/Confluence Automation Project Constitution

## Project Identity

### Project name

Change Request (CR) Registry.

### Purpose

Provide a Jira-first reporting and governance application for tracking,
normalizing, reviewing, and reporting change requests across multiple projects.
The system combines Jira metadata with controlled manual governance enrichment
and supports dashboards, filtering, snapshots, exports, and Confluence
automation.

### Target users

- Delivery managers
- Project leads
- Managers responsible for cross-project governance
- Team leads and broader stakeholders requiring read-only reporting

## Technical Baseline

- **Frontend:** React `18` with Vite.
- **Backend:** Node.js with Express.
- **Database:** PostgreSQL `15`.
- **Local infrastructure:** Docker and Docker Compose.
- **Integration systems:** Jira as the primary metadata source; Confluence for
  approved governance and report-sharing workflows.
- **Repository style:** Monorepo with separate frontend, backend, shared
  packages, database, and test boundaries.

Dependency versions MUST be explicit in package manifests and reviewed when
changed. Secrets MUST be supplied through environment or secret-management
facilities and MUST NOT be committed.

## Folder Structure Conventions

```text
cr-registry/
├── apps/
│   ├── frontend/
│   │   └── src/
│   │       ├── app/
│   │       ├── components/
│   │       ├── features/
│   │       │   ├── change-requests/
│   │       │   ├── dashboard/
│   │       │   ├── reports/
│   │       │   └── administration/
│   │       ├── pages/
│   │       ├── services/
│   │       ├── hooks/
│   │       ├── types/
│   │       └── styles/
│   └── backend/
│       └── src/
│           ├── config/
│           ├── routes/
│           ├── controllers/
│           ├── services/
│           │   ├── jira/
│           │   ├── registry/
│           │   ├── reporting/
│           │   └── export/
│           ├── models/
│           ├── repositories/
│           ├── jobs/
│           ├── middleware/
│           ├── validators/
│           └── types/
├── packages/
│   ├── shared-types/
│   ├── validation/
│   └── config/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
├── tests/
│   ├── integration/
│   └── e2e/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

### Organization rules

- Frontend feature-specific code belongs in the relevant `features/` directory.
- Reusable frontend UI belongs in `components/`; pages compose features rather
  than contain business logic.
- Backend routes define HTTP wiring, controllers translate requests and
  responses, and services contain business and integration logic.
- Database access belongs behind repositories or an equivalent persistence
  boundary.
- Jira and Confluence clients MUST remain isolated from domain logic.
- Shared API contracts, domain types, and validation schemas belong in
  `packages/`.
- Schema changes MUST use reviewed, repeatable migrations.
- Scheduled synchronization and recovery logic belongs in backend `jobs/`.
- Tests SHOULD mirror the boundary they validate and MUST NOT depend on
  production credentials.

## Coding Standards

### Naming

- Use `PascalCase` for React components, classes, and exported types.
- Use `camelCase` for variables, functions, hooks, service methods, and object
  properties.
- Prefix React hooks with `use`.
- Use `UPPER_SNAKE_CASE` only for true constants.
- Use descriptive names based on domain language: `changeRequest`,
  `jiraIssueKey`, `decisionOutcome`, and `synchronizationRun`.
- Use canonical lifecycle values exactly as defined by the domain:
  `New`, `Under review`, `Approved`, `Rejected`, `In progress`, `On hold`,
  `Completed`, and `Cancelled`.
- Use kebab-case for directory names and lowercase names for non-component
  module files unless the framework requires otherwise.

### File organization

- Keep one primary component, service, controller, or domain type per file.
- Co-locate feature-specific components, hooks, API functions, types, and tests
  within the feature boundary when practical.
- Keep files focused; extract logic when a file mixes transport, domain,
  persistence, and presentation responsibilities.
- Export public package APIs through explicit entry points.
- Do not import persistence or integration internals directly into React
  components.
- Keep request validation close to API boundaries and domain invariants close
  to domain services.

### General quality

- Use the specification as the source of truth before implementing behavior.
- Validate inputs at API and persistence boundaries.
- Return explicit errors; do not silently convert failures into empty success
  responses.
- Preserve Jira-sourced data and distinguish it from manual enrichment.
- Add focused tests for new behavior and regression tests for changed behavior.
- Keep logs structured, actionable, and free of secrets or unnecessary
  sensitive Jira/Confluence data.
- Use consistent formatting, linting, and type checking configured by the
  project; do not bypass quality checks to merge a change.

## Core Domain Rules

- Jira is authoritative for CR metadata when the corresponding Jira field
  exists.
- Each synchronized CR retains a stable Jira issue-key mapping.
- Manual governance fields MUST survive later synchronization.
- Missing Jira links, stale records, overdue dates, unmapped values, and
  synchronization failures MUST be visible for review.
- Reporting filters MUST behave consistently across lists, dashboards, trends,
  snapshots, and exports.
- Role-based authorization MUST be enforced by the backend, not only by the
  frontend.

## Development Workflow and Quality Gates

Every feature follows:

1. Specify user behavior and acceptance criteria.
2. Clarify assumptions, permissions, data mappings, and failure behavior.
3. Create a technical plan and identify affected boundaries.
4. Break the plan into verifiable tasks.
5. Implement a complete vertical slice.
6. Validate tests, security, performance, data quality, and observability.
7. Update related documentation and operational configuration.

A change is complete only when its acceptance criteria are satisfied, API
contracts remain consistent, migrations are reviewed, failures are recoverable,
and no secrets are exposed.

## Scope and Governance

The initial scope is CR tracking, Jira synchronization, governance views,
summaries, snapshots, CSV/shareable reports, and specified Confluence
automation. Full workflow automation beyond CR tracking, developer task-level
time tracking, and deep custom analytics require a separate approved
specification.

Exceptions to this constitution MUST document the rationale, impact, owner, and
review date. Security, data integrity, and explicit acceptance criteria take
precedence over convenience.