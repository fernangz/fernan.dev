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
- **Mobile-first** - Responsive design with fluid typography
- **Accessible** - WCAG 2.2 AA compliant, ARIA landmarks, focus traps, keyboard navigation
- **Fast** - ~50KB bundle, Service Worker caching, font-display: optional
- **Secure** - CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **SEO Optimized** - Schema.org JSON-LD on all pages (WebSite, Article, WebApplication, BreadcrumbList, Person)

---

## File Structure

```
fernan.dev/
├── index.html                 # Homepage
├── tools/                     # 10 tool pages
├── articles/                  # 13 article pages
├── resources/                 # Resources index
├── _includes/                 # Jekyll includes (startHtml, startBody, endBodyHtml, structured-data)
├── styles/                    # 16 CSS files
├── scripts/                   # 9 JS files (including service worker)
├── data/                      # JSON data files
├── fonts/                     # Custom fonts (Outfit, Fira Code, Emoji)
├── favicon/                   # PWA icons and manifest
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

**Available Includes:**
- `startHtml.html` - DOCTYPE, security headers, universal structured data
- `startBody.html` - Skip link, navigation with ARIA landmarks & roles
- `endBodyHtml.html` - Main script, service worker registration
- `structured-data.html` - Universal schema (WebSite, Person, Organization, Breadcrumb)
- `structured-data-tool.html` - WebApplication schema template
- `structured-data-articles.html` - Article schema template

---

## Development Workflow

### Standard Task Process

```
┌─────────────────────────────────────────────────────────────────┐
│  1. TASK                                                       │
│     ↓                                                          │
│  2. Read README.md + Check ./history.sh                        │
│     ↓                                                          │
│  3. Plan Build (create todo list, identify files)              │
│     ↓                                                          │
│  4. BUILD (implement changes)                                  │
│     ↓                                                          │
│  5. Update sitemap.xml (if new/modified pages)                 │
│     ↓                                                          │
│  6. Update README.md (if features/structure changed)           │
│     ↓                                                          │
│  7. Run ./publish.sh "Description"                             │
│     ↓                                                          │
│  8. If error → ./rebase.sh and retry                           │
│     ↓                                                          │
│  9. Verify at https://fernan.dev/                              │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Guide

| Step | Action | Command/Tool |
|------|--------|--------------|
| **1** | Define task | User request or issue |
| **2** | Review context | `cat README.md`, `./history.sh -n 10` |
| **3** | Plan implementation | Create todo list, identify files to modify |
| **4** | Implement changes | Edit files, test locally |
| **5** | Update sitemap | Edit `sitemap.xml` if pages added/modified |
| **6** | Update docs | Edit `README.md` if features changed |
| **7** | Publish | `./publish.sh "Description"` |
| **8** | Handle errors | `./rebase.sh` if push fails |
| **9** | Verify | Open https://fernan.dev/ |

### Quick Reference

```bash
# View recent commits before starting
./history.sh -n 10

# View commit history with file changes
./history.sh -s -n 5

# After making changes
./publish.sh "feat: add new feature"
# or
./publish.sh "fix: resolve issue #123"
# or
./publish.sh "docs: update README"

# If push fails (remote has changes)
./rebase.sh

# Emergency reset (WARNING: loses local changes)
./restore.sh
```

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

Follow the **Development Workflow** above for all changes.

1. Test in Chrome, Firefox, Safari
2. Test on mobile
3. Test with keyboard only (Tab, Enter, Escape)
4. Run Lighthouse audit (target: 95+ all categories)
5. Verify structured data (Google Rich Results Test)
6. Run `./publish.sh "Description"`
7. Verify at https://fernan.dev/

---

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**CC BY-NC-SA 4.0**

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NonCommercial** — You may not use the material for commercial purposes
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original

© Fernán García de Zúñiga

**Last Updated:** 2026-03-01
