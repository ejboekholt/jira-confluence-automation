# Weekly Status Report Generator Tasks

This task list breaks the implementation plan into executable work items for the v1 release. Each item includes a title, description, acceptance criteria, and dependency list.

## Task 1: Initialize the backend project skeleton

Description:
Set up the Node.js + Express backend and the minimum application structure for the weekly status report generator. The backend should remain intentionally small and should not include a database in v1.

Acceptance criteria:
- A working Express application starts successfully in local development.
- The backend contains separate app, server, route, controller, and service modules.
- A `/api/health` endpoint responds successfully.
- No database layer is added for the v1 scope.

Dependencies:
- None

---

## Task 2: Configure Jira connectivity and local environment

Description:
Add the minimal configuration needed to connect the backend to Jira for the Shell SSW project. Keep the configuration static and minimal, with no role-based access or extra infrastructure.

Acceptance criteria:
- Required Jira settings are defined in environment variables or a minimal config file.
- The backend can make a valid Jira API request using the configured credentials.
- Local setup instructions are clear and do not require additional runtime complexity.

Dependencies:
- Task 1

---

## Task 3: Fetch Jira issues for the correct project and time window

Description:
Implement the Jira query logic to pull only the issues relevant to the weekly report: project `SHELSSW`, last 7 calendar days, and required field data for the result list.

Acceptance criteria:
- The backend requests issues only from the `SHELSSW` project.
- Only issues updated in the last 7 calendar days are included.
- The backend retrieves the fields required for final report rendering.
- Any non-project or unrelated issue data is excluded before formatting.

Dependencies:
- Task 2

---

## Task 4: Apply v1 issue filters

Description:
Implement the exact v1 filtering rules used for the weekly status report: only Story issues and only the statuses `To Do`, `In Progress`, and `Done`.

Acceptance criteria:
- Only Story issues are included in the report.
- Only `To Do`, `In Progress`, and `Done` are included.
- Closed items remain in the same flat list as active items.
- No summary logic, grouping, or extra filtering is added.

Dependencies:
- Task 3

---

## Task 5: Transform Jira data into the report model

Description:
Normalize the Jira results into the exact data model required for the weekly report: issue key, summary, status, assignee, and last update timestamp.

Acceptance criteria:
- Each output item contains the required five fields.
- Missing assignee or update values are handled predictably and remain visible in the payload.
- The data shape matches the planned output contract for the frontend.
- No extra analytics or computed values are added.

Dependencies:
- Task 4

---

## Task 6: Implement the plain-text report formatter

Description:
Transform the filtered issue list into a plain-text email draft for the stakeholder report. The output should remain one page and factual.

Acceptance criteria:
- The output is plain text suitable for email copy/paste.
- Each item includes issue key, summary, status, assignee, and last update.
- The result contains no summary block, no group headings, and no risk or score logic.
- The format is consistent and readable in a standard mail client.

Dependencies:
- Task 5

---

## Task 7: Expose the generate report API endpoint

Description:
Add the backend endpoint that generates the report and sends the report payload back to the frontend. If Jira data retrieval fails, the endpoint should return the raw system error.

Acceptance criteria:
- `POST /api/reports/generate` exists and returns the generated report payload.
- The response includes subject, team name, generated time, issue list, and body text.
- On Jira failure, the raw error message is returned directly in the response.
- There is no database or auth flow added for v1.

Dependencies:
- Task 6

---

## Task 8: Initialize the React + Vite frontend

Description:
Set up the React 18 + Vite frontend app and base shell for the report workflow. Keep the app focused on a single report screen with minimal structure.

Acceptance criteria:
- The frontend starts successfully in local development.
- The app uses React 18 and Vite.
- The project contains a basic shell and page layout for the report workflow.
- No login, role model, or unrelated screens are introduced.

Dependencies:
- None

---

## Task 9: Build the weekly report page UI

Description:
Create the single-page UI that lets the delivery manager generate a report and review the resulting plain-text draft.

Acceptance criteria:
- The page shows a title and a `Generate weekly report` button.
- A preview area displays the generated email draft.
- The page remains intentionally simple and does not include dashboard or analytics elements.
- The layout supports copy/paste into email without additional UI complexity.

Dependencies:
- Task 8

---

## Task 10: Connect the frontend to the backend endpoint

Description:
Wire the generate button to the backend report API so the user can trigger the report generation from the UI immediately.

Acceptance criteria:
- Clicking the button triggers a request to `/api/reports/generate`.
- A loading state is shown while the report is being generated.
- The response data is displayed in the preview pane.
- The user can regenerate the report at any time with the same button.

Dependencies:
- Task 7
- Task 9

---

## Task 11: Implement plain error handling in the UI

Description:
Handle any Jira or backend failure state so the user sees the raw system error message without additional formatting or misleading fallback content.

Acceptance criteria:
- If the backend returns an error, the UI displays the raw error message.
- The error appears in a simple visible state rather than hiding the failure.
- The user can retry the report generation after the error occurs.

Dependencies:
- Task 10

---

## Task 12: Run end-to-end smoke tests for the v1 workflow

Description:
Verify the full manual report workflow from button click through Jira fetch, filtering, formatting, and preview display.

Acceptance criteria:
- The app loads correctly.
- The user can generate the weekly report with one click.
- The preview shows only the allowed issue set for `SHELSSW`.
- The returned content matches the approved rules for date range, story-only filtering, and status list.

Dependencies:
- Task 11

---

## Task 13: Final scope compliance review

Description:
Review the implementation against the v1 specification and confirm no out-of-scope features have been introduced.

Acceptance criteria:
- The tool is limited to a single team and single-user workflow.
- No database, auth, risk analysis, scoring, send-email automation, or analytics features are present.
- The generated result is a one-page plain-text draft suitable for manual email use.
- The project is ready for stakeholder use under the approved v1 scope.

Dependencies:
- Task 12
