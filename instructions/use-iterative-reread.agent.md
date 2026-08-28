# Use Iterative Reread

- Use this instruction when Approach 2 is explicitly selected for a bounded batch of files or data items.
- Confirm that the input contains no more than 10–15 items before processing.
- Process one file or data item at a time rather than combining the entire batch into one request.
- After each item, reread the current result and compare it with the requested criteria.
- Carry forward only verified findings and decisions to the next item.
- Preserve the identity and order of every processed item.
- Record failures or ambiguous results for the specific item instead of silently skipping it.
- Do not use this workflow for unbounded or large batches; use the Approach 3 automation script instead.
- Return a concise per-item result followed by an overall batch summary.
