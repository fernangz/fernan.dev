# fernan.dev

FrontEnd development tools, articles, and resources. A collection of practical utilities and educational content for web developers.

**Live Site:** https://fernan.dev/

---

## Project Status

**Status:** ✅ Production Ready

The website is fully functional with all core features implemented:
- 10 interactive tools (color tools, code formatters, reference guides)
- 13 articles covering FrontEnd fundamentals to advanced topics
- 20 curated external resources
- Mobile-first responsive design
- WCAG AA accessibility compliance
- Dark theme with high contrast

---

## Architecture

### Technology Stack
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid, no frameworks
- **Vanilla JavaScript** - No dependencies, modular architecture
- **Git + GitHub** - Version control and deployment

### Design Principles
1. **Mobile-first** - All styles start with mobile, enhance for desktop
2. **Accessibility** - WCAG AA contrast ratios, keyboard navigation, ARIA labels
3. **Performance** - No external dependencies, minimal CSS/JS
4. **Maintainability** - Consistent naming, modular structure, documented code

### Color System
```css
--black: hsl(0, 0%, 8%)    /* Background */
--dark: hsl(0, 0%, 24%)    /* Cards, sections */
--gray: hsl(0, 0%, 40%)    /* Borders, secondary */
--light: hsl(0, 0%, 80%)   /* Text, buttons */
--white: hsl(0, 0%, 96%)   /* Highlights */
```

### Typography Scale
```css
--font-xs: clamp(1rem, 0.95rem + 0.25dvw, 1.125rem)
--font-sm: clamp(1.125rem, 1.05rem + 0.35dvw, 1.25rem)
--font-md: clamp(1.25rem, 1.15rem + 0.5dvw, 1.5rem)    /* Base */
--font-lg: clamp(1.5rem, 1.35rem + 0.75dvw, 1.75rem)
--font-xl: clamp(1.75rem, 1.55rem + 1dvw, 2rem)
--font-2xl: clamp(2rem, 1.75rem + 1.25dvw, 2.25rem)
--font-3xl: clamp(2.25rem, 2rem + 1.5dvw, 2.75rem)
```

---

## File Structure

```
fernan.dev/
├── index.html                 # Homepage (Brief)
├── about/
│   └── index.html            # About page
├── tools/
│   ├── index.html            # Tools index
│   ├── color/
│   │   └── index.html        # Color tools (merged)
│   ├── box-shadow/
│   │   └── index.html        # Box shadow generator
│   ├── html-entities/
│   │   └── index.html        # HTML entities converter
│   ├── json-formatter/
│   │   └── index.html        # JSON formatter
│   ├── base64/
│   │   └── index.html        # Base64 encoder/decoder
│   ├── unit-converter/
│   │   └── index.html        # CSS unit converter
│   ├── mime-types/
│   │   └── index.html        # MIME types reference
│   ├── iso-language-codes/
│   │   └── index.html        # ISO language codes
│   ├── symbols-emojis/
│   │   └── index.html        # Symbols & emojis
│   └── client-data-visualizer/
│       └── index.html        # Client data viewer
├── articles/
│   ├── index.html            # Articles index
│   ├── the-dom/
│   ├── cascade-of-styles/
│   ├── ecmascript/
│   ├── javascript-events/
│   ├── number-8/
│   ├── flexbox-grid/
│   ├── responsive-design/
│   ├── css-custom-properties/
│   ├── web-accessibility/
│   ├── web-security/
│   ├── browser-devtools/
│   ├── performance-optimization/
│   └── seo-llmo/
├── resources/
│   └── index.html            # Resources index
├── styles/
│   ├── main.css              # Core styles (nav, layout, typography)
│   ├── tools.css             # Shared tool styles (buttons, cards)
│   ├── tools-cards.css       # Tool card grid layout
│   ├── color.css             # Color tools specific styles
│   ├── 8bit-icon.css         # 8-bit icon tool styles
│   ├── base64.css            # Base64 tool styles
│   ├── client-data.css       # Client data tool styles
│   ├── shadow-generator.css  # Box shadow tool styles
│   ├── json-formatter.css    # JSON formatter styles
│   ├── unit-converter.css    # Unit converter styles
│   ├── html-entities.css     # HTML entities styles
│   ├── symbols-emojis.css    # Symbols tool styles
│   ├── symbols.css           # HTML entities tool styles
│   ├── contrast-checker.css  # Contrast checker styles
│   ├── speech.css            # Speech to text styles
│   ├── data-table.css        # Data table component
│   └── 404.css               # 404 page styles
├── scripts/
│   ├── main.js               # Core JS (nav, scroll, SVG loader)
│   ├── color.js              # Color tools logic
│   ├── 8bit-icon.js          # 8-bit icon tool logic
│   ├── base64.js             # Base64 tool logic
│   ├── client-data.js        # Client data tool logic
│   ├── box-shadow.js         # Box shadow tool logic
│   ├── json-formatter.js     # JSON formatter logic
│   ├── unit-converter.js     # Unit converter logic
│   └── [tool-name].js        # Individual tool scripts
├── data/
│   ├── emoji.json            # Emoji data
│   └── symbols.json          # Symbol data
├── svgs/
│   ├── logo.svg              # Site logo
│   └── plus.svg              # Menu icon
├── fonts/
│   ├── outfit.ttf            # Main font
│   ├── emoji.ttf             # Emoji font
│   └── FiraCode.ttf          # Code font
├── favicon/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── 404.html                  # Custom 404 page
├── robots.txt                # Search engine directives
├── sitemap.xml               # XML sitemap
├── publish.sh                # Deployment script ⚠️
├── README.md                 # This file
└── CNAME                     # GitHub Pages domain
```

