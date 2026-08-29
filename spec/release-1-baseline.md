# Release-1 Baseline and Pilot Scope

**Status:** Proposed implementation baseline  
**Related task:** T-001 in [`tasks.md`](./tasks.md)  
**Related plan milestone:** M0 in [`plan.md`](./plan.md)  
**Pilot Jira project:** `MOD17`

This document records the minimum Release-1 decisions needed to begin
implementation. Items marked **provisional** are intentionally limited to the
prototype and must not be treated as the final Release-2 product policy.

## 1. Pilot scope

The first pilot contains one Jira project:

| Item | Release-1 decision |
| --- | --- |
| Jira project key | `MOD17` |
| Project count | One approved pilot project |
| Synchronization scope | Issues returned by the configured pilot JQL |
| Data ownership | Jira owns synchronized metadata; the registry owns governance enrichment |
| Rollout boundary | No other Jira projects are enabled until pilot review is complete |

The pilot is intended to validate ingestion, normalization, data quality,
reporting totals, snapshots, exports, and access protection before expanding to
additional projects.

## 2. Jira issue eligibility

The pilot will use a configured JQL filter rather than synchronizing every issue
in `MOD17`.

**Provisional Release-1 eligibility rule**

- Project must equal `MOD17`.
- Issue type must equal `Change Request`.
- The issue must be visible to the configured Jira integration account.
- Closed or cancelled issues remain eligible so that lifecycle and reporting
  history are retained.
- Subtasks and unrelated issue types are excluded.

The issue type name and JQL must be verified against the actual Jira project
before the first live synchronization. If `Change Request` is not available,
the pilot must choose an approved equivalent issue type or an explicit label
rule; implementation must not silently broaden the query.

**Pilot JQL placeholder**

```text
project = MOD17 AND issuetype = "Change Request" ORDER BY key ASC
```

## 3. Required source fields

The first synchronization must request and retain these Jira fields:

| Jira source | Normalized CR field | Rule |
| --- | --- | --- |
| `key` | `jiraIssueKey` | Required stable external identifier |
| `project.key` | `jiraProjectKey` / `project` | Must be `MOD17` |
| `summary` | `title` | Required; empty values create a data-quality issue |
| `description` | `summary` or source context | Retain according to configured privacy policy |
| `status.name` | `status` | Map to the canonical lifecycle value |
| `priority.name` | `priority` | Map to the pilot canonical value |
| `assignee` | `owner` | Preserve source identity; null is reported |
| `created` | `requestedDate` | Normalize to the configured reporting timezone |
| Target-date field | `targetDate` | Null is allowed; field identifier is configuration |
| `updated` | source timestamp | Retain for synchronization diagnostics |

Configured custom fields must be listed in the field-mapping catalog before the
live pilot. Unknown or unmapped values are retained in `sourceValues` and
reported as data-quality issues; they are not silently discarded.

## 4. Canonical Release-1 values

### Lifecycle

The pilot uses the constitution's canonical values:

`New`, `Under review`, `Approved`, `Rejected`, `In progress`, `On hold`,
`Completed`, `Cancelled`.

Release-1 synchronization maps source statuses to these values. Any source
status without an approved mapping is retained as a data-quality issue and
prevents the record from being treated as fully validated.

### Priority and impact

The specification requires canonical mappings but does not define the
vocabulary. For the pilot, use the following **provisional** ordered values
unless the project owner approves a different mapping before implementation:

- Priority: `Low`, `Medium`, `High`, `Critical`, `Unknown`
- Impact: `Low`, `Medium`, `High`, `Unknown`

Unknown or empty source values map to `Unknown` and create a data-quality issue.
The final vocabulary and source mappings remain a Release-2 decision under
G-05 and G-07.

### Dates and reporting

- Persist timestamps in UTC.
- Treat requested and target dates as date values after conversion from Jira.
- Use ISO 8601 dates in API and CSV output.
- Use UTC for the prototype reporting boundary until a stakeholder timezone is
  approved.
- A record is overdue when `targetDate` is before the current reporting date and
  status is neither `Completed` nor `Cancelled`.
- A null target date is not overdue, but is surfaced as incomplete data.

These are minimum pilot rules, not the final stale/overdue policy.

## 5. Minimum Release-1 access boundary

Authentication remains behind an adapter boundary as required by the
clarification log. The prototype uses a controlled local identity stub with
backend authorization enabled:

