# Change Request Registry Specification

## 1. Purpose

The Change Request (CR) Registry is a Jira-first reporting and governance
application for delivery managers, project leads, and cross-project
stakeholders. It provides a normalized view of change requests across multiple
projects, combines Jira metadata with optional governance enrichment, and
supports filtering, portfolio summaries, snapshots, and exportable reports.

The system is intended to reduce manual aggregation from spreadsheets and Jira
boards while making blockers, overdue work, priority, impact, and resource
implications visible.

## 2. Scope

### In scope

- Synchronizing CR metadata from configured Jira projects and filters.
- Normalizing project-specific Jira values into a common CR model.
- Storing Jira mappings and governance-only enrichment.
- Creating, viewing, updating, and filtering CR records.
- Lifecycle tracking from creation through closure.
- Portfolio dashboards and summary reporting.
- Weekly and monthly status snapshots.
- CSV and shareable report output.
- Synchronization status, error visibility, and reprocessing.
- Role-based access for managers, project leads, and read-only stakeholders.
- Confluence automation for specified governance or report-sharing workflows.

### Out of scope

- Full workflow automation for project requests beyond CR tracking.
- Developer task-level time tracking.
- Deep custom analytics beyond summary and governance views.

## 3. Users and Permissions

| Role | Capabilities |
| --- | --- |
| Delivery manager | View portfolio data, enrich CRs, record decisions, manage snapshots and exports |
| Project lead | View and update CRs for authorized projects, add governance notes |
| Governance manager | View cross-project summaries, manage reporting and decision history |
| Read-only stakeholder | View authorized dashboards, CR details, and shared reports |
| Administrator | Configure Jira projects, filters, field mappings, schedules, and access |

Authorization MUST be enforced by the backend for every protected operation.
The frontend MUST NOT be treated as the security boundary.

## 4. Product Principles

- Jira is the primary source of truth for CR metadata whenever a corresponding
  Jira field exists.
- Manual governance enrichment MUST be distinguishable from synchronized data
  and MUST NOT be silently overwritten by synchronization.
- Inconsistent Jira statuses, priorities, and impact values MUST be mapped to
  documented canonical values.
- Failed synchronization MUST be visible and MUST NOT appear as a successful
  empty result.
- Reporting results MUST identify their filters, period, and data freshness.

## 5. User Scenarios

### Scenario US-01: Review the portfolio

**Given** the user has portfolio access,  
**when** they open the dashboard,  
**then** they can see total CR counts by project, status, priority, and impact,
including overdue items and the latest successful synchronization time.

### Scenario US-02: Filter CRs

**Given** CR records are available,  
**when** a user selects project, status, priority, owner, date range, impact, or
Jira key filters,  
**then** the list, counts, and report results reflect the same filter set.

### Scenario US-03: Inspect a CR

**Given** a user can view a CR,  
**when** they open its detail view,  
**then** they can see normalized metadata, the Jira issue mapping, source
timestamps, manual enrichment, decision notes, and decision history.

### Scenario US-04: Enrich a CR

**Given** an authorized manager or project lead is editing an authorized CR,  
**when** they save governance-only fields or decision notes,  
**then** the enrichment is validated, attributed to the editor, timestamped, and
preserved across future Jira synchronizations.

### Scenario US-05: Synchronize Jira

**Given** an administrator has configured a Jira project and field mapping,  
**when** a scheduled or manual synchronization runs,  
**then** eligible Jira issues are fetched, normalized, upserted by Jira key, and
the run records its start time, completion time, result, counts, and errors.

### Scenario US-06: Recover a failed synchronization

**Given** a synchronization failed or partially completed,  
**when** an administrator selects a project or date range for reprocessing,  
**then** the system retries that bounded scope and reports which records
succeeded, failed, or were skipped.

### Scenario US-07: Track a lifecycle decision

