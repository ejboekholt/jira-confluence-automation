- Use this instruction when the user needs to retrieve Jira issue data for a project, status review, or reporting context.
  + Trigger examples: "fetch Jira issues", "pull Jira tickets", "get project issues", "review active CRs from Jira".
  + Use `./tools/jira_issue_fetch.py` when the task requires project-based issue retrieval and the user provides Jira access details.
- Invoke the script with command-line arguments in this order: `--base-url --project --username --api-token [--jql] [--max-results]`.
  + Example: `python3 ./tools/jira_issue_fetch.py --base-url https://company.atlassian.net --project CR --username you@example.com --api-token YOUR_TOKEN --max-results 50`
  + `--base-url` is the Jira site URL.
  + `--project` is the Jira project key or project name.
  + `--username` is the Jira username or email address.
  + `--api-token` is the Jira API token used for authentication.
  + `--jql` is optional; it overrides the default project filter when custom issue selection is required.
  + `--max-results` controls how many issues are returned.
- Run the script before answering Jira-specific questions that depend on up-to-date project data.
  + If the script fails, confirm the Jira URL, credentials, and project key are valid.
  + Use the returned JSON as the source of truth for issue details, summaries, and statuses.
- Present the results in a concise, structured way.
  + Summarize the total number of issues returned and highlight key status or priority patterns.
  + Include the project name and JQL used when relevant.
  + Keep the response factual and direct; do not add filler.
- Keep the workflow deterministic and repeatable.
  + Prefer this script for Jira retrieval tasks in this project.
  + Do not manually reconstruct issue data when the tool output is available.
