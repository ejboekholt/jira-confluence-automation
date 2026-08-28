- Use this instruction when the user needs a summary of CR registry data by total, status, or priority.
  + Trigger examples: "summarize CR registry", "count CRs by status", "priority breakdown", "project summary report".
  + Use `./tools/cr_registry_summary.py` when the data exists in a CSV with `project`, `status`, and `priority` columns.
- Invoke the script with command-line arguments in this order: `--input [--project]`.
  + Example: `python3 ./tools/cr_registry_summary.py --input data/cr_registry.csv --project CR-Portal`
  + `--input` is the path to the CSV file to read.
  + `--project` is optional; it filters the summary to a single project.
- Run the script before answering summary questions that depend on aggregated registry data.
  + If the script fails, check that the CSV exists and contains the required columns.
  + Use the JSON output as the source for totals, status counts, and priority counts.
- Present the results in a concise, readable format.
  + Report the total count and the breakdown by status and priority.
  + Mention any project filter used in the summary.
  + Keep the answer brief and factual.
- Keep the workflow deterministic and repeatable.
  + Prefer this script for registry summary tasks in this project.
  + Do not recalculate totals manually when the tool output is available.
