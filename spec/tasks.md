# CR Registry Implementation Tasks

This task breakdown follows [`plan.md`](./plan.md), [`specification.md`](./specification.md),
and [`constitution.md`](./constitution.md). Tasks are ordered by dependency.
Release-2 clarification items are tracked separately and are not Release-1
implementation tasks.

## Phase 1 — Backend setup

### T-001 — Confirm Release-1 scope and pilot

**Depends on:** None  
**Owner boundary:** `spec/`

**Description**

Document the pilot Jira projects, issue types, filters, source fields,
canonical values, minimum access boundary, environment variables, acceptance
dataset, and measurable response targets.

**Acceptance criteria**

- Pilot scope names two or three candidate projects or records the approved
  smaller pilot.
- Required Jira fields and CR identification assumptions are documented.
- Release-1 versus Release-2 scope is explicit.
- Dashboard response and synchronization targets are measurable.

### T-002 — Complete requirement traceability matrix

**Depends on:** T-001  
**Owner boundary:** `spec/`

**Description**

Map each Release-1 requirement to its frontend feature, backend route/service,
shared contract, migration, and test.

**Acceptance criteria**

- Every Release-1 acceptance criterion has at least one implementation and test
  destination.
- The matrix identifies the owning repository boundary.
- Missing decisions are linked to `clarify.md` rather than silently assumed.

### T-003 — Configure monorepo workspaces

**Depends on:** T-002  
**Owner boundary:** repository root, `apps/`, `packages/`

**Description**

Configure package workspaces and root scripts for frontend, backend, shared
packages, database, formatting, linting, type checking, and tests.

**Acceptance criteria**

- A clean checkout installs dependencies through the documented root command.
- Workspace packages resolve without ad-hoc relative imports.
- Root scripts invoke each approved project quality check.

### T-004 — Configure backend and shared packages

**Depends on:** T-003  
**Owner boundary:** `apps/backend`, `packages/`

**Description**

Configure Node.js/Express backend package metadata, shared package entry points,
and the React 18/Vite package baseline.

**Acceptance criteria**

- Backend starts through a documented development command.
- Shared package entry points are importable by backend and frontend.
- Required dependency versions are explicit in manifests.

### T-005 — Add typed environment configuration

**Depends on:** T-003  
**Owner boundary:** `apps/backend/src/config`, `packages/config`

**Description**

Define environment loading and validation for database, Jira, application,
logging, and frontend API configuration.

**Acceptance criteria**

- `.env.example` lists every required variable without real secrets.
- Missing required production configuration fails clearly at startup.
- Tests can provide isolated configuration without production credentials.

### T-006 — Run PostgreSQL 15 through Docker

**Depends on:** T-003  
**Owner boundary:** `docker-compose.yml`, `database/`

**Description**

Add a PostgreSQL 15 Compose service with persistent local storage, health
checks, safe development defaults, and documented startup/shutdown commands.

**Acceptance criteria**

- PostgreSQL starts successfully through Docker Compose.
- The health check reports readiness.
- Data persists across a container restart.
- Credentials are supplied through environment configuration.

### T-007 — Create backend health and readiness endpoints

**Depends on:** T-004, T-005, T-006  
**Owner boundary:** `apps/backend/src/routes`

**Description**

Add unauthenticated health and dependency-readiness checks appropriate for local
development and operations.

**Acceptance criteria**

- Health responds when the process is alive.
- Readiness reports database unavailability explicitly.
- Responses use the documented API response/error shape.

### T-008 — Define and migrate the Release-1 database schema

**Depends on:** T-006, T-001  
**Owner boundary:** `database/migrations`, `database/schema`

**Description**

Create tables for CRs, project configuration, field mappings, synchronization
runs, data-quality issues, decision history, snapshots, users/access scope, and
required supporting metadata.

**Acceptance criteria**

