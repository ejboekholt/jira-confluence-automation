from __future__ import annotations

from typing import Any, Dict, List


def fetch_jira_data() -> List[Dict[str, Any]]:
    """Return sample Jira sprint data for a delivery manager report."""
    return [
        {
            "key": "TWR-101",
            "summary": "Complete API performance fix",
            "status": "Done",
            "assignee": "A. Smith",
            "priority": "High",
            "project": "SSW TWR",
        },
        {
            "key": "TWR-102",
            "summary": "Review deployment pipeline issues",
            "status": "In Progress",
            "assignee": "J. Patel",
            "priority": "High",
            "project": "SSW TWR",
        },
        {
            "key": "TWR-103",
            "summary": "Resolve QA blocker for release candidate",
            "status": "Blocked",
            "assignee": "M. Lopez",
            "priority": "Critical",
            "project": "SSW TWR",
        },
        {
            "key": "TWR-104",
            "summary": "Prepare sprint retrospective notes",
            "status": "To Do",
            "assignee": "R. Chen",
            "priority": "Medium",
            "project": "SSW TWR",
        },
    ]
