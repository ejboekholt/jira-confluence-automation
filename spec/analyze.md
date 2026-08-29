# CR Registry Task Analysis

## Review scope and method

This analysis compares [`tasks.md`](./tasks.md) with [`plan.md`](./plan.md),
[`specification.md`](./specification.md), [`clarify.md`](./clarify.md), and the
project constitution. It assesses implementation complexity, delivery risks,
dependencies, and missing work. Complexity reflects the likely engineering
effort and uncertainty for the prototype, not only code volume.

## Task-by-task assessment

| ID | Task | Complexity | Dependencies | Key risks |
| --- | --- | --- | --- | --- |
| T-001 | Confirm Release-1 scope and pilot | Medium | None | Pilot projects, CR identification, canonical values, access model, and targets remain undecided; later changes can invalidate schema and tests. |
| T-002 | Complete requirement traceability matrix | Medium | T-001 | The current plan table is only high-level; route, module, migration, contract, and test mapping may remain incomplete. |
| T-003 | Configure monorepo workspaces | Medium | T-002 | Existing skeleton is empty; package-manager choice, TypeScript strategy, scripts, and workspace boundaries are not fully specified. |
| T-004 | Configure backend and shared packages | Medium | T-003 | Versioned stack is accepted, but exact dependency versions, module format, and shared package build strategy are absent. |
| T-005 | Add typed environment configuration | Medium | T-003 | Jira deployment/authentication and local identity behavior are unresolved; secrets may be exposed or startup behavior may diverge by environment. |
| T-006 | Run PostgreSQL 15 through Docker | Low | T-003 | Local Docker installation/path differences, volume permissions, port collisions, and unsafe default credentials can block onboarding. |
| T-007 | Create backend health and readiness endpoints | Low | T-004, T-005, T-006 | Readiness semantics, dependency timeout, response schema, and whether Jira is a readiness dependency are unspecified. |
| T-008 | Define and migrate Release-1 database schema | High | T-006, T-001 | The specification has unresolved field ownership, multi-key relationships, audit detail, snapshot reproducibility, date/time rules, and role scope. |
| T-009 | Add seed data and repository contracts | High | T-008 | Seed values depend on unresolved pilot mappings; repository interfaces can prematurely encode assumptions and integration tests need fixture strategy. |
| T-010 | Configure React 18/Vite application shell | Low | T-003, T-005 | UI library, styling/accessibility baseline, browser support, and frontend environment conventions are not selected. |
| T-011 | Add frontend routing and user context | Medium | T-010, T-007 | Authentication is deferred, but routes require a user context; a temporary local stub could accidentally become production behavior. |
| T-012 | Add shared API client and UI state conventions | Medium | T-010, T-004 | API error envelope, auth propagation, cancellation, caching, and retry semantics are not defined. |
| T-013 | Implement Jira client adapter | High | T-005, T-009 | Jira Cloud versus Server/DC, API version, JQL, permissions, rate limits, pagination limits, and retry/backoff are unresolved. |
| T-014 | Implement Jira normalization and upsert | High | T-008, T-009, T-013 | Mapping rules, required fields, unknown values, cleared fields, deleted issues, and source/manual ownership are deferred. |
| T-015 | Implement synchronization runs and jobs | High | T-013, T-014 | Scheduling, timezone, overlap locking, cancellation, retention, partial failure semantics, and reprocessing bounds are not sufficiently defined. |
| T-016 | Implement CR registry API | High | T-009, T-007 | The specification lists create and update behavior while Release 1 defers manual creation; API version, pagination limits, DTOs, and concurrency behavior are missing. |
| T-017 | Implement lifecycle and governance updates | High | T-016, T-009 | Valid transitions, terminal/reopen rules, required outcomes, role permissions, optimistic concurrency, and audit schema are unresolved. |
| T-018 | Implement minimum Release-1 authorization | High | T-016, T-001 | Clarify.md defers the canonical role model, yet this task requires a minimum model; identity, project scope, and administrator behavior must be explicitly stubbed. |
| T-019 | Implement reporting API | High | T-016, T-014 | Metric definitions, timezone, stale/overdue rules, current versus historical counts, trend windows, and consistency under synchronization are ambiguous. |
| T-020 | Build CR list and detail features | Medium | T-011, T-012, T-016, T-017 | UI requirements do not define field-level editability, conflict handling, accessibility criteria, or exact empty/error layouts. |
| T-021 | Build dashboard feature | High | T-011, T-012, T-019 | Chart library and visualization definitions are absent; performance target is only “a few seconds”; freshness/failure presentation is underspecified. |
| T-022 | Implement snapshots | High | T-019, T-018 | Aggregate-only snapshots may not be reproducible; membership, schema/report definition, source revision, uniqueness, and period boundary rules are missing. |
| T-023 | Implement CSV and shareable reports | High | T-019, T-022, T-018 | CSV columns, encoding, escaping, size/streaming, filename, share-link lifetime, revocation, and audit behavior are unresolved. |
| T-024 | Build administration feature | High | T-015, T-018, T-020 | It depends on unresolved role/access, mapping versioning, schedule semantics, validation, and configuration audit requirements. |
| T-025 | Add integration test suite | High | T-015, T-016, T-017, T-019, T-022, T-023 | No test framework, fixture contract, external-service mocking strategy, migration reset strategy, or coverage gate is specified. |
| T-026 | Add end-to-end user journey tests | High | T-020, T-021, T-022, T-023, T-024 | Browser tooling, auth fixture, seeded environment, test data isolation, and stable selectors are absent. |
| T-027 | Test failure recovery and data quality | High | T-025 | Expected diagnostic schema, retry timing, idempotency, issue retention, and database restart orchestration are not defined. |
| T-028 | Run security, performance, and observability review | High | T-025, T-026, T-027 | There is no explicit threat model, dependency scan, performance workload, SLO threshold beyond T-001, log schema, or observability backend. |
| T-029 | Document operations and pilot runbook | Medium | T-028 | Deployment target, backup/restore procedure, migration rollback, credential rotation, and support ownership are not assigned. |
| T-030 | Execute pilot and release review | High | T-028, T-029 | Pilot data access and stakeholder sign-off are external dependencies; release criteria permit exceptions without defining approval authority. |
| T-031 | Clarify and specify Release-2 decisions | High | T-030 | G-01 through G-35 are broad; no owners, prioritization, decision deadlines, or acceptance review process is assigned. |
| T-032 | Plan Release-2 implementation | Medium | T-031 | Release-2 planning may be blocked by unresolved product decisions and can duplicate the current plan unless artifacts are versioned and reconciled. |