---

## Main Features

### Tools (10)

| Tool | Description |
|------|-------------|
| **Color Tools** | Color picker, format converter (HEX/RGB/HSL/HSV), palette generator, WCAG contrast checker |
| **Box Shadow** | CSS box-shadow generator with live preview |
| **HTML Entities** | Convert special characters to HTML entity codes |
| **JSON Formatter** | Format, validate, and minify JSON data |
| **Base64** | Encode and decode Base64 strings |
| **Unit Converter** | Convert between px, rem, em, vh, vw, % |
| **MIME Types** | Look up MIME type definitions |
| **ISO Language Codes** | Reference ISO 639-1 language codes |
| **Symbols & Emojis** | Browse and copy symbols and emojis |
| **Client Data** | View cookies, localStorage, sessionStorage |

### Articles (13)

| Category | Articles |
|----------|----------|
| **Fundamentals** | The DOM, CSS Cascade, ECMAScript, Event Handling |
| **Layout** | Flexbox & Grid, Responsive Design, 8-Point Grid |
| **Quality** | Accessibility, Security, Performance |
| **Optimization** | DevTools, CSS Variables, SEO & LLMO |

### Resources (20)

Curated free and open-source tools:
- Code editors (VSCodium)
- Design tools (Penpot, Inkscape, Krita, Blender)
- Media tools (Kdenlive, Audacity, OBS)
- Fonts (Outfit, Fira Code, Rasa, Noto Emoji)
- Icons (Material Symbols, Heroicons, Feather)
- Documentation (MDN, web.dev, Can I Use)

---

## Deployment

### ⚠️ MANDATORY: Using publish.sh

**After making ANY changes to the codebase, you MUST run the publish script:**

```bash
./publish.sh "Your commit message describing the changes"
```

**If you modified HTML files, also update the sitemap:**

```bash
# 1. Update sitemap.xml with current date
# Edit sitemap.xml and update <lastmod> dates for changed pages

# 2. Commit sitemap with your changes
./publish.sh "Updated pages, refreshed sitemap"
```

**Why this is mandatory:**
1. The script stages all changed files automatically
2. Commits with the provided message using the configured git user
3. Pushes to the `main` branch on GitHub
4. Triggers GitHub Pages deployment
5. Ensures consistent commit history

**Do NOT use these commands directly:**
- ❌ `git add .`
- ❌ `git commit -m "..."`
- ❌ `git push`

**Always use:**
- ✅ `./publish.sh "Your message"`

### Making Changes

```bash
# 1. Edit your files
nano styles/main.css

# 2. Test locally (open in browser)
open index.html

# 3. Deploy changes
./publish.sh "Fixed mobile navigation spacing"

# 4. Verify deployment
# Visit https://fernan.dev/
```

### Script Contents

The `publish.sh` script:
```bash
#!/bin/bash
git add -A
git commit -m "$1"
git push origin main
```

---

## Git & Version Control

### Project History

**For commit history and project evolution, always use git:**

```bash
# View commit history
git log --oneline

# View detailed commit history
git log

# View last N commits
git log -n 10

# View changes in a specific commit
git show <commit-hash>

# View file change history
git log --follow path/to/file.css

# View who changed what and when
git log --pretty=format:"%h - %an, %ar : %s"

# View changes between commits
git diff <commit-1> <commit-2>
```

### Useful Git Commands

```bash
# Check current status
git status

# View recent changes
git diff HEAD

# View commit history for specific file
git log --oneline styles/main.css

# Find when something changed
git log -S "search term" --oneline

# View blame (who last modified each line)
git blame path/to/file.css
```

### Git is Source of Truth

- ✅ **Commit history:** `git log`
- ✅ **File changes:** `git diff`
- ✅ **Author information:** `git log --format="%an"`
- ✅ **Change dates:** `git log --format="%ad"`
- ✅ **Project status:** `git status`

**Do not rely on stored memory for project history—git tracks all changes accurately.**

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 14+ | ✅ Full |
| Chrome Mobile | 90+ | ✅ Full |

---

## Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Lighthouse Score | 90+ | 95+ |
| First Contentful Paint | < 1s | ~0.5s |
| Time to Interactive | < 2s | ~1s |
| Total Bundle Size | < 100KB | ~50KB |

---

## Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Focus indicators on all interactive elements
- ✅ ARIA labels on buttons and inputs
- ✅ Skip link for keyboard users
- ✅ Reduced motion support (`prefers-reduced-motion`)

---

## Contributing

1. Make your changes
2. Test in multiple browsers (Chrome, Firefox, Safari)
3. Test on mobile devices
4. Run `./publish.sh "Description of changes"`
5. Verify deployment at https://fernan.dev/

---

## License

All content and code © Fernán García de Zúñiga. All rights reserved.

---

**Last Updated:** 2025-02-28
