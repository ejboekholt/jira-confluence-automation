REPORT_TEMPLATE = """# Weekly Engineering Status Report

## Executive Summary
- Overall status: {overall_status}
- Sprint focus: {sprint_focus}
- Key risks: {key_risks}

## Completed Issues
{completed_issues}

## In Progress
{in_progress_issues}

## Blockers
{blockers}

## Next Sprint Goals
{next_sprint_goals}
"""


def build_status_template() -> str:
    return REPORT_TEMPLATE