## Dependency analysis

### Missing or questionable dependency edges

1. **T-008 should depend on explicit schema decisions, not only T-001.**
   Add a decision artifact covering field ownership, dates/timezones, audit
   events, snapshots, and access scope before migration design.
2. **T-013 should depend directly on an approved Jira integration decision.**
   T-001 does not currently guarantee Jira deployment type, API version, auth
   method, permissions, or JQL.
3. **T-016, T-017, and T-018 have a circular design pressure.** The registry API
   needs authorization and lifecycle rules, while authorization needs route and
   domain boundaries. Define contracts and policy interfaces first, then
   implement them in sequence.
4. **T-015 lacks a direct dependency on a scheduling/reprocessing design.**
   Its acceptance criteria require behavior that is explicitly deferred in G-11
   and G-12.
5. **T-019, T-022, and T-023 need a shared reporting definition artifact.**
   Otherwise each feature can calculate period, overdue, freshness, and totals
   differently.
6. **T-025 starts too late for efficient vertical slices.** The plan says each
   feature includes focused tests before the next feature, but the task list
   concentrates most integration testing after all features. Add focused unit
   and API contract tests to T-013 through T-024 or split them into tasks.
7. **T-024 depends on T-020 unnecessarily for backend configuration work.**
   Separate administration API/configuration from administration UI if the
   backend can be delivered earlier.
8. **T-028 should depend on explicit observability implementation.** Structured
   logging and correlation IDs are acceptance expectations but no task creates
   them.

## Gaps and missing artifacts

### Specification gaps that affect Release 1

The clarification log labels all G-items Release 2, but several are direct
dependencies for the current Release-1 tasks and cannot be postponed entirely:

- **G-01/G-02/G-28:** minimum authentication, authorization, project scope,
  identity stub, and audit expectations are needed for T-011, T-018, T-022,
  T-023, and T-024.
- **G-03/G-04/G-05:** Jira deployment/API/authentication, CR eligibility, and
  field mappings are required for T-001, T-008, T-013, and T-014.
- **G-06/G-07/G-08/G-10:** lifecycle, canonical values, required fields, and
  ownership rules are required for T-008, T-014, T-016, and T-017.
