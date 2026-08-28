from __future__ import annotations

from typing import Iterable, List, Dict, Any

from report_template import build_status_template


def summarize_issues(issues: Iterable[Dict[str, Any]]) -> Dict[str, List[str]]:
    completed = []
    in_progress = []
    blockers = []

    for issue in issues:
        summary = f"- {issue['key']}: {issue['summary']} ({issue['assignee']})"
        status = issue.get("status", "").lower()

        if status == "done":
            completed.append(summary)
        elif status == "in progress":
            in_progress.append(summary)
        elif status in {"blocked", "to do"}:
            blockers.append(summary)

    return {
        "completed": completed,
        "in_progress": in_progress,
        "blockers": blockers,
    }


def format_report(issues: Iterable[Dict[str, Any]]) -> str:
    grouped = summarize_issues(issues)
    completed_text = "\n".join(grouped["completed"]) or "- None"
    active_text = "\n".join(grouped["in_progress"]) or "- None"
    blocker_text = "\n".join(grouped["blockers"]) or "- None"

    template = build_status_template()
    return template.format(
        overall_status="On track",
        sprint_focus="Stabilize delivery and unblock critical dependencies",
        key_risks="Release risk for QA and dependency readiness",
        completed_issues=completed_text,
        in_progress_issues=active_text,
        blockers=blocker_text,
        next_sprint_goals="- Complete integration hardening\n- Validate release plan\n- Resolve blocker ownership",
    )
