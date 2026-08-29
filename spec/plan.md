# CR Registry Implementation Plan

## 1. Plan basis

This plan is based on:

- [`constitution.md`](./constitution.md)
- [`specification.md`](./specification.md)
- [`clarify.md`](./clarify.md)

The plan uses the current release decisions:

- **Release 1:** Jira-sourced CR registry prototype, reporting, snapshots,
  exports, and the minimum role/access behavior needed to protect the
  prototype.
- **Release 2:** Confluence publication, manual CR creation and its merge
  rules, expanded role model decisions, and all G-01 through G-35
  clarification items.
- **Immediate action:** Complete C-05 by mapping requirements to repository
  boundaries before implementation.
- **Accepted baseline:** C-04; the constitution is the source for the React 18,
  Vite, Node.js, Express, PostgreSQL 15, and Docker baseline.

Release-2 items remain visible in this plan as a backlog, but they are not
Release-1 acceptance gates unless planning discovers a direct dependency.

## 2. Target architecture

The implementation will use the monorepo boundaries defined by the
constitution:

- `apps/frontend`: React 18/Vite application with feature-oriented UI.
- `apps/backend`: Node.js/Express API, domain services, Jira adapter, reporting,
  export, and scheduled jobs.
- `packages/shared-types`: shared CR, filter, report, and API contracts.
- `packages/validation`: shared request and domain validation.
- `packages/config`: typed environment and application configuration.
- `database`: PostgreSQL 15 schema, migrations, and seed data.
- `tests/integration` and `tests/e2e`: infrastructure and acceptance coverage.

Jira integration remains isolated behind a backend adapter. PostgreSQL is the
system's normalized read/reporting store. Docker Compose provides the local
database and development dependencies.

## 3. Requirement-to-boundary traceability (C-05)

| Requirement area | Frontend | Backend | Shared/database |
| --- | --- | --- | --- |
| CR list, detail, filters | `features/change-requests`, `pages`, `services` | routes, controllers, registry service | CR/filter types, CR tables and indexes |
| Jira ingestion and normalization | administration/sync status UI | `services/jira`, normalization service, `jobs` | source mappings, sync runs, data-quality tables |
| Lifecycle and governance notes | CR detail/edit UI | registry and governance services | CR fields, decision history |
| Dashboard and trends | `features/dashboard` | reporting service and routes | reporting queries/indexes |
| Snapshots | `features/reports` | snapshot service and routes | snapshot tables |
| CSV/shareable reports | report controls and download handling | export service and routes | report metadata as needed |
| Access control | route guards and user context | authentication/authorization middleware | user, role, and project-scope data |
| Administration | `features/administration` | configuration routes/services | project and field-mapping tables |
| Testing | feature tests and E2E flows | service/API integration tests | migration and database test fixtures |

This table is the initial C-05 mapping. The technical design phase MUST turn it
into a route, module, migration, and test traceability matrix.

## 4. Four-phase delivery model

The detailed milestones below are grouped into four implementation phases so
that each phase produces a usable, verifiable increment.

### Phase 1 — Backend setup

**Focus:** Database, API skeleton, configuration, and integration boundaries.

This phase includes:

- Phase 0 — Scope and technical decisions.
- Phase 1 — Repository and development foundation.
- Phase 2 — Data model and persistence.
- The foundation of Phase 3 — Jira adapter, normalization boundary, and job
  entry points.
- The foundation of Phase 4 — versioned Express routes, validation, and
  authorization middleware.

**Milestone:** PostgreSQL runs through Docker, migrations apply, the Express
health endpoint responds, shared contracts exist, and the API skeleton exposes
validated route boundaries.

### Phase 2 — Frontend setup

**Focus:** React/Vite application shell, UI skeleton, routing, and API client.

This phase includes:

- React 18/Vite application configuration.
- Application shell and navigation.
- Protected-route and user-context boundaries.
- Shared frontend types and API service setup.
- Loading, empty, error, and permission-denied UI states.

**Milestone:** The frontend starts locally, routes render through the application
shell, and placeholder screens can call the versioned backend API.

### Phase 3 — Feature implementation

**Focus:** Deliver one complete feature at a time as vertical slices.

Features are implemented in this order:

1. **Jira synchronization:** ingestion, normalization, upsert, run history,
   errors, and pilot-scope reprocessing.
2. **CR registry:** list, detail, filters, pagination, Jira source context,
   governance fields, lifecycle display, and permitted updates.
3. **Dashboard:** project, status, priority, overdue, period, trend, and
   synchronization freshness summaries.
4. **Snapshots:** weekly/monthly creation and retrieval with preserved context.
5. **Exports:** filtered CSV and the selected Release-1 shareable report format.
6. **Administration:** pilot project configuration, field mappings, schedules,
   canonical values, and access scope.

