# Module 15 Completion Report

## Script Metadata
- Filename: `tools/validate_instructions.py`
- Language: Python
- Purpose: Processes each `*.agent.md` instruction file individually, checks basic file and formatting conventions, and emits a per-file validation report in human-readable or JSON format.

## Script Contents
```python
#!/usr/bin/env python3
"""Validate instruction files independently and emit a machine-readable report."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def validate_file(path: Path, root: Path) -> dict[str, object]:
    """Validate one instruction file without sharing state with other files."""
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    relative_path = path.relative_to(root).as_posix()
    issues: list[str] = []

    if not text.strip():
        issues.append("file is empty")
    if path.name != "main.agent.md" and not re.match(r"^[a-z]+(?:-[a-z]+)*\.agent\.md$", path.name):
        issues.append("filename is not verb-first hyphenated")
    if not lines or not lines[0].startswith("# "):
        issues.append("missing top-level heading")
    if not any(line.startswith("- ") for line in lines):
        issues.append("contains no actionable bullet points")

    return {
        "file": relative_path,
        "status": "Compliant" if not issues else "Needs review",
        "issues": issues,
        "lineCount": len(lines),
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate each instruction file independently."
    )
    parser.add_argument(
        "directory",
        nargs="?",
        type=Path,
        default=Path("instructions"),
        help="Directory containing instruction files (default: instructions)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit the per-file report as JSON.",
    )
    args = parser.parse_args()

    root = args.directory.resolve()
    if not root.is_dir():
        parser.error(f"directory does not exist: {args.directory}")

    files = sorted(root.glob("*.agent.md"))
    results = [validate_file(path, root) for path in files]

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for result in results:
            suffix = f": {', '.join(result['issues'])}" if result["issues"] else ""
            print(f"{result['status']}: {result['file']} ({result['lineCount']} lines){suffix}")
        print(f"\nChecked {len(results)} file(s) independently.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

## Parameters
| Parameter | Description | Default |
|-----------|-------------|---------|
| `directory` | Directory containing the `*.agent.md` files to process | `instructions` |
| `--json` | Emit the per-file validation report as JSON instead of text | Disabled |

## Test Run Output
```text
Needs review: Ask.agent.md (40 lines): filename is not verb-first hyphenated, missing top-level heading
Needs review: Iterative-reread.agent.md (16 lines): filename is not verb-first hyphenated, missing top-level heading, contains no actionable bullet points
Needs review: Plan.agent.md (105 lines): filename is not verb-first hyphenated, missing top-level heading

Checked 3 file(s) independently.
```
