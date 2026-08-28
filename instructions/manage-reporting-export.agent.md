- Create a reporting and export workflow for CR registry data across project, program, and portfolio views.
  + Input format:
    - Accept a structured request with `view`, `filters`, `metrics`, `format`, and `context`.
    - `view` is one of `project`, `program`, `portfolio`, `overdue`, `trend`, or `dashboard`.
    - `filters` may include `project`, `status`, `priority`, `owner`, `impact`, `dateRange`, and `jiraIssueKey`.
    - `metrics` may include `total`, `byStatus`, `byPriority`, `overdue`, `openedClosed`, `trend`, `recentChanges`, and `rag`.
    - `rag` is a derived metric that classifies the current open-ticket count into `red`, `amber`, or `green`.
    - `format` is one of `table`, `json`, `csv`, or `shareableReport`.
    - `context` includes `actor`, `reportingPeriod`, `timezone`, and `purpose`.
  + Processing steps:
    - Validate the requested view and supported metrics before query execution.
    - Normalize filters to the canonical CR model and apply them consistently across all calculations.
    - Aggregate data by the selected scope: project, program, or portfolio.
    - Compute required metrics with explicit definitions for overdue, open, closed, trend, and RAG calculations.
    - Apply the RAG rule to the open-ticket count: `red` when `openTickets > 20`, `amber` when `10 <= openTickets <= 20`, and `green` when `openTickets < 10`.
    - Preserve audit context by including the source data period and refresh timestamp in report metadata.
    - For CSV or shareable report output, format rows with consistent columns and readable ordering.
    - Apply sorting and grouping rules before rendering results, especially for status, priority, and date fields.
    - Return summary output plus the underlying filtered dataset when the request requires transparency.
  + Output format:
    - Return a JSON object with `status`, `view`, `message`, and `data`.
    - `status` is `success` or `error`.
    - `message` is a short summary of the generated report or export.
    - `data` contains the requested payload: summary metrics, filtered CR rows, or export-ready content.
    - For list, table, or dashboard outputs, include `rag` as a derived field alongside the count used to derive it.
    - For CSV or report exports, include `filename`, `rows`, `sourcePeriod`, and `rag` in the response metadata.
  + Constraints:
    - Keep report definitions consistent with the CR lifecycle and registry data model.
    - Do not calculate overdue or trend metrics without a valid date range or source timestamp.
    - Do not expose restricted records to users without access rights.
    - Keep exports deterministic and easy to review: stable column ordering, clear labels, and full metadata.
    - Preserve data freshness by indicating the last successful sync or refresh time in shared reports.
    - Keep output concise and actionable; avoid raw internal debug objects in user-facing reports.
    - Ensure RAG classification follows the threshold policy exactly: red = more than 20, amber = 10 to 20 inclusive, green = below 10.
