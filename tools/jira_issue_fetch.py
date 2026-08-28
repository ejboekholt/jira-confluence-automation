#!/usr/bin/env python3
import argparse
import json
import sys
from urllib import parse, request


def fetch_jira_issues(base_url: str, project: str, username: str, api_token: str, jql: str | None = None, max_results: int = 50):
    if not base_url:
        raise ValueError("base_url is required")
    if not username:
        raise ValueError("username is required")
    if not api_token:
        raise ValueError("api_token is required")

    jira_jql = jql or f'project = "{project}" ORDER BY updated DESC'
    params = {
        "jql": jira_jql,
        "maxResults": str(max_results),
        "fields": "key,summary,status,priority,assignee,updated",
    }
    url = f"{base_url.rstrip('/')}/rest/api/2/search?{parse.urlencode(params)}"

    auth = request.HTTPBasicAuthHandler()
    password_mgr = request.HTTPPasswordMgrWithDefaultRealm()
    password_mgr.add_password(None, url, username, api_token)
    opener = request.build_opener(request.HTTPBasicAuthHandler(password_mgr))
    req = request.Request(url, headers={"Accept": "application/json"})

    try:
        with opener.open(req) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception as exc:  # pragma: no cover - network-specific failure
        raise RuntimeError(f"Failed to fetch Jira issues: {exc}") from exc

    issues = payload.get("issues", [])
    summary = {
        "total": payload.get("total", len(issues)),
        "returned": len(issues),
        "project": project,
        "jql": jira_jql,
        "issues": [
            {
                "key": issue.get("key"),
                "summary": issue.get("fields", {}).get("summary"),
                "status": issue.get("fields", {}).get("status", {}).get("name"),
                "priority": issue.get("fields", {}).get("priority", {}).get("name"),
                "assignee": issue.get("fields", {}).get("assignee", {}).get("displayName"),
                "updated": issue.get("fields", {}).get("updated"),
            }
            for issue in issues
        ],
    }
    return summary


def main():
    parser = argparse.ArgumentParser(description="Fetch Jira issues for a project and print a summary.")
    parser.add_argument("--base-url", required=True, help="Jira base URL, e.g. https://company.atlassian.net")
    parser.add_argument("--project", required=True, help="Jira project key or name")
    parser.add_argument("--username", required=True, help="Jira username or email")
    parser.add_argument("--api-token", required=True, help="Jira API token")
    parser.add_argument("--jql", help="Optional custom JQL expression. Defaults to project = \"<project>\" ORDER BY updated DESC")
    parser.add_argument("--max-results", type=int, default=50, help="Maximum number of issues to fetch")
    args = parser.parse_args()

    try:
        result = fetch_jira_issues(
            base_url=args.base_url,
            project=args.project,
            username=args.username,
            api_token=args.api_token,
            jql=args.jql,
            max_results=args.max_results,
        )
        print(json.dumps(result, indent=2))
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
