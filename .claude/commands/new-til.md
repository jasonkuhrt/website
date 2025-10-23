# Create New TIL Entry

Create a new Today I Learned entry with the following steps:

1. Use today's date to create the filename in format `YYYY-MM-DD.md`
2. Ask if the user wants to use today's date or specify a different date
3. Create a new file `src/content/til/entries/{date}.md`
4. Add the following frontmatter:

```markdown
---
title: '{Day} {Month} {DayNumber}'
date: YYYY-MM-DD
---

[TIL content goes here - bullet points work well]
```

For example, for December 9, 2018:

```markdown
---
title: 'Sun Dec 9'
date: 2018-12-09
---

- First thing I learned today
- Second thing I learned today
```

5. Inform the user where the file was created
6. Optionally open the file for editing
