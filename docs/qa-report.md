# QA Report – Weekly Status Report Application

Date: 2026-08-29
Scope: Browser and backend validation for the Weekly Status Report flow using the frontend at http://localhost:5173 and the backend at http://localhost:3001.

## Summary of the pages tested

- Landing page / home view
  - Verified the application loads successfully and presents the report-generation workflow.
  - Confirmed the default project, window, issue type, and status values are displayed.
  - Verified the empty state before generation: “Awaiting report”.

- Report preview panel
  - Confirmed the preview updates after clicking the main action.
  - Verified the preview renders the generated plaintext draft and status text.

- Backend health endpoint
  - Verified that the backend service was up and responsive.

- Report generation API endpoint
  - Verified that the backend successfully returned a generated report payload once the configuration issue was corrected.

## Interactive tests performed

- Loaded the application home page in the browser.
- Confirmed the main heading and button render correctly.
- Verified the default configuration values in the settings panel.
- Clicked “Generate weekly report” with the default settings.
- Confirmed the preview transitions from “Awaiting report” to “Ready for review”.
- Verified the generated report text matches the expected structure.
- Checked backend health at http://localhost:3001/api/health.
- Reproduced and resolved the backend report-generation failure.
- Re-tested the API call after backend restart using the report generation endpoint.
- Checked the browser console and page state after the frontend was restarted.

## Bugs found

### 1) Missing Jira base URL config blocked report generation
Severity: Critical

Description:
- The generated report request reached the backend but failed with response error: “JIRA_BASE_URL is required”.
- This prevented the report generation flow from completing in the app and was a backend runtime configuration issue rather than a UI defect.

Evidence:
- Browser UI showed the report block with the error message in the preview panel.
- Backend response: HTTP 500 with JSON error `{ "error": "JIRA_BASE_URL is required" }`.
- Screenshot reference: Browser capture of the initial page state showing the error in the report preview.

Status:
- Fixed by ensuring the backend loads the correct `.env` values from the backend app directory and by normalizing the Jira instance URL to the root instance origin rather than a board-specific RapidBoard URL.

### 2) Frontend dev server was temporarily stopped, causing browser connection errors
Severity: Medium

Description:
- The app page was no longer reachable on localhost:5173 after the frontend server went down.
- Browser then displayed a connection error page (`ERR_CONNECTION_REFUSED` / `chrome-error://chromewebdata`).

Evidence:
- Browser attempted to load the app but could not connect to the local frontend server.
- Backend health checks confirmed the backend was up while the frontend was not.
- Screenshot reference: Browser capture of the page in inactive/disconnected state before the frontend was restarted.

Status:
- Fixed by restarting the frontend Vite process and reloading the app.

### 3) Live Jira integration still requires valid Atlassian credentials
Severity: High

Description:
- The app’s report generation logic is configured correctly for the runtime contract, but Jira content retrieval still depends on the email and API token pair being valid for the target Jira instance.
- The Jira API failed with 401 Unauthorized for the current live credentials, which means authentication for real Jira operation is still not valid.

Evidence:
- The backend service was corrected to accept the right Jira instance origin format.
- The final live check showed that a valid account/token pair must still be supplied before Jira data is fetched successfully.

Status:
- Known issue at runtime. Requires a valid Jira account email and Atlassian API token for the correct Jira instance before end-to-end Jira-backed report generation can be proven against live data.

## Fixes applied

- Corrected the backend startup context so the app loads runtime values from the backend `.env` file instead of a mismatched working directory.
- Normalized the Jira base URL validation to use the Jira instance origin (for example, `https://jiraeu.epam.com`) instead of a board-specific RapidBoard URL.
- Restarted the backend to reload the environment config.
- Restarted the frontend dev server and reloaded the page to confirm the UI is healthy again.
- Re-tested the main user flow after the fixes.

Relevant repository references:
- `445d9d3` – `fix: form validation error on submit`
- `8fc2a40` – `feat: complete prototype per specification.`
- `b566c42` – `Refactor Weekly Status Report Generator specification and tasks for v1 release`
- Session runtime fix note: the Jira env/config fix was applied in the local working tree during this session; no separate commit was created for that environment change in the repository history.

## Current application status

Current status is:
- Frontend app loads successfully at http://localhost:5173.
- Main user flow is working locally with default settings.
- Clicking “Generate weekly report” results in a valid report draft and the status changes to “Ready for review”.
- No active JavaScript errors were observed in the browser during the successful app run.
- Known issue remains: live Jira data retrieval requires a valid Jira email/API token for the correct Jira instance before the app can fetch real issue data for a report.

Overall verdict:
- Local smoke tests pass.
- Known live Jira authentication issue remains outside the UI flow and must be resolved with proper credentials before full production report generation is verified against real Jira data.