**Given** an authorized editor is reviewing a CR,  
**when** they change its lifecycle state or record accepted, rejected, or
deferred outcome information,  
**then** the new state is validated and the prior state and decision are retained
in an audit history.

### Scenario US-08: Create a reporting snapshot

**Given** a user has reporting access,  
**when** they select a weekly or monthly period and create a snapshot,  
**then** the system stores the filtered counts and freshness context so the
historical report remains reproducible.

### Scenario US-09: Export a report

**Given** a user has export access,  
**when** they export the current filtered results,  
**then** the system produces a CSV or shareable report containing the selected
period, filters, generated timestamp, and applicable data freshness.

## 6. Functional Requirements

### 6.1 Jira ingestion and normalization

- Administrators MUST be able to configure Jira projects, issue filters, field
  mappings, and synchronization cadence.
- The ingestion layer MUST support pagination and large Jira result sets.
- Each eligible Jira issue MUST be upserted using its Jira issue key as the
  stable external identifier.
- The normalizer MUST map project-specific statuses and priorities to the
  canonical model and retain the original source values where useful.
- Missing, malformed, or conflicting fields MUST be recorded as data-quality
  issues.
- Jira API failures, authentication failures, rate limits, and partial runs
  MUST be visible in synchronization history.

### 6.2 CR record management

- Authorized users MUST be able to create a CR when a Jira issue is not yet
  available, provided required fields and source status are explicit.
- Authorized users MUST be able to update permitted manual and governance
  fields.
- Jira-sourced fields MUST be read-only in manual editing unless an explicit
  override policy is specified.
- The system MUST flag CRs without a Jira link where a link is expected.
- The system MUST highlight stale records and records past their target date.
- All changes to lifecycle state, decision outcome, governance notes, and Jira
  mapping MUST be auditable.

### 6.3 Lifecycle

The canonical lifecycle states MUST include:

1. New
2. Under review
3. Approved
4. Rejected
5. In progress
6. On hold
7. Completed
8. Cancelled

Transitions MUST be validated. The system MUST allow accepted, rejected, or
deferred decision outcomes and retain decision notes and history.

### 6.4 Search, filtering, and views

The CR list and all reporting views MUST support filtering by:

- Project
- Lifecycle status
- Priority
- Owner
- Requested date or target date range
- Impact area
- Jira issue key or project reference

Filters MUST support deterministic pagination, clear empty states, and
consistent totals. Invalid filter values MUST return a clear validation error.

### 6.5 Reporting and dashboard

The reporting service MUST provide:

- Total CR count by project.
- CR count by lifecycle status.
- CR count by priority.
- Overdue CRs.
- CRs opened or closed during a selected period.
- Trend summaries over time.
- Synchronization freshness and failure indicators.

Dashboard queries SHOULD refresh within a few seconds for typical filtered
portfolio views. Report calculations MUST use normalized, validated records.

### 6.6 Snapshots and exports

- Users with reporting access MUST be able to create weekly or monthly
  snapshots.
- A snapshot MUST preserve its period, filters, aggregate values, creation
  timestamp, and data freshness context.
- CSV exports MUST include stable column names and dates in a documented format.
- Shareable reports MUST avoid exposing data beyond the requesting user's
  authorization scope.
- Export failures MUST be reported to the user and logged.

### 6.7 Confluence automation

Where enabled by project configuration, the system MAY publish approved
governance snapshots or shareable reports to Confluence. Publication MUST
respect destination permissions, identify the source snapshot, and report
success or failure without losing the stored snapshot.

### 6.8 Administration

Administrators MUST be able to manage:

- Jira project and filter inclusion.
- Jira-to-canonical field mappings.
- Synchronization cadence.
- Canonical value mappings for status, priority, and impact.
- Reprocessing scope and synchronization history.
- Authorized roles and project access.

## 7. Data Model

### 7.1 Change Request

