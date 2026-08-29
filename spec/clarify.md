# Specification Clarification Review

## Review scope

This review compares [`constitution.md`](./constitution.md) with
[`specification.md`](./specification.md) as a senior implementation review.
The documents are directionally consistent, but the following issues should be
resolved before implementation begins.

## Contradictions and inconsistencies

### C-01: Confluence publication deferred to the second release

- The constitution describes Confluence as an integration surface and includes
  Confluence automation in the initial scope.
- The specification makes publication optional with “MAY publish”.

**Decision:** Confluence publication is parked for the second release. It is
not a first-release acceptance criterion or implementation dependency. The
constitution and specification should be updated to describe Confluence
publication as a later-release capability when those documents are next
revised.

### C-02: Manual CR creation conflicts with Jira-first authority (Release 2)

- The constitution says Jira is authoritative when a corresponding field exists.
- The specification allows creating a CR before a Jira issue exists, but does
  not define which fields are provisional or how the later Jira issue is linked.

**Decision:** Defer manual CR creation and its provisional-record rules to
release 2. The first release should synchronize and manage CRs that have an
established Jira source.

### C-03: Role names and responsibilities are not fully consistent (Release 2)

- The constitution names delivery managers, project leads, managers, team leads,
  and read-only stakeholders.
- The specification adds “Governance manager” and “Administrator”, while
  “manager” and “governance manager” are not clearly equivalent.

**Decision:** Defer the canonical role model, role inheritance, and
multi-role behavior to release 2.

### C-04: Versioned stack is absent from the specification (Accepted)

- The constitution requires React 18, Vite, PostgreSQL 15, Docker, Node.js, and
  Express.
- The specification defines Express and React API responsibilities but does not
  repeat or constrain the required versions.

**Decision:** Accepted. The specification inherits the technical baseline from
the constitution. Detailed dependency pins belong in package manifests and the
implementation plan.

### C-05: Folder conventions are not tied to deliverables

- The constitution requires a monorepo and specific boundaries.
- The specification does not identify which functional requirements belong to
  which frontend feature, backend service, shared package, job, or migration.

**Action needed:** Add a traceability mapping from major requirements to
repository boundaries before implementation begins.

## Functional gaps

All G-xx functional gaps below are explicitly deferred to release 2. They are
recorded for backlog and future specification work, but are not blockers for
the release-1 implementation unless a dependency is discovered during
planning.

### G-01: Authentication mechanism is undefined (Release 2)

The specification requires authentication and current-user context but does
not define the identity provider, login flow, session/token model, logout,
token expiry, account provisioning, or local-development behavior.

### G-02: Authorization scope is undefined (Release 2)

“Authorized projects” and “portfolio access” are not defined. It is unclear
whether access is assigned per project, Jira group, application role, team,
Confluence space, or a combination. Cross-project and administrator access
rules are also missing.

### G-03: Jira API contract is incomplete (Release 2)

The specification does not define Jira deployment type (Cloud or Server/DC),
API version, authentication method, endpoint strategy, JQL/issue-type rules,
rate-limit handling, pagination limits, or required Jira permissions.

### G-04: CR identification rules are missing (Release 2)

The specification acknowledges that CRs must be distinguished from standard
Jira tickets but does not define the issue type, label, custom field, JQL, or
manual inclusion rule that identifies an eligible CR.

### G-05: Field mapping behavior is incomplete (Release 2)

Required Jira fields, custom-field identifiers, type conversions, defaults,
canonical mappings, unmapped-value behavior, and mapping versioning are not
specified. It is also unclear which fields are authoritative when a Jira field
is empty.

### G-06: Status transition rules are missing (Release 2)

All lifecycle states are listed, but valid transitions, terminal-state
behavior, reopening rules, required decision outcomes, and who may perform each
transition are undefined.

### G-07: Priority and impact vocabularies are undefined (Release 2)

Priority is modeled as a string and impact as a string, while the constitution
requires documented canonical values. No allowed values, ordering, mapping, or
unknown-value behavior is specified.

### G-08: Required-field rules are not explicit (Release 2)

