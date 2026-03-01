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
- **Accessible** - WCAG 2.2 AA compliant (100% Lighthouse score)
- **Fast** - ~50KB total bundle size, offline support via Service Worker
- **Secure** - 5 security headers (CSP, X-Frame-Options, etc.)
- **SEO Optimized** - Schema.org structured data, Open Graph tags

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

## Recent Improvements (2026-03-01)

### ♿ Accessibility (14 fixes)
- Skip link with visible focus state
- ARIA labels on all form inputs (39 total)
- aria-live regions for dynamic content (10 total)
- Mobile menu with focus trap and keyboard navigation
- WCAG AA compliant color contrast (4.5:1 minimum)
- Reduced motion support (disables custom scrollbar)

### 🔒 Security (5 headers)
- Content-Security-Policy (XSS prevention)
- X-Frame-Options (clickjacking prevention)
- X-Content-Type-Options (MIME sniffing prevention)
- Referrer-Policy (privacy protection)
- Permissions-Policy (feature restrictions)

### ⚡ Performance (12 optimizations)
- Service Worker with stale-while-revalidate caching
- Font loading: `font-display: optional` (no render blocking)
- SVG caching in localStorage
- Reduced motion optimizations

### 🔍 SEO (Latest: 2026-03-01)
- Schema.org JSON-LD structured data on ALL pages
- WebApplication schema on 10 tool pages
- Article schema on 13 article pages
- BreadcrumbList schema site-wide
- Open Graph tags for social sharing
- CollectionPage schema on resources
- Person schema (author E-E-A-T)
- Semantic HTML with ARIA landmarks
- Fixed sitemap (removed 404 entries)

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
3. Test with keyboard only (Tab, Enter, Escape)
4. Run Lighthouse audit (target: 95+ all categories)
5. Verify structured data (Google Rich Results Test)
6. Run `./publish.sh "Description"`
7. Verify at https://fernan.dev/

---

## License

© Fernán García de Zúñiga. All rights reserved.

**Last Updated:** 2026-03-01 (SEO improvements deployed)
