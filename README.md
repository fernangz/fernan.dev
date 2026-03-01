# fernan.dev

FrontEnd development tools, articles, and resources.

**Live Site:** https://fernan.dev/

---

## Quick Start

```bash
# Make changes
nano styles/main.css

# Deploy
./publish.sh "Your commit message"

# Verify
open https://fernan.dev/
```

---

## Features

- **10 Tools** - Color tools, code formatters, reference guides
- **13 Articles** - FrontEnd fundamentals to advanced topics
- **20 Resources** - Curated free and open-source tools
- **Mobile-first** - Responsive design
- **Accessible** - WCAG AA compliant
- **Fast** - ~50KB total bundle size

---

## File Structure

```
fernan.dev/
├── index.html                 # Homepage
├── tools/                     # 10 tool pages
├── articles/                  # 13 article pages
├── resources/                 # Resources index
├── _includes/                 # Jekyll includes (startHtml, startBody, endBodyHtml)
├── styles/                    # 16 CSS files
├── scripts/                   # 8 JS files
├── data/                      # JSON data files
└── publish.sh                 # Deployment script
```

---

## Deployment Scripts

| Script | Purpose | Usage | Warning |
|--------|---------|-------|---------|
| **publish.sh** | Commit and push | `./publish.sh "Message"` | Stages all changes |
| **rebase.sh** | Pull + rebase + push | `./rebase.sh` | May have conflicts |
| **restore.sh** | Reset to origin/main | `./restore.sh` | ⚠️ Discards local changes |

### publish.sh
- Stages all changed files
- Commits with provided message
- Pushes to GitHub main branch
- Uses local SSH key (`github.key`)

### rebase.sh
- Pulls latest from remote with rebase
- Pushes rebased changes
- Use when remote has new commits

### restore.sh
- ⚠️ **Destructive:** Discards all local changes
- Resets to origin/main state
- Auto-stashes changes (recoverable with `git stash pop`)
- Requires typing `YES` to confirm

---

## Jekyll Includes

All pages use includes from `_includes/` for consistent structure:

```liquid
---
---
{% include startHtml.html %}
<!-- PAGE METAS -->
<title>...</title>
<meta name="description" content="...">
<link rel="canonical" href="...">
<link rel="stylesheet" href="/styles/page.css">
{% include startBody.html %}
<!-- PAGE CONTENT -->
<h1>Title</h1>
<p>Content...</p>
<script src="/scripts/page.js"></script>
{% include endBodyHtml.html %}
```

**Rules:**
1. Start with `---` `---` (empty front matter)
2. Don't add `<html>`, `<head>`, `<body>` in pages
3. Page-specific content between comment markers

---

## Git Commands

```bash
# View history
git log --oneline

# Check status
git status

# View file changes
git diff HEAD

# Recover stashed changes
git stash pop
```

**Note:** Git is the source of truth for project history.

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Contributing

1. Test in Chrome, Firefox, Safari
2. Test on mobile
3. Run `./publish.sh "Description"`
4. Verify at https://fernan.dev/

---

## License

© Fernán García de Zúñiga. All rights reserved.

**Last Updated:** 2025-02-28