- Migrations apply cleanly to an empty PostgreSQL 15 database.
- Jira issue keys are stable and duplicate-free.
- Nullability, foreign keys, timestamps, and canonical lifecycle constraints are
  explicit.
- Indexes cover project, status, priority, owner, date, and Jira-key queries.

### T-009 — Add seed data and repository contracts

**Depends on:** T-008  
**Owner boundary:** `database/seeds`, backend repositories

**Description**

Add pilot configuration/canonical mappings and repository interfaces for CR,
configuration, sync, quality, history, and snapshot data.

**Acceptance criteria**

- Seed data is repeatable and contains no credentials.
- Repository methods cover the Release-1 use cases.
- Repository integration tests pass against PostgreSQL.

## Phase 2 — Frontend setup

### T-010 — Configure React 18/Vite application shell

**Depends on:** T-003, T-005  
**Owner boundary:** `apps/frontend`

**Description**

Configure the frontend entry point, application shell, styling baseline,
development proxy/API base URL, and shared package imports.

**Acceptance criteria**

- Frontend starts through the documented command.
- The shell renders without implementation-specific feature logic.
- API configuration is environment-driven and documented.

### T-011 — Add frontend routing and user context

**Depends on:** T-010, T-007  
**Owner boundary:** `apps/frontend/src/app`, `pages`

**Description**

Add routes and placeholders for CRs, dashboard, reports, administration, and
access-denied states.

**Acceptance criteria**

- Required routes render through the application shell.
- Protected-route and current-user boundaries are explicit.
- Unknown routes show a controlled not-found state.

### T-012 — Add shared API client and UI state conventions

**Depends on:** T-010, T-004  
**Owner boundary:** frontend `services`, `hooks`, `types`

**Description**

Create the API client boundary and reusable loading, empty, error, retry, and
permission-denied state patterns.

**Acceptance criteria**

- API calls use shared contracts and consistent error parsing.
- Components do not directly access persistence or integration internals.
- Loading and failure states are testable without live Jira credentials.

## Phase 3 — Feature implementation

### T-013 — Implement Jira client adapter

**Depends on:** T-005, T-009  
**Owner boundary:** `apps/backend/src/services/jira`

**Description**

Implement configured Jira retrieval with pagination, timeouts, bounded retries,
structured errors, and source metadata retention.

**Acceptance criteria**

- Adapter requests pages until the configured result set is complete.
- Timeout, authentication, rate-limit, and network failures are explicit.
- Tests cover pagination and representative failure responses.

### T-014 — Implement Jira normalization and upsert

**Depends on:** T-008, T-009, T-013  
**Owner boundary:** backend Jira/registry services

**Description**

Normalize Jira issues into the CR model and upsert by Jira issue key while
preserving source values and manual governance fields.

**Acceptance criteria**

- Reprocessing the same issue does not create duplicates.
- Canonical lifecycle and configured mappings are applied.
- Source and manual fields remain distinguishable.
- Missing or unmapped fields create data-quality records.

### T-015 — Implement synchronization runs and jobs

**Depends on:** T-013, T-014  
**Owner boundary:** `apps/backend/src/jobs`

**Description**

Add scheduled/manual synchronization entry points, run counters, status,
timestamps, structured errors, and pilot-scope reprocessing.

**Acceptance criteria**

- A run records start, completion, result, counts, and errors.
- Successful, partial, and failed runs are distinguishable.
- A bounded reprocessing request reports succeeded, failed, and skipped records.
- Overlapping runs are handled explicitly for the Release-1 design.

### T-016 — Implement CR registry API

**Depends on:** T-009, T-007  
**Owner boundary:** backend routes/controllers/registry service

**Description**

Implement versioned list, detail, filter, and permitted update endpoints with
pagination, sorting, validation, and explicit errors.

**Acceptance criteria**

- List and detail responses expose normalized fields and Jira source context.
- All specified Release-1 filters work consistently.
- Invalid filters return field-specific validation errors.
- Pagination and sorting are deterministic.

### T-017 — Implement lifecycle and governance updates

