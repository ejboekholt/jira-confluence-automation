# Module 10 Completion Report

## Instruction Files
```text
instructions/create-status-report.agent.md
instructions/main.agent.md
```

## main.agent.md Contents
```markdown
# Main Agent Instructions

The following instruction files are available:

- create-status-report.agent.md.   # Generates a status report based on the current project state
```

## Sample Instruction
- File: create-status-report.agent.md
- Contents:
````markdown
# Create Weekly Status Report

Generate the report in Markdown.

Use exactly these sections in order:
- Accomplishments
- Blockers
- Next week

Rules:
- Use bullet points only.
- Keep the report to a maximum of 20 lines.
- Use a professional tone.
- Remove fluff words or filler language.
- Keep content factual, concise, and actionable.
- Do not include headings beyond the three required sections.

Output format:
```markdown
## Accomplishments
- ...
- ...

## Blockers
- ...
- ...

## Next week
- ...
- ...
```

Constraints:
- Each section should contain 3-6 bullet points.
- Keep bullet text short and direct.
- Avoid marketing language, repetition, and generic statements.
- If no blockers exist, write: `- No blockers.`
- If there are no major upcoming actions, write: `- Continue current priorities.`
````
