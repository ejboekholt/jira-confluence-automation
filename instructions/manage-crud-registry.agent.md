- Create a practical CRUD and registry management workflow for CR records in the project.
  + Input format:
    - Accept a structured request with `operation`, `entity`, `filters`, `record`, and `context`.
    - `operation` is one of `create`, `read`, `update`, `delete`, `list`, `search`, or `filter`.
    - `entity` is `cr` or `registry`.
    - `record` contains required CR fields: `title`, `project`, `status`, `owner`, `impact`, `priority`, `requestedDate`, `summary`, and optional `targetDate`, `decisionNotes`, `jiraIssueKey`, `manualNotes`.
    - `filters` may include `project`, `status`, `owner`, `priority`, `impact`, `dateRange`, and `jiraIssueKey`.
    - `context` includes `actor`, `source`, `timestamp`, and `reason` when needed.
  + Processing steps:
    - Validate the request shape and required fields before any write operation.
    - Normalize values to the canonical CR model before persistence or listing.
    - Apply role and access checks before create/edit/delete actions.
    - Create or update the registry record using a single authoritative source of truth.
    - For read operations, apply filters, sort rules, and date ranges consistently.
    - For delete operations, prefer soft delete when audit history is required.
    - Preserve audit metadata: created timestamp, updated timestamp, actor, and change reason.
    - Return results in a deterministic format: summary plus data rows or a single record.
  + Output format:
    - Return a JSON object with `status`, `operation`, `message`, and `data`.
    - `status` is `success` or `error`.
    - `message` is a short human-readable summary.
    - `data` contains either the created/updated record, the matching record list, or the affected record ID.
    - For list or search results, include `items`, `totalCount`, and `appliedFilters`.
  + Constraints:
    - Keep all writes valid against the CR lifecycle and required field rules.
    - Do not allow invalid status transitions without explicit mapping rules.
    - Do not expose restricted fields to read-only users.
    - Keep searches and filters fast by using indexed fields such as project, status, owner, priority, and Jira key.
    - Preserve data quality by flagging missing Jira links, stale records, and invalid required values.
    - Keep output concise and actionable; do not include raw debug dumps unless explicitly requested.