Each feature MUST include its backend route/service, persistence changes,
frontend UI, shared contract/validation updates, focused tests, and acceptance
criteria demonstration before the next feature begins.

**Milestone:** Every Release-1 feature is independently usable and integrated
through the real API and PostgreSQL store rather than placeholders or mocked
production paths.

### Phase 4 — Integration and testing

**Focus:** End-to-end behavior, reliability, security, performance, and pilot
readiness.

This phase includes:

- Full Jira-to-database-to-API-to-React flow verification.
- Integration tests for synchronization, persistence, authorization, reporting,
  snapshots, and exports.
- E2E tests for the primary user journeys.
- Failure tests for retries, partial syncs, missing links, unmapped values,
  overdue records, and database restarts.
- Secret/log review, migration verification, and Docker setup validation.
- Measurement against the agreed pilot response and synchronization targets.
- Pilot execution with two or three projects and Release-2 backlog capture.

**Milestone:** The Release-1 acceptance checklist is green, quality gates pass,
and the pilot is ready for stakeholder review.

## 5. Detailed phases and milestones

### Phase 0 — Scope and technical decisions

**Goal:** Make Release-1 assumptions explicit without pulling the Release-2
clarification backlog into implementation.

**Tasks**

- Confirm the pilot Jira projects, issue types, filters, and required fields.
- Record Release-1 canonical CR lifecycle, priority, impact, and date rules
  sufficient to build the pilot.
- Define the minimum prototype access model and local authentication stub or
  adapter boundary.
- Confirm Jira environment, credentials mechanism, required permissions, and
  API connectivity.
- Turn the C-05 traceability table into a detailed requirement matrix.
- Define measurable pilot data volume and dashboard response targets.

**Milestone M0 — Release-1 baseline approved**

Exit when the pilot scope, source fields, canonical mappings, access boundary,
environment variables, and acceptance-test dataset are documented.

### Phase 1 — Repository and development foundation

**Goal:** Make the skeleton buildable and repeatable.

**Tasks**

- Configure root workspace/package management and scripts.
- Configure React 18/Vite frontend and Node.js/Express backend packages.
- Add shared package entry points and TypeScript/API contract conventions if
  selected by the technical design.
- Add typed environment configuration and `.env.example`.
- Add Docker Compose for PostgreSQL 15 with persistent development volume,
  health check, and safe local defaults.
- Establish formatting, linting, type-checking, test, and migration commands
  using project-approved tools.
- Add application health/readiness endpoints and a frontend/backend development
  startup path.

**Milestone M1 — Foundation runs locally**

A new checkout can start PostgreSQL, run migrations, start both applications,
execute quality checks, and report dependency/configuration errors explicitly.

### Phase 2 — Data model and persistence

**Goal:** Create the normalized storage model required by the Release-1 flows.

**Tasks**

- Define CR table fields, nullability, canonical status values, timestamps, and
  Jira-key uniqueness.
- Define project configuration and Jira field-mapping tables.
- Define synchronization-run and data-quality issue tables.
- Define decision history and snapshot tables.
- Add foreign keys, indexes for project/status/priority/owner/date/Jira key, and
  migration rollback or recovery guidance.
- Add seed data for the pilot project configuration and canonical mappings.
- Implement repository interfaces and database integration tests.

**Milestone M2 — Persistence contract stable**

Migrations apply cleanly to an empty PostgreSQL 15 database, repository tests
pass, and the schema supports the CR and reporting acceptance criteria.

### Phase 3 — Jira ingestion and CR normalization

**Goal:** Load Jira CR metadata into the registry reliably.

**Tasks**

- Implement a Jira client adapter with pagination, timeouts, bounded retries,
  and structured errors.
- Implement configured project/filter retrieval.
- Normalize Jira fields into the shared CR model.
- Upsert records by stable Jira issue key.
- Preserve source values and keep governance fields separate.
- Record synchronization runs, counts, timestamps, and data-quality issues.
- Add scheduled and manual synchronization job entry points.
- Add bounded reprocessing for the Release-1 pilot scope.

**Milestone M3 — Jira synchronization works**

A configured pilot project can be synchronized repeatedly without duplicate CRs;
successful, partial, and failed runs are distinguishable and diagnosable.

### Phase 4 — Core Express API

**Goal:** Expose secure, validated registry operations to the frontend.

**Tasks**

- Add versioned routes for CR list/detail/update, filters, dashboard data,
  snapshots, exports, synchronization status, and administration.
- Add request validation and consistent success/error response shapes.
- Implement the minimum Release-1 authorization boundary and project scope.
- Add pagination, sorting, filtering, and stable query behavior.
- Implement lifecycle updates, governance notes, decision outcomes, and history.
- Add API contract tests and integration tests against PostgreSQL.

**Milestone M4 — API supports vertical slices**