**Depends on:** T-016, T-009  
**Owner boundary:** backend registry/governance service

**Description**

Implement Release-1 lifecycle updates, decision outcomes, governance notes, and
decision history.

**Acceptance criteria**

- Canonical lifecycle states are validated.
- Authorized updates record actor and timestamp.
- Prior state/outcome and new state/outcome are retained.
- Jira synchronization does not overwrite governance-only fields.

### T-018 — Implement minimum Release-1 authorization

**Depends on:** T-016, T-001  
**Owner boundary:** backend middleware and access repositories

**Description**

Enforce the approved prototype role and project-scope boundary on every
protected endpoint.

**Acceptance criteria**

- Unauthorized reads and writes are rejected.
- Authorized project-scoped reads and writes succeed.
- Negative authorization tests cover every protected route group.
- Frontend guards do not substitute for backend authorization.

### T-019 — Implement reporting API

**Depends on:** T-016, T-014  
**Owner boundary:** backend reporting service/routes

**Description**

Implement project, status, priority, overdue, selected-period, trend, and
synchronization-freshness summaries using the shared filter contract.

**Acceptance criteria**

- List and report totals agree for identical filters.
- Overdue and period inclusion follow the Release-1 documented rules.
- Results expose data freshness and selected filter context.
- Queries use normalized validated records.

### T-020 — Build CR list and detail features

**Depends on:** T-011, T-012, T-016, T-017  
**Owner boundary:** frontend change-request feature

**Description**

Build the registry list, filters, pagination, detail view, Jira source display,
governance fields, lifecycle display, history, and permitted edit controls.

**Acceptance criteria**

- An authorized user can list, filter, inspect, and update permitted fields.
- Loading, empty, error, retry, and permission-denied states render correctly.
- Jira-sourced and manual fields are visibly distinguishable.
- Frontend tests cover primary list and detail journeys.

### T-021 — Build dashboard feature

**Depends on:** T-011, T-012, T-019  
**Owner boundary:** frontend dashboard feature

**Description**

Build dashboard cards, tables, and charts for the required summaries and
freshness/failure indicators.

**Acceptance criteria**

- Dashboard supports the same filters as the registry.
- Project, status, priority, overdue, period, trend, and freshness views are
  displayed.
- Empty and failed synchronization states are visible.
- Accessibility checks pass for critical dashboard controls.

### T-022 — Implement snapshots

**Depends on:** T-019, T-018  
**Owner boundary:** backend snapshot service/routes and frontend reports feature

**Description**

Implement weekly/monthly snapshot creation and retrieval with period, filters,
aggregates, timestamp, and freshness context.

**Acceptance criteria**

- Authorized reporting users can create and retrieve snapshots.
- Snapshot values remain unchanged after later CR updates.
- Snapshot access respects project scope.
- Frontend and API tests cover creation and retrieval.

### T-023 — Implement CSV and Release-1 shareable reports

**Depends on:** T-019, T-022, T-018  
**Owner boundary:** backend export service and frontend reports feature

**Description**

Generate filtered reports using the same query/filter contract as the dashboard.

**Acceptance criteria**

- CSV output has stable documented columns and date formatting.
- Output includes period, filters, generation time, and freshness.
- Export data is authorization-scoped.
- Export failures are explicit, logged, and covered by tests.

### T-024 — Build administration feature

**Depends on:** T-015, T-018, T-020  
**Owner boundary:** administration frontend and backend configuration routes

**Description**

Provide Release-1 administration for pilot projects, filters, field mappings,
canonical values, schedules, access scope, synchronization history, and
reprocessing.

**Acceptance criteria**

- Administrators can view and update approved configuration fields.
- Non-administrators cannot access configuration mutations.
- Configuration changes are validated and reflected in subsequent runs.
- Synchronization history and reprocessing results are visible.

## Phase 4 — Integration and testing

### T-025 — Add integration test suite

