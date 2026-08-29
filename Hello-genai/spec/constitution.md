# CR Registry Constitution

## Purpose

This constitution governs the design and implementation of the Jira/Confluence
automation project described in [`project_spec.md`](../project_spec.md). It is
the durable set of principles against which specifications, plans, code, and
reviews are evaluated.

## Technical Baseline

- **Frontend:** React 18 with Vite.
- **Backend:** Node.js with Express.
- **Database:** PostgreSQL 15, run locally and in development through Docker.
- **Integration:** Jira is the primary source of truth for CR metadata.
  Confluence is an automation and knowledge-sharing surface where specified.
- **Architecture:** Keep frontend, backend, shared contracts, persistence,
  integrations, reporting, and scheduled jobs as separately testable
  boundaries.

## Principles

### 1. Specification Before Implementation

User-visible behavior, data contracts, acceptance criteria, and important edge
cases MUST be specified before implementation. Ambiguities MUST be resolved or
recorded as explicit assumptions. A change that alters behavior MUST update its
specification and tests.

### 2. Jira-First Data Integrity

Jira MUST remain the authoritative source for CR metadata whenever the source
field exists. The system MUST preserve the mapping between registry records and
Jira issue keys, distinguish synchronized values from manual enrichment, and
avoid silently overwriting governance data. Conflicting or incomplete source
data MUST be surfaced for review.

### 3. Explicit Domain Model

The normalized CR model MUST use a consistent schema and controlled lifecycle
states, including New, Under review, Approved, Rejected, In progress, On hold,
Completed, and Cancelled. Required fields MUST be validated at API boundaries
and persistence boundaries. Dates, statuses, priorities, impacts, and
identifiers MUST have documented semantics.

### 4. Secure Access by Default

Access MUST be restricted according to role. Editing CR metadata and governance
notes requires explicit authorization; broader stakeholders receive read-only
access. Credentials, Jira tokens, database passwords, and other secrets MUST
come from environment or secret-management facilities and MUST NOT be committed
to source control or logs.

### 5. Observable and Recoverable Automation

Scheduled synchronization and Confluence/Jira automation MUST provide structured
logging, visible failure states, and reprocessing for a project or date range.
Integrations MUST use bounded retries, clear timeouts, and idempotent updates
where practical. Failures MUST not be represented as successful empty results.

### 6. Reliable Reporting

Dashboard and export results MUST be derived from validated, normalized data.
Filtering MUST be consistent across list, summary, trend, overdue, and export
views. Reports MUST identify their time range and data refresh context so that
governance decisions are auditable.

### 7. Performance for the Target Portfolio

The design MUST support multiple active projects and a portfolio of at least
150 people. Typical filtered dashboard views SHOULD refresh within a few
seconds. Large Jira responses MUST be paginated, processed efficiently, and
persisted without blocking interactive requests.

### 8. Testable, Maintainable Boundaries

Business rules MUST be testable independently from HTTP, React rendering,
Jira, Confluence, Docker, and PostgreSQL infrastructure. API contracts and
shared types MUST be kept consistent between frontend and backend. Changes
MUST include focused tests for new behavior and regression coverage for
affected acceptance criteria.

### 9. Prototype Scope Discipline

The project MUST prioritize CR tracking, governance views, Jira/Confluence
automation, summaries, snapshots, and CSV/shareable reporting. Full workflow
automation beyond CR tracking, developer task-level time tracking, and deep
custom analytics remain out of scope unless separately specified and approved.

## Development Workflow

Every feature MUST follow this sequence:

1. Define or update the user-facing specification.
2. Clarify assumptions, domain rules, permissions, and failure behavior.
3. Produce a technical plan covering affected boundaries and data changes.
4. Break the plan into verifiable implementation tasks.
5. Implement the smallest complete vertical slice.
6. Validate acceptance criteria, tests, security, observability, and data quality.
7. Record synchronization, reporting, or governance implications.

## Quality Gates

A change is complete only when:

- Relevant acceptance criteria are demonstrably satisfied.
- Unit, integration, and end-to-end coverage is added or updated as appropriate.
- Validation and authorization occur at the correct boundaries.
- Synchronization failures are visible and recoverable.
- No secrets or sensitive Jira/Confluence data are committed or exposed in logs.
- PostgreSQL migrations are repeatable and reviewed.
- The React frontend and Express backend agree on API contracts.
- Documentation and operational configuration are updated when behavior changes.

## Governance

This constitution is reviewed whenever the architecture, data authority,
security model, technology baseline, or project scope changes. Any exception
MUST be documented with its rationale, impact, owner, and an expiry or review
date. In a conflict, security, data integrity, and explicit acceptance
criteria take precedence over convenience.
