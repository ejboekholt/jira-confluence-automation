# Instructions Catalog

Each entry below is an instruction file with a one-line description.

---

- [`./instructions/creating-instructions.agent.md`](./creating-instructions.agent.md) — install and maintain instruction infrastructure for the project.
  + Keywords: create instruction, instructions setup, agent instructions, instruction infrastructure
  + Target: `**/*`, `*.md`, `*.agent.md`
- [`./instructions/create-status-report.agent.md`](./create-status-report.agent.md) — generate a concise weekly project status report in markdown.
  + Keywords: status report, weekly report, accomplishments, blockers, next week
  + Target: `**/*.md`
- [`./instructions/manage-crud-registry.agent.md`](./manage-crud-registry.agent.md) — implement CRUD and registry operations for CR records, including validation, filtering, and audit-safe updates.
  + Keywords: CRUD, registry management, create record, update record, list CRs, filter CRs, delete CR
  + Target: `**/*.md`, `**/*.py`, `**/*.ts`, `**/*.js`
- [`./instructions/manage-reporting-export.agent.md`](./manage-reporting-export.agent.md) — generate project, program, or portfolio reporting views and export-ready results for CR data.
  + Keywords: reporting, export, dashboard, CSV, shareable report, summary view, overdue report
  + Target: `**/*.md`, `**/*.py`, `**/*.ts`, `**/*.js`
- [`./instructions/calculate-compound-interest.agent.md`](./calculate-compound-interest.agent.md) — calculate compound interest and present the final amount and interest earned using the project tool.
  + Keywords: compound interest, future value, interest earned, monthly compounding, savings projection, loan growth
  + Target: `**/*.md`, `**/*.py`
- [`./instructions/use-jira-issue-fetch.agent.md`](./use-jira-issue-fetch.agent.md) — retrieve Jira issue data for a project using the Jira fetch script.
  + Keywords: fetch Jira issues, Jira project data, Jira tickets, active issues, project retrieval
  + Target: `**/*.md`, `**/*.py`
- [`./instructions/use-cr-registry-summary.agent.md`](./use-cr-registry-summary.agent.md) — summarize CR registry data by total, status, and priority using the CSV summary script.
  + Keywords: CR summary, status counts, priority breakdown, registry totals, project summary
  + Target: `**/*.md`, `**/*.py`
- [`./instructions/validate-instructions.agent.md`](./validate-instructions.agent.md) — validate instruction files for SRP, scope, consistency, and project conventions.
  + Keywords: validate instructions, review instructions, instruction SRP, instruction quality, instruction conventions
  + Target: `instructions/**/*.agent.md`
- [`./instructions/use-iterative-reread.agent.md`](./use-iterative-reread.agent.md) — process a bounded batch iteratively with rereading and verification between items.
  + Keywords: Approach 2, iterative reread, process files individually, bounded batch, verify each item
  + Target: `**/*`