The specification says required fields must be validated but does not identify
which fields are required for synchronized records, manually created records,
updates, or each lifecycle transition.

### G-09: Multi-Jira-key relationships are not modeled (Release 2)

The source requirements refer to related Jira issue(s), while the CR model has a
single `jiraIssueKey`. The relationship cardinality, primary issue, linked
issues, and synchronization behavior are unclear.

### G-10: Data ownership and synchronization merge rules are incomplete (Release 2)

The model does not identify ownership per field, how deletions or Jira issue
removals are handled, what happens when a source field is cleared, or how
manual edits are protected from later synchronization.

### G-11: Synchronization scheduling is underspecified (Release 2)

Cadence is configurable, but supported schedules, timezone, overlap locking,
concurrency, timeout, retry policy, backoff, cancellation, and run retention
are not defined.

### G-12: Reprocessing semantics are incomplete (Release 2)

Project/date-range reprocessing is required, but the date field, inclusive
boundaries, maximum range, dry-run option, idempotency behavior, and treatment
of records outside the current Jira result are unspecified.

### G-13: Synchronization status and error UX is undefined (Release 2)

The required error visibility has no defined API response, UI location, severity
model, acknowledgement flow, alerting, or retention policy.

### G-14: Stale and overdue definitions are missing (Release 2)

“Stale” has no duration or reference timestamp. “Overdue” is not defined for
null target dates, completed/cancelled records, timezone boundaries, or future
date corrections.

### G-15: Date and timezone rules are incomplete (Release 2)

The specification leaves reporting timezone and date format open but does not
define storage timezone, display timezone, locale, daylight-saving behavior, or
whether requested/target dates are date-only values.

### G-16: Reporting metric definitions are ambiguous (Release 2)

“Opened”, “closed”, “trend”, “period”, “total”, and “overdue” lack precise
definitions. It is unclear which timestamp and status transitions determine
inclusion, and whether counts use current state or historical state.

### G-17: Snapshot data model is insufficiently precise (Release 2)

A snapshot stores aggregate values but does not say whether it also stores the
underlying CR membership, schema/version, report definition, or source revision.
Reproducibility cannot be guaranteed if records later change.

### G-18: Export behavior is incomplete (Release 2)

CSV columns, escaping, encoding, maximum size, streaming/download behavior,
filename convention, sorting, and error handling are unspecified. “Shareable
report” has no format, lifetime, URL access model, revocation, or audit rule.

### G-19: Confluence publication contract is missing (Release 2)

Destination space/page rules, page creation versus update, title convention,
content format, duplicate handling, permissions, authentication, retries, and
rollback behavior are undefined.

### G-20: Audit requirements are incomplete (Release 2)

The specification requires decision history and auditable changes but does not
define the audit event schema, immutable fields, actor identity, source,
retention, visibility, or whether synchronization changes are audited.

### G-21: Data-quality issue lifecycle is incomplete (Release 2)

Severity and status are mentioned but allowed values, ownership, resolution
workflow, deduplication, and whether unresolved issues block reporting are not
defined.

### G-22: Delete, archive, and retention behavior is missing (Release 2)

There are no requirements for deleting or archiving CRs, Jira issues, users,
snapshots, synchronization runs, audit history, exports, or data-quality
issues. Retention and privacy erasure behavior are absent.

### G-23: Concurrency and conflict handling is missing (Release 2)

The requirements do not define optimistic locking, stale update detection,
simultaneous edits, synchronization-versus-manual-edit races, or duplicate
manual CR creation.

### G-24: API details are too abstract for implementation (Release 2)

Versioned APIs are required, but resources, routes, request/response schemas,
pagination format, filtering syntax, error codes, sorting, idempotency keys,
HTTP caching, and maximum payload sizes are unspecified.

### G-25: Validation and error behavior lacks examples (Release 2)

The specification requires clear validation errors but does not define a common
error shape, field-level error format, status codes, or behavior for partial
success in batch synchronization and exports.

### G-26: Frontend UX requirements are missing (Release 2)

