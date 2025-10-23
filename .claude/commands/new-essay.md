# Create New Essay

Create a new essay with the following steps:

1. Ask the user for the essay title (required)
2. Ask if they want to use today's date or specify a different date
3. Create a new directory in `src/content/essays/` with a URL-friendly slug based on the title
4. Create an `index.md` file in that directory with the following frontmatter:

```markdown
---
title: 'Essay Title Here'
date: YYYY-MM-DD
---

[Essay content goes here]
```

5. Inform the user where the file was created
6. Optionally open the file for editing
