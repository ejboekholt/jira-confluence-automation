# Change Request (CR) Registry Technical Specification

## 1. Overview
The CR Registry is a Jira-first reporting and governance tool for delivery managers and project leads working across SSW TWR. It provides a single place to track, summarize, and review change requests across multiple projects, with filtering and reporting views that support execution decisions and portfolio oversight.

## 2. Purpose
The system will:
- Track all change requests across projects in a consistent format
- Provide a summary of CR status, priority, and impact across programs
- Support portfolio-level governance and reporting
- Reduce manual aggregation from spreadsheets and Jira boards
- Help managers identify trends, blockers, and resource impact

## 3. Target Users
- Delivery Manager
- Project Leads
- Managers responsible for cross-project governance
- Team leads needing summary views for status reviews

## 4. Functional Requirements

### 4.1 CR Record Model
Each CR must contain:
- Title
- Project
- Status
- Owner
- Impact
- Priority
- Requested date
- Target date / due date
- Summary / description
- Decision / outcome notes
- Last updated timestamp
- Related Jira issue(s) or key(s)
- Optional manual fields for project-level context

### 4.2 Lifecycle States
The registry must support at least:
- New
- Under review
- Approved
- Rejected
- In progress
- On hold
- Completed
- Cancelled

### 4.3 Filtering and Views
The system must support filtering by:
- Project
- Status
- Priority
- Owner
- Date range
- Impact area
- Jira issue key or project reference

### 4.4 Summary and Reporting
The system must support:
- Total CR count by project
- CR count by status and priority
- Overdue CRs
- CRs opened/closed in a selected period
- Trend summaries over time
- Export to CSV or shareable report view

### 4.5 Jira Integration
The registry must be Jira-first:
- Use Jira as the primary source of truth for CR metadata
- Pull data from Jira issues and custom fields where possible
- Allow optional manual enrichment for governance-only fields not present in Jira
- Keep a mapping between CR registry entries and Jira issue keys

### 4.6 Governance Features
- Maintain summary notes and decision history
- Capture whether a CR was accepted, rejected, or deferred
- Allow comments or manager notes for decisions
- Support status snapshots for weekly or monthly reporting

## 5. Non-Functional Requirements

### 5.1 Performance
- Support reporting over a portfolio of 150 people and multiple active projects
- Dashboard should refresh within a few seconds for typical filtered views
- Large Jira exports should be handled efficiently

### 5.2 Reliability
- Data should be refreshed on a scheduled cadence
- Failed synchronization should be visible and logged
- System should allow reprocessing for a given project or date range

### 5.3 Security and Access Control
- Access restricted to approved managers and project leads
- Read-only access for broader stakeholders
- Role-based permissions for editing CR metadata and governance notes

### 5.4 Data Quality
- Enforce required fields for new CR records
- Flag missing Jira links
- Highlight stale or overdue CRs

## 6. Proposed Architecture

### 6.1 Core Components
- Jira data ingestion layer
- CR normalization layer
- Storage layer for registry records
- Reporting and dashboard layer
- Export service for CSV/report output
- Admin configuration layer for project mappings and custom fields

### 6.2 Data Flow
1. Jira issue data is fetched from relevant projects and filters
2. CR records are normalized into a common schema
3. Optional manual governance metadata is merged in
4. Reporting views aggregate and summarize CRs by project and status
5. Managers consume dashboard views and exports for governance reviews

## 7. Data Model

### 7.1 Registry Entity
```text
CR {
  id: string
  title: string
  project: string
  status: enum
  owner: string
  impact: enum/string
  priority: enum
  requestedDate: date
  targetDate: date | null
  summary: string
  decisionNotes: string | null
  jiraIssueKey: string | null
  lastUpdated: datetime
  createdAt: datetime
}
```

## 8. User Stories
- As a delivery manager, I want a summary of all CRs across projects so I can assess portfolio risk.
- As a project lead, I want to filter CRs by status and priority so I can focus on critical items.
- As a manager, I want a weekly snapshot of change activity so I can report progress clearly.
- As a governance stakeholder, I want exportable reporting so I can share updates externally.

## 9. Acceptance Criteria
- CRs can be created, updated, and filtered by key dimensions
- Jira issue metadata is automatically loaded into the registry
- Manager-level summaries update from current data
- Reports can be exported in CSV or a shareable report format
- A CR lifecycle can be tracked from creation to closure

## 10. Out of Scope
- Full workflow automation for all project requests beyond CR tracking
- Developer task-level time tracking
- Deep custom analytics beyond summary and governance views

## 11. Risks and Considerations
- Jira data quality may vary by project
- Some CR attributes may need manual enrichment
- Different projects may label statuses and priorities differently
- Need clear rules for which issues count as CRs versus standard Jira tickets

## 12. Recommended Next Steps
1. Confirm the exact Jira projects and custom fields to include
2. Define the master CR status model and ownership rules
3. Validate a pilot with 2–3 projects before broader rollout
4. Build dashboard and export views with manager feedback
5. Review governance reporting cadence and stakeholder access