- **G-11/G-12/G-13:** scheduling, reprocessing, and synchronization error UX
  are required for T-015, T-024, and T-027.
- **G-14/G-15/G-16:** stale, overdue, timezone, and metric definitions are
  required for T-019 and T-021.
- **G-17/G-18:** snapshot reproducibility and export/share behavior are required
  for T-022 and T-023.

Recommended resolution: split each item into a **Release-1 minimum decision**
and a Release-2 enhancement, rather than treating the complete gap as deferred.

### Missing planning and implementation artifacts

The following artifacts are referenced or implied but do not have dedicated
tasks or files:

1. **Detailed C-05 traceability matrix** mapping every acceptance criterion to
   exact route, module, migration, contract, and test paths.
2. **Release-1 decision record** for pilot projects, Jira contract, CR eligibility,
   canonical values, ownership, lifecycle transitions, access stub, dates, and
   report metrics.
3. **API contract artifact**, including versioning, endpoint list, request/response
   schemas, error envelope, pagination, sorting, authentication context, and
   concurrency rules.
4. **Database design artifact** with an ERD or table specification, constraints,
   indexes, retention, migration policy, and snapshot membership strategy.
5. **Field-mapping catalog** for Jira source fields, conversions, defaults,
   canonical mappings, unknown values, and mapping versions.
6. **Test strategy** naming unit, contract, integration, E2E, fixture, coverage,
   and environment requirements.
7. **Security and threat model** covering secrets, authentication stub limits,
   authorization, exports, logs, Jira permissions, and abuse/rate limits.
8. **Observability specification** covering structured log fields, correlation
   IDs, metrics, synchronization run visibility, alerts, and retention.
9. **Performance test plan** defining representative data volume, query
   scenarios, synchronization volume, and measurable thresholds.
10. **Deployment/operations artifact** covering runtime target, Docker services,
    migrations, backups, restore, rollback, credential rotation, and ownership.
11. **Pilot dataset and sign-off template** for expected records, mappings,
    report totals, known exceptions, and approval evidence.
12. **Release-2 backlog mapping** assigning each C/G item an owner, priority,
    decision artifact, and implementation task.

## Contradictions and consistency findings

### Release boundary contradiction

`specification.md` still lists Confluence automation and manual CR creation in
the general in-scope requirements, while `clarify.md` and `plan.md` defer them
to Release 2. The tasks correctly omit Confluence implementation and Release-1
manual creation, but the governing specification should be revised or marked
with explicit release labels.

### Role-model contradiction

The specification names five roles, while `clarify.md` defers the canonical
role model. T-018 and several acceptance criteria still require authorization
without identifying the temporary Release-1 role set. This must be resolved as
a deliberately limited prototype policy, not left implicit.

### Traceability contradiction

`plan.md` says the detailed C-05 matrix must be completed before implementation,
but T-002 is a task and the current plan matrix remains high-level. T-003
through T-032 should remain blocked until the detailed matrix and minimum
Release-1 decisions are approved, or the plan should explicitly permit
parallel design work.

### Vertical-slice inconsistency

The plan requires each feature to include backend, persistence, frontend,
shared contracts, focused tests, and acceptance demonstration. The task list
separates these concerns and postpones broad tests to Phase 4. This is workable,
but task acceptance criteria should explicitly require focused tests for each
vertical feature.

## Recommended corrective actions

1. Add a short Release-1 decision record and make T-001 a hard gate for T-003,
   T-008, T-013, T-016, T-018, and T-019.
2. Expand T-002 into the exact C-05 acceptance-criterion matrix.
3. Add API, database, mapping, test, security, observability, performance, and
   operations artifacts as explicit tasks or deliverables.
4. Mark Release-2 items in `specification.md` so the specification, plan,
   clarification log, and tasks use the same release boundary.
5. Define a minimal, non-production authentication/access stub for Release 1
   and document its replacement boundary.
6. Add focused unit/contract tests to each vertical feature task.
7. Define an approval owner and exception policy for T-030.

## Overall assessment

The task list is structurally complete and provides good sequencing, but the
prototype is **high risk until the minimum Release-1 decisions are made**.
The largest risks are not coding complexity; they are unresolved source
integration rules, data ownership, authorization, reporting semantics, and
reproducibility. T-001 and T-002 should therefore be treated as formal
architecture/product gates rather than administrative preparation.
