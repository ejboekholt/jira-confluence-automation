# Weekly Status Report Generator — Implementation Plan

## Project goal

Build a deliberately small, manual reporting tool for the Shell SSW delivery manager. It will fetch Jira issues for project `SHELSSW`, filter to Story items in `To Do`, `In Progress`, and `Done`, and render a plain-text, one-page email draft preview for copy/paste into email.

This plan follows the approved v1 scope:
- Single team only (`SHELSSW`)
- Manual trigger only
- Last 7 calendar days
- Jira as the only source of truth
- Plain-text email preview output
- No database in v1
- No auth in v1
- No automation beyond immediate generation on button click

---

## Phase 1: Backend setup (API skeleton and minimal config)

Goal: establish the backend foundation and the report generation endpoint without introducing unnecessary architecture.

### Milestone 1.1 — project and runtime setup
- Initialize Node.js + Express backend project.
- Add environment configuration for the Jira base URL and credentials.
- Confirm the app runs locally via a health endpoint.
- Keep configuration static and minimal.
- Note: v1 intentionally does not add a database layer; persistence is not required.

### Milestone 1.2 — API skeleton
- Create the base Express app with a minimal structure such as:
  - `src/app.js`
  - `src/server.js`
  - `src/routes/reportRoutes.js`
  - `src/controllers/reportController.js`
  - `src/services/jiraService.js`
- Add `/api/health` endpoint for startup validation.
- Add `/api/reports/generate` endpoint stub returning a placeholder response.

### Milestone 1.3 — Jira integration contract
- Implement Jira fetch logic for project `SHELSSW` only.
- Define the report window as the last 7 calendar days.
- Filter issues to:
  - issue type: `Story`
  - statuses: `To Do`, `In Progress`, `Done`
- Map Jira issue fields to the required output:
  - key
  - summary
  - status
  - assignee
  - last update

### Milestone 1.4 — report formatting
- Build plain-text formatter that produces a one-page email draft.
- Keep output factual and flat; no grouping, no summaries, no risk logic.
- Return a clean error message if Jira calls fail.

### Phase 1 exit criteria
- Backend can start successfully.
- `/api/health` works.
- `/api/reports/generate` returns generated report content or a raw error message.
- No database layer is added for v1.

---

## Phase 2: Frontend setup (UI skeleton and routing)

Goal: create the minimal interface for the delivery manager to trigger the report and review the output.

### Milestone 2.1 — Vite React app setup
- Initialize React 18 + Vite frontend.
- Add the basic app shell and dependencies.
- Set up the app to run locally in development mode.

### Milestone 2.2 — page routing and layout
- Create the main page for the weekly report workflow.
- Keep the UI to a single screen with a title, trigger button, and preview pane.
- No login, no role switching, no additional navigation.

### Milestone 2.3 — form and state handling
- Add a `Generate weekly report` button.
- Trigger a backend request on click.
- Manage loading and error states.
- Display the raw backend error message directly when there is a failure.

### Milestone 2.4 — preview experience
- Render the generated email draft in a plain-text preview area.
- Ensure text is copyable to clipboard/email client.
- Style minimally; the focus is on readability, not visual complexity.

### Phase 2 exit criteria
- User can open the app and generate a status draft with one click.
- The preview is visible and copyable.
- Error handling is visible and plain.

---

## Phase 3: Feature implementation (one feature at a time)

Goal: implement the product in a controlled sequence, ensuring each feature is validated before moving to the next.

### Feature 3.1 — Project and date filtering
- Implement project filter for `SHELSSW`.
- Implement the last 7 calendar days filter.
- Validate returned Jira data against the exact reporting period.

### Feature 3.2 — Issue type and status filtering
- Restrict to `Story` issue type.
- Restrict to `To Do`, `In Progress`, and `Done` only.
- Confirm that all other issue types are excluded.

### Feature 3.3 — Data shaping for report content
- Normalize Jira fields into the exact output model:
  - key
  - summary
  - status
  - assignee
  - updatedAt
- Ensure records are listed flat with no grouping.

### Feature 3.4 — Plain-text report generation
- Build the email draft string as plain text.
- Include only the required issue list.
- Do not add summary metrics, heading blocks, or risk analysis.

### Feature 3.5 — Manual trigger and preview flow
- Wire the frontend button to the backend endpoint.
- Display the generated output immediately after fetch.
- Confirm the content is ready for copy to email.

### Feature 3.6 — Error path
- Handle Jira fetch failures gracefully.
- Surface the raw error from the backend without additional formatting.

### Phase 3 exit criteria
- Each feature works independently.
- The app remains small, factual, and manual.
- No feature beyond the v1 scope is introduced.

---

## Phase 4: Integration and testing

Goal: verify end-to-end behavior for the single supported workflow and ensure the app remains intentionally minimal.

### Milestone 4.1 — End-to-end smoke testing
- Verify the app starts successfully.
- Trigger report generation from the frontend.
- Confirm backend fetches Jira issues for the correct project and filters.
- Confirm the preview displays the generated plain-text output.

### Milestone 4.2 — Validation of filtering rules
- Validate last 7 days logic.
- Validate Story-only filtering.
- Validate allowed status filtering.
- Validate that closed items are included inline with open items.

### Milestone 4.3 — Error behavior checks
- Simulate a failed Jira request.
- Confirm the system shows the raw error returned by the backend.
- Verify there is no misleading fallback output.

### Milestone 4.4 — Manual QA and release readiness
- Test the UI with a realistic Jira dataset.
- Confirm output is copyable and readable in a standard email client.
- Review for scope compliance against v1 requirements.
- Reject any additional features that are not explicitly approved.

### Phase 4 exit criteria
- The report-generation flow works end-to-end.
- Output matches the approved v1 requirements.
- No database, auth, summaries, scoring, or automation are included.
- The tool is ready for a manual stakeholder reporting workflow.

---

## Recommended delivery sequence

1. Backend health and report API skeleton
2. Jira fetch and filter logic
3. Plain-text report formatting
4. Frontend shell and button interaction
5. Preview rendering and copy flow
6. Error handling validation
7. Final smoke test against v1 acceptance criteria

## Definition of done

The implementation is complete when:
- the delivery manager can trigger the weekly report from the app,
- the app fetches Jira data for `SHELSSW`,
- the output contains only Story items in the last 7 days and allowed statuses,
- the result is a one-page plain-text preview, and
- the workflow remains deliberately simple and manual without database, auth, or analytics features.
