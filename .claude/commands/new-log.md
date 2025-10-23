# Create New Log

Create a new log entry with the following steps:

1. Ask the user for the log title (required)
2. Ask if they want to use today's date or specify a different date
3. Find the highest numbered log file in `src/content/logs/` and increment by 1
4. Create a new file `src/content/logs/{number}-{slug}.md` where:
   - `{number}` is the next sequential number (e.g., 15, 16, etc.)
   - `{slug}` is a URL-friendly version of the title
5. Add the following frontmatter:

```markdown
---
title: 'Log Title Here'
date: YYYY-MM-DD
---

[Log content goes here]
```

6. Inform the user where the file was created
7. Optionally open the file for editing
