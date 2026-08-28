# Validate Instruction Files

- Use this instruction when reviewing instruction files for scope, clarity, consistency, or compliance with project conventions.
- For batch validation, run `python3 ./tools/validate_instructions.py instructions`; the script processes each file independently.
- Inspect each target instruction file and identify its primary responsibility.
- Verify that the file supports one focused workflow or operation.
- Flag unrelated responsibilities, duplicated workflows, or responsibilities that should be delegated to another instruction.
- Check that trigger conditions, inputs, processing steps, outputs, and constraints are consistent with the stated responsibility.
- Check that file names are verb-first and use hyphen-separated words.
- Check that instructions use concise, actionable bullet points and avoid unnecessary explanation.
- Check that referenced scripts, paths, commands, and examples are consistent and practical.
- Check that the catalog entry in `./instructions/main.agent.md` accurately describes the instruction and includes useful keywords.
- Report findings per file using `Compliant`, `Mostly compliant`, or `Not compliant`.
- For each non-compliant or borderline file, explain the specific SRP or convention issue and recommend a focused split or correction.
- Do not modify instruction files during validation unless the user explicitly requests remediation.
- Keep the validation report concise and distinguish definite violations from improvement suggestions.