There are no requirements for navigation, loading states, empty states,
permission-denied states, error recovery, responsive behavior, accessibility,
keyboard support, browser support, or visualization types.

### G-27: Performance target is not measurable enough (Release 2)

“Within a few seconds” and “large Jira responses” need measurable targets:
dataset size, percentile, concurrent users, query timeout, synchronization
throughput, and export completion limits.

### G-28: Observability requirements are incomplete (Release 2)

Structured logging is required by the constitution, but metrics, tracing,
correlation IDs, health/readiness endpoints, alert thresholds, and sensitive
field redaction are not specified.

### G-29: Availability and backup requirements are absent (Release 2)

There are no uptime, recovery point objective, recovery time objective, backup,
restore, disaster recovery, or database migration rollback requirements.

### G-30: PostgreSQL design constraints are missing (Release 2)

The entity list does not define keys, constraints, indexes, foreign keys,
uniqueness, JSON usage, enum strategy, migrations tooling, or connection-pool
behavior. The `sourceValues: object` field needs a persistence representation.

### G-31: Docker and deployment behavior is undefined (Release 2)

The constitution requires Docker for local PostgreSQL, but the specification
does not define services, ports, volumes, health checks, startup ordering,
environment variables, production deployment, or whether backend jobs run as a
separate process.

### G-32: Testing scope and release gates are not measurable (Release 2)

The constitution requires focused and regression tests, but the specification
does not define unit/integration/E2E boundaries, Jira/Confluence mocks,
required acceptance-test coverage, test data, or CI quality gates.

### G-33: External dependency failure behavior is incomplete (Release 2)

Behavior for Jira, Confluence, database, authentication, and network outages is
not defined for reads, writes, synchronization, reports, or exports.

### G-34: Configuration and environment separation is missing (Release 2)

Required configuration keys, defaults, validation, development/test/production
differences, secret rotation, and startup failure behavior are unspecified.

### G-35: Security and privacy controls need detail (Release 2)

The documents do not define transport encryption, CORS/CSRF protection,
security headers, input/output sanitization, rate limiting, dependency scanning,
PII classification, or export/audit access logging.

## Unclear terminology and decisions

### U-01: “Project” has multiple meanings

It may mean a Jira project, an application project configuration, or a
portfolio/program. Define canonical identifiers and terminology.

### U-02: “Owner” is undefined

Specify whether owner is a Jira user, application user, team, free-form string,
or synchronized field, and define behavior when the owner is inactive.

### U-03: “Impact” is undefined

Clarify whether impact is a single value, multiple areas, severity, or a
free-form description. The requirements use both “impact” and “impact area”.

### U-04: “Decision outcome” and lifecycle status overlap

Approved/Rejected states overlap with accepted/rejected outcomes, while
deferred has no lifecycle state. Define whether outcome and status are
independent fields and their allowed combinations.

### U-05: “Shareable report” is undefined

Clarify whether this means a Confluence page, a public link, an authenticated
link, a downloadable HTML/PDF file, or an in-app view.

### U-06: “Current data” is undefined

Clarify whether dashboards read directly from Jira, the last successful local
sync, or a mixed source, and how freshness is communicated.

### U-07: “Source revision” is undefined

Define the Jira revision or synchronization watermark used to satisfy
idempotency and diagnose updates.

### U-08: “Approved governance snapshot” lacks approval semantics

Define who approves a snapshot, whether approval is immutable, and whether
publication is allowed only after approval.

### U-09: “Portfolio access” lacks a boundary

Define whether it covers all projects, an assigned portfolio, or only projects
visible through Jira permissions.

### U-10: “Typical filtered view” and “large export” lack thresholds

Add representative record counts, payload sizes, concurrent-user assumptions,
and measurable response/completion targets.

## Recommended resolution order

1. Add the C-05 traceability mapping from requirements to repository boundaries.
2. Confirm the release-1 scope and identify any dependencies that must be
   pulled forward from the release-2 backlog.
3. Schedule C-02 and C-03 for release-2 clarification.
4. Schedule all G-xx items for release-2 specification work.