```text
CR {
  id: string
  title: string
  project: string
  status: enum
  owner: string
  impact: string
  priority: string
  requestedDate: date
  targetDate: date | null
  summary: string
  decisionNotes: string | null
  decisionOutcome: accepted | rejected | deferred | null
  jiraIssueKey: string | null
  jiraProjectKey: string | null
  sourceValues: object
  lastSyncedAt: datetime | null
  lastUpdated: datetime
  createdAt: datetime
}
```

### 7.2 Supporting entities

- **Project configuration:** project key, enabled flag, issue filter, field
  mappings, synchronization cadence, and access scope.
- **Synchronization run:** scope, status, timestamps, processed count,
  created count, updated count, skipped count, error count, and error details.
- **Decision history:** CR, prior and new status/outcome, notes, actor,
  timestamp, and source.
- **Status snapshot:** period, filters, aggregate values, source freshness,
  creator, and creation timestamp.
- **User access:** user identity, role, and authorized project scope.
- **Data-quality issue:** CR or synchronization run, field, severity,
  description, status, and resolution metadata.

## 8. API and Integration Contracts

The Express backend MUST expose versioned JSON APIs for:

- CR list, detail, create, and update operations.
- Filter options and canonical value mappings.
- Dashboard summaries, trends, overdue results, and period comparisons.
- Snapshot creation and retrieval.
- CSV/shareable report generation.
- Synchronization status, manual execution, and bounded reprocessing.
- Administration of Jira project and field configuration.
- Authentication, authorization, and current-user context.

API responses MUST use consistent success and error shapes, validate input, and
return appropriate HTTP status codes. The React client MUST consume shared
contracts rather than duplicating domain definitions.

## 9. Non-Functional Requirements

### Performance

- Support multiple active projects and a portfolio of at least 150 people.
- Typical filtered dashboard views SHOULD complete within a few seconds.
- Large Jira exports MUST be paginated and processed without blocking
  interactive requests.

### Reliability

- Synchronization MUST run on a configured cadence and support manual runs.
- Runs MUST be idempotent for the same Jira issue and source revision.
- Failures MUST be logged, visible, and reprocessable.
- Database migrations MUST be repeatable and reviewed.

### Security

- Backend authorization MUST enforce role and project scope.
- Secrets MUST be provided through environment or secret-management facilities.
- Jira, Confluence, and database credentials MUST NOT be committed or logged.
- Logs and exports MUST avoid unnecessary sensitive data.
- Shareable reports MUST be authorization-scoped.

### Data quality

- Required fields MUST be enforced at API and database boundaries.
- Missing Jira links, stale records, overdue target dates, and unmapped source
  values MUST be surfaced.
- Synchronization MUST retain enough source context to diagnose mapping issues.

## 10. Acceptance Criteria

1. Users can create, update, view, and filter CRs by all specified dimensions.
2. Jira metadata is automatically loaded from configured projects and mapped
   into the normalized CR model.
3. Manual governance enrichment survives subsequent synchronization.
4. The dashboard provides project, status, priority, overdue, period, and trend
   summaries from current normalized data.
5. Weekly and monthly snapshots preserve their reporting context.
6. Reports can be exported as CSV or a properly scoped shareable report.
7. A CR lifecycle can be tracked from New through closure or cancellation with
   decision history.
8. Failed synchronizations are visible and can be reprocessed for a project or
   date range.
9. Role-based permissions prevent unauthorized edits and data exposure.
10. The system meets the target portfolio and typical dashboard response
    expectations.

## 11. Assumptions and Open Decisions

- The exact Jira projects, issue types, custom fields, and CR identification
  rules must be confirmed before implementation.
- The canonical priority and impact vocabularies must be agreed with project
  stakeholders.
- The authentication provider and user-to-project access source must be
  selected during technical planning.
- The Confluence publication format, destination spaces, and page ownership
  rules require confirmation.
- The reporting timezone, date format, and definition of “stale” require
  explicit configuration.
- A pilot with two or three projects should validate mappings and data quality
  before portfolio-wide rollout.