The API can support the list, detail, synchronization, dashboard, snapshot, and
export flows with validated requests, explicit errors, and authorization checks.

### Phase 5 — React registry and dashboard

**Goal:** Deliver the primary manager and project-lead experience.

**Tasks**

- Build application shell, navigation, user context, and protected routes.
- Build CR list with all Release-1 filters and deterministic pagination.
- Build CR detail view showing Jira source context, governance fields, and
  history.
- Build authorized governance edit controls and lifecycle display.
- Build dashboard cards/tables/charts for project, status, priority, overdue,
  period, trend, and synchronization freshness summaries.
- Implement loading, empty, error, retry, and permission-denied states.
- Add frontend component/feature tests and accessibility checks for critical
  flows.

**Milestone M5 — Core user journeys complete**

An authorized pilot user can inspect CRs, filter the registry, review portfolio
summaries, and update permitted governance data through the React application.

### Phase 6 — Snapshots and exports

**Goal:** Support repeatable governance reporting.

**Tasks**

- Implement weekly and monthly snapshot creation and retrieval.
- Persist period, filters, aggregates, creation time, and freshness context.
- Implement CSV generation from the same filtered query contract used by the UI.
- Add report metadata and scoped download behavior.
- Add export error handling and audit logging.
- Validate output against representative pilot data.

**Milestone M6 — Reporting package ready**

Users with reporting access can create snapshots and export filtered results,
and the output includes its reporting context and data freshness.

### Phase 7 — End-to-end hardening and pilot

**Goal:** Validate the complete Release-1 vertical slice against the
constitution and acceptance criteria.

**Tasks**

- Run integration tests for Jira sync, persistence, API authorization, reports,
  snapshots, and exports.
- Run E2E tests for the primary user journeys.
- Test retries, partial syncs, missing Jira links, unmapped values, overdue
  records, and database restart behavior.
- Verify logs contain no secrets or unnecessary Jira/Confluence data.
- Measure dashboard response and synchronization throughput against M0 targets.
- Document setup, operations, migration, troubleshooting, and pilot runbooks.
- Conduct pilot with two or three projects and record mapping/data-quality
  findings.

**Milestone M7 — Release-1 candidate**

All Release-1 acceptance criteria pass, quality gates are green, pilot findings
are recorded, and unresolved issues are assigned to the Release-2 backlog.

## 6. Release-1 acceptance checklist

- [ ] CR records can be viewed and filtered by the specified key dimensions.
- [ ] Jira metadata synchronizes into a normalized CR model.
- [ ] Jira issue-key mappings remain stable and duplicate-free.
- [ ] Governance enrichment is preserved across synchronization.
- [ ] Lifecycle state and decision history are visible and auditable.
- [ ] Dashboard summaries include project, status, priority, overdue, period,
      trend, and freshness information.
- [ ] Weekly and monthly snapshots can be created and retrieved.
- [ ] Filtered reports can be exported as CSV or the selected Release-1
      shareable format.
- [ ] Synchronization failures are visible and pilot-scope reprocessing works.
- [ ] Backend authorization protects all Release-1 protected operations.
- [ ] PostgreSQL migrations, Docker setup, tests, and quality checks are
      repeatable.
- [ ] The C-05 traceability matrix is maintained as implementation changes.

## 7. Release-2 backlog

Release 2 begins with a dedicated clarification and design cycle for:

- C-01: Confluence publication and its complete publication contract.
- C-02: Manual/provisional CR creation and Jira merge rules.
- C-03: Canonical role model, inheritance, and multi-role behavior.
- G-01 through G-35: authentication, authorization detail, Jira contract,
  identification rules, field mappings, lifecycle rules, reporting semantics,
  retention, concurrency, API detail, UX, performance, observability,
  availability, deployment, testing, configuration, and security/privacy.

Release-2 work MUST update the specification before implementation and MUST NOT
silently change Release-1 data ownership or report definitions.

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Jira projects use inconsistent fields | Pilot mappings, preserve source values, record data-quality issues |
| Jira API outage or rate limiting | Timeouts, bounded retries, visible run status, reprocessing |
| Governance data is overwritten | Separate source/manual columns and synchronization merge tests |
| Reports disagree with lists | Share one filter/query contract and add cross-view tests |
| Access scope leaks data | Enforce authorization in every backend route and test negative cases |
| PostgreSQL setup differs by machine | Pin the Docker image, add health checks, and document startup |
| Scope expands during the prototype | Route unresolved items to Release 2 and require a specification update |

## 9. Milestone review protocol

At each milestone, review:

1. Traceability from requirements to code and tests.
2. Constitution compliance for naming, boundaries, security, and error handling.
3. Data ownership and synchronization behavior.
4. Acceptance criteria demonstrated with representative data.
5. New ambiguities or dependencies that should be added to
   [`clarify.md`](./clarify.md).