| Prototype identity | Allowed scope |
| --- | --- |
| `pilot-admin` | Configure `MOD17`, synchronize, reprocess, view and export pilot data |
| `pilot-manager` | View and enrich CRs in `MOD17`, create snapshots, export pilot data |
| `pilot-reader` | Read authorized `MOD17` registry, dashboard, snapshots, and reports |

The stub must be disabled or replaced by the selected identity provider before
production use. The backend remains the security boundary; frontend route guards
are convenience only. No cross-project access is enabled in Release 1.

## 6. Required environment configuration

The following configuration keys are required by the Release-1 baseline. Values
belong in local environment configuration or a secret manager, never in source:

| Variable | Purpose | Secret |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | No |
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `JIRA_BASE_URL` | Jira instance URL | No |
| `JIRA_AUTH_METHOD` | Configured Jira authentication mode | No |
| `JIRA_USER_EMAIL` | Jira integration identity when required | No |
| `JIRA_API_TOKEN` | Jira integration credential when required | Yes |
| `JIRA_PROJECT_KEYS` | Enabled pilot projects; initially `MOD17` | No |
| `JIRA_PILOT_JQL` | Eligibility query | No |
| `SYNC_CRON` | Synchronization cadence | No |
| `SYNC_TIMEZONE` | Scheduler timezone | No |
| `APP_AUTH_MODE` | Local stub or external adapter mode | No |
| `APP_CORS_ORIGIN` | Allowed frontend origin | No |
| `VITE_API_BASE_URL` | Frontend API base URL | No |

The exact Jira authentication variables must match the selected Jira deployment
and authentication method before live use.

## 7. Acceptance dataset

The pilot dataset must include:

- At least 20 representative `MOD17` issues, including each mapped lifecycle
  state used by the pilot.
- At least one record for each configured priority and impact value.
- At least one null target date and one overdue target date.
- At least one unmapped or malformed source value to verify data-quality handling.
- At least one issue with a governance enrichment that survives a second sync.
- A repeatable fixture containing Jira responses and expected normalized records.

The dataset must be sanitized and must not contain production credentials or
unnecessary personal data. The pilot review records the actual issue count,
mapping exceptions, and expected report totals.

## 8. Measurable pilot targets

These targets define the Release-1 verification baseline:

| Measure | Target |
| --- | --- |
| Filtered dashboard response | p95 no more than 3 seconds for 500 normalized CRs and 10 concurrent read users |
| CR list response | p95 no more than 2 seconds for a page of 50 records under the same dataset |
| Pilot synchronization | 500 Jira issues processed within 5 minutes under normal Jira availability |
| Idempotent repeat synchronization | No duplicate CRs and no governance-field loss |
| Failure visibility | A failed or partial run appears in history and API responses within 30 seconds of run completion |
| Reprocessing | A bounded 100-issue reprocessing request reports succeeded, failed, and skipped outcomes |
| Data quality | 100% of intentionally malformed fixture values produce queryable data-quality issues |

If the live pilot cannot meet a target, the exception must include the measured
result, cause, owner, mitigation, and approval before Release-1 sign-off.

## 9. Release boundary

Included in this baseline:

- Jira synchronization for `MOD17`
- Normalization, upsert, registry views, governance enrichment, lifecycle
  history, dashboard/reporting, snapshots, CSV/shareable output, reprocessing,
  and minimum backend-enforced access

Explicitly excluded from Release 1:

- Confluence publication
- Manual CR creation before a Jira issue exists
- The final multi-role model and role inheritance
- The complete G-01 through G-35 clarification backlog
- Portfolio-wide rollout beyond `MOD17`

The specification and constitution should be updated in a later documentation
pass to show these release labels consistently.

## 10. T-001 completion checklist

- [x] Pilot project identified as `MOD17`.
- [x] Pilot scope is explicitly limited to one project.
- [x] Issue type and JQL eligibility assumptions are documented.
- [x] Required Jira fields and normalization rules are documented.
- [x] Canonical lifecycle, priority, impact, and date rules are documented.
- [x] Minimum access boundary and authentication-stub boundary are documented.
- [x] Required environment variables are listed without secrets.
- [x] Acceptance dataset requirements are measurable.
- [x] Dashboard and synchronization targets are measurable.
- [ ] Jira issue type, custom field identifiers, and live JQL verified against the
  `MOD17` Jira project.
- [ ] Product owner approves provisional priority, impact, date, and performance
  targets.
