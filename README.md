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
├── _includes/                 # Jekyll includes
├── styles/                    # 16 CSS files
├── scripts/                   # 9 JS files
├── data/                      # JSON data files
├── fonts/                     # Custom fonts
├── favicon/                   # PWA icons
└── *.sh                       # Deployment scripts
```

---

## Scripts

| Script | Usage | Purpose |
|--------|-------|---------|
| `./publish.sh "msg"` | `./publish.sh "feat: add tool"` | Commit and push changes |
| `./history.sh [-n N]` | `./history.sh -n 10` | View commit history |
| `./rebase.sh` | `./rebase.sh` | Pull + rebase + push |
| `./restore.sh` | `./restore.sh` | ⚠️ Reset to origin/main |

---

## Development Workflow

```
1. TASK → 2. Read README + ./history.sh → 3. PLAN → 4. BUILD → 5. Update sitemap.xml → 6. Update README.md → 7. ./publish.sh → 8. If error: ./rebase.sh → 9. VERIFY
```

**Quick Reference:**
```bash
./history.sh -n 10          # View recent commits
./publish.sh "feat: ..."    # Publish changes
./rebase.sh                 # If push fails
./restore.sh                # Restore files from repo (⚠️ loses changes)
```

---

## Jekyll Includes

```liquid
---
---
{% include startHtml.html %}
<title>...</title>
<meta name="description" content="...">
<link rel="canonical" href="...">
<link rel="stylesheet" href="/styles/page.css">
{% include startBody.html %}
<h1>Title</h1>
<p>Content...</p>
<script src="/scripts/page.js"></script>
{% include endBodyHtml.html %}
```

**Rules:**
1. Start with `---` `---` (empty front matter)
2. Don't add `<html>`, `<head>`, `<body>` in pages
3. Page content between comment markers

**Includes:** `startHtml`, `startBody`, `endBodyHtml`, `structured-data`, `structured-data-tool`, `structured-data-articles`

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Contributing

1. Test in Chrome, Firefox, Safari
2. Test on mobile + keyboard
3. Run Lighthouse (target: 95+)
4. `./publish.sh "Description"`
5. Verify at https://fernan.dev/

---

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — Share and adapt for non-commercial purposes with attribution.

---
