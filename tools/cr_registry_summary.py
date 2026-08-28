#!/usr/bin/env python3
import argparse
import csv
import json
from collections import Counter


def summarize_registry(csv_path: str, project: str | None = None):
    with open(csv_path, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        required = {"project", "status", "priority"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise ValueError(f"CSV is missing required columns: {sorted(missing)}")

        rows = list(reader)

    if project:
        rows = [row for row in rows if row.get("project", "").strip() == project]

    total = len(rows)
    status_counts = Counter(row.get("status", "Unknown").strip() for row in rows)
    priority_counts = Counter(row.get("priority", "Unknown").strip() for row in rows)

    summary = {
        "total": total,
        "project": project,
        "by_status": dict(sorted(status_counts.items())),
        "by_priority": dict(sorted(priority_counts.items())),
    }
    return summary


def main():
    parser = argparse.ArgumentParser(description="Summarize a CR registry CSV by total count, status, and priority.")
    parser.add_argument("--input", required=True, help="Path to the CSV file with project, status, and priority columns")
    parser.add_argument("--project", help="Optional project filter to summarize a single project")
    args = parser.parse_args()

    try:
        result = summarize_registry(args.input, project=args.project)
        print(json.dumps(result, indent=2))
    except Exception as exc:
        raise SystemExit(f"Error: {exc}")


if __name__ == "__main__":
    main()
