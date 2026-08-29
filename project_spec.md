# Weekly Status Report Generator - Technical Specification

## 1. Overview
The solution is a lightweight weekly status report generator for a single delivery team: Shell SSW. It will pull current Jira issue data for that team and format it into a simple one-page email suitable for stakeholder communication.

The scope is intentionally narrow: this is a manual, read-only reporting workflow with no analytics, no risk scoring, and no summary calculations.

## 2. Objective
Provide the delivery manager with a quick way to generate a weekly status email for the Shell SSW team using Jira data only, without building a dashboard or automated scoring model.

## 3. Stakeholder and User
- Primary user: Delivery Manager
- Team covered: 5-person Shell SSW team
- Audience: stakeholders receiving the 1-page weekly update
- Operating model: manual trigger, human review, then send via email client or staging workflow

## 4. Scope
### In scope
- Single team only
- Jira as the only data source
- Manual trigger to generate the report
- One-page email format
- Basic issue listing formatted for stakeholder readability
- Team-specific Jira filters or project selection

### Out of scope
- Multi-team reporting
- Automated at-risk detection
- Summary calculations or KPI rollups
- Burn-down, velocity, forecast, or trend analytics
- Email send automation beyond content generation
- Dependency analysis or issue prioritization logic

## 5. Functional Requirements
1. The system shall allow a user to manually trigger report generation.
2. The system shall fetch Jira issues for the configured Shell SSW team.
3. The system shall use a team-specific Jira project, board, or JQL filter configured in settings.
4. The system shall extract only the fields required for a simple weekly update, such as:
   - Jira issue key
   - Issue summary
   - Current status
   - Assignee
   - Last updated date (optional)
5. The system shall format the data into a one-page email body in plain text or Markdown.
6. The system shall present the report in a simple stakeholder-friendly structure.
7. The system shall not add trend analysis, scoring, or risk labels.
8. The system shall not compute any totals, percentages, or summary metrics.

## 6. Data Requirements
### Source system
- Jira

### Data source selection
The report shall be configured for a single Jira project or work filter representing the Shell SSW team. The configuration should be explicit and easy to update.

### Required issue fields
- Issue key
- Title / summary
- Status
- Assignee
- Updated date or current workflow state

### Data handling rules
- Fetch only the relevant team’s issues.
- Exclude unrelated Jira projects or workstreams.
- Keep the report factual and copy-ready for stakeholders.
- Do not apply additional classification beyond Jira status and ownership.

## 7. Manual Trigger Workflow
1. User opens the report generator.
2. User chooses or confirms the Shell SSW team context.
3. User triggers generation manually.
4. System queries Jira using the configured filter.
5. System creates the email content in a standard format.
6. User reviews the generated content.
7. User sends the email manually.

This flow must be straightforward and repeatable without additional automation.

## 8. Report Format
The output shall be a single-page email with a simple structure, for example:

- Subject line: Weekly Status Report - Shell SSW
- Intro line with reporting period
- Section for work in progress or current issues
- Section with Jira issue list by status or owner
- Closing line for stakeholder context

The format must remain readable in email clients and should avoid complex layouts or HTML-heavy formatting.

## 9. Design Constraints
- Very simple implementation
- One team only
- Jira-only source
- Manual execution
- No calculations
- No risk detection
- No summary section
- No extra business intelligence features

## 10. Acceptance Criteria
The feature is considered complete when:
- A user can trigger generation manually.
- The system fetches Jira data for the Shell SSW team only.
- The output is a one-page email-ready report.
- The report contains Jira issue information only.
- No risk indicators, summaries, or calculations are produced.
- The report is suitable for sending to stakeholders without additional transformation.

## 11. Non-Functional Requirements
- Minimal operational complexity
- Fast generation for a small Jira dataset
- Low maintenance and easy configuration
- Clear separation between Jira fetch and formatting logic
- Easy manual override for team/project selection

## 12. Out of Scope for Initial Version
- Automated email sending
- Portfolio-level reporting
- Multiple team dashboards
- AI-based issue assessment
- Trend analysis or forecasting
- Summary tables and risk scoring
- Integration with other systems beyond Jira

## 13. Implementation Guidance (Simple Version)
The initial solution should be implemented as a simple report script or small application with the following flow:

1. Read configured Jira team/project filter.
2. Query Jira for relevant issues.
3. Extract the required fields.
4. Format issues into a concise email body.
5. Output the report as plain text or Markdown for copy/paste into email.

This approach keeps the solution deployment-light, quick to build, and aligned with the stated business requirement.