**Depends on:** T-015, T-016, T-017, T-019, T-022, T-023  
**Owner boundary:** `tests/integration`

**Description**

Test Jira synchronization, repositories, API contracts, authorization,
reporting, snapshots, and exports against PostgreSQL and controlled external
service fixtures.

**Acceptance criteria**

- Tests cover success, partial, and failure synchronization paths.
- Tests verify duplicate prevention and governance-field preservation.
- Authorization negative cases pass.
- Report, snapshot, and export values are verified against known fixtures.

### T-026 — Add end-to-end user journey tests

**Depends on:** T-020, T-021, T-022, T-023, T-024  
**Owner boundary:** `tests/e2e`

**Description**

Cover portfolio review, filtering, CR inspection, governance update, snapshot,
export, synchronization status, and permission-denied journeys.

**Acceptance criteria**

- Tests run against a repeatable local test environment.
- Primary authorized-user journeys pass without manual intervention.
- Permission-denied and service-error states are exercised.

### T-027 — Test failure recovery and data quality

**Depends on:** T-025  
**Owner boundary:** integration/E2E tests

**Description**

Exercise retries, partial runs, missing Jira links, unmapped values, overdue
records, database restart, and bounded reprocessing.

**Acceptance criteria**

- Each failure produces a visible diagnostic result.
- No failure is represented as a successful empty result.
- Reprocessing produces deterministic, duplicate-free outcomes.
- Data-quality issues are retained and queryable.

### T-028 — Run security, performance, and observability review

**Depends on:** T-025, T-026, T-027  
**Owner boundary:** repository operations and application boundaries

**Description**

Verify secret redaction, authorization coverage, structured logs, correlation
context, health/readiness behavior, and agreed pilot performance targets.

**Acceptance criteria**

- No credentials or unnecessary Jira/Confluence data appear in logs or source.
- All protected routes enforce backend authorization.
- Dashboard and synchronization measurements meet T-001 targets or have
  documented exceptions.
- Operational failures are diagnosable from logs and run history.

### T-029 — Document operations and pilot runbook

**Depends on:** T-028  
**Owner boundary:** `README.md`, operational documentation

**Description**

Document setup, Docker startup, migrations, environment configuration, Jira
sync, reprocessing, troubleshooting, backups/restore assumptions, and pilot
execution.

**Acceptance criteria**

- A new developer can start the stack from the documented instructions.
- Operators can identify and reprocess a failed synchronization.
- Documentation identifies Release-2 deferred items and known assumptions.

### T-030 — Execute pilot and release review

**Depends on:** T-028, T-029  
**Owner boundary:** project/release process

**Description**

Run the pilot against two or three projects, review mappings and data quality,
and assess the Release-1 acceptance checklist.

**Acceptance criteria**

- Pilot findings are recorded with owners and follow-up scope.
- All Release-1 acceptance checklist items are demonstrated or explicitly
  excepted.
- Unresolved issues are assigned to the Release-2 backlog.
- Release-1 candidate approval is documented.

## Release-2 backlog tasks

### T-031 — Clarify and specify Release-2 decisions

**Depends on:** T-030  
**Owner boundary:** `spec/`

**Description**

Resolve C-01, C-02, C-03, and G-01 through G-35 in a revised specification
before implementing Release 2.

**Acceptance criteria**

- Confluence publication contract is defined.
- Manual/provisional CR and merge rules are defined.
- Canonical roles and inheritance are defined.
- Each G-item has an accepted decision, owner, and implementation scope.

### T-032 — Plan Release-2 implementation

**Depends on:** T-031  
**Owner boundary:** `spec/`

**Description**

Update the architecture, traceability matrix, migrations, API contracts, test
plan, and milestone plan for approved Release-2 decisions.

**Acceptance criteria**

- Release-2 changes do not silently alter Release-1 data ownership or metrics.
- New requirements map to repository boundaries and acceptance tests.
- Migration, compatibility, rollout, and rollback impacts are documented.
