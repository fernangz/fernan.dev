# ============================================
# Cache Header Configuration for fernan.dev
# ============================================
# Last Updated: 2026-03-01
# ============================================

## Current Status

### ⚠️ Recommended: Cloudflare Cache Rules
GitHub Pages uses Cloudflare CDN with default 10-minute cache TTL.
To set 1-year cache lifetimes, configure Cloudflare Cache Rules:

# Cloudflare Cache Rules Configuration
# Go to: https://dash.cloudflare.com > Select Domain > Caching > Cache Rules
# Create the following rules:

# Rule 1: Static Assets (1 Year)
# ─────────────────────────────────────────────────────────────────────────────
# If incoming request:
#   URI Path contains: /fonts/ OR /styles/ OR /scripts/ OR /favicon/ OR /svgs/
# Then:
#   Cache Level: Cache Everything
#   Edge Cache TTL: 31536000 seconds (1 year)
#   Respect Existing Headers: Disabled
# ─────────────────────────────────────────────────────────────────────────────

# Rule 2: HTML Pages (No Cache / Short TTL)
# ─────────────────────────────────────────────────────────────────────────────
# If incoming request:
#   URI Path ends with: .html OR URI Path equals: /
# Then:
#   Cache Level: Cache Everything
#   Edge Cache TTL: 3600 seconds (1 hour)
#   Browser Cache TTL: 300 seconds (5 minutes)
# ─────────────────────────────────────────────────────────────────────────────

# Rule 3: Data Files (1 Month)
# ─────────────────────────────────────────────────────────────────────────────
# If incoming request:
#   URI Path contains: /data/
# Then:
#   Cache Level: Cache Everything
#   Edge Cache TTL: 2592000 seconds (30 days)
# ─────────────────────────────────────────────────────────────────────────────

# Alternative: Cloudflare Page Rule (Legacy, but still works)
# ─────────────────────────────────────────────────────────────────────────────
# URL Pattern: fernan.dev/fonts/*
# Settings:
#   - Cache Level: Cache Everything
#   - Edge Cache TTL: 1 year
#
# URL Pattern: fernan.dev/styles/*
# Settings:
#   - Cache Level: Cache Everything
#   - Edge Cache TTL: 1 year
#
# URL Pattern: fernan.dev/scripts/*
# Settings:
#   - Cache Level: Cache Everything
#   - Edge Cache TTL: 1 year
#
# URL Pattern: fernan.dev/favicon/*
# Settings:
#   - Cache Level: Cache Everything
#   - Edge Cache TTL: 1 year
#
# URL Pattern: fernan.dev/svgs/*
# Settings:
#   - Cache Level: Cache Everything
#   - Edge Cache TTL: 1 year
# ─────────────────────────────────────────────────────────────────────────────

# Expected Results After Configuration:
# ─────────────────────────────────────────────────────────────────────────────
# Resource Type          | Current TTL | New TTL    | Savings
# ───────────────────────┼─────────────┼────────────┼──────────
# Fonts (.ttf)           | 10 minutes  | 1 year     | 99.9%
# Stylesheets (.css)     | 10 minutes  | 1 year     | 99.9%
# JavaScript (.js)       | 10 minutes  | 1 year     | 99.9%
# Favicons (.png, .ico)  | 10 minutes  | 1 year     | 99.9%
# SVGs (.svg)            | 10 minutes  | 1 year     | 99.9%
# HTML Pages             | 10 minutes  | 1 hour     | 83%
# Data Files (.json)     | 10 minutes  | 30 days    | 99.7%
# ─────────────────────────────────────────────────────────────────────────────

# Verification:
# ─────────────────────────────────────────────────────────────────────────────
# After configuring Cloudflare, verify cache headers with:
#
# curl -I https://fernan.dev/fonts/outfit.ttf
# curl -I https://fernan.dev/styles/main.css
# curl -I https://fernan.dev/scripts/main.js
#
# Expected response headers:
#   cache-control: public, max-age=31536000
#   cf-cache-status: HIT (after first request)
# ─────────────────────────────────────────────────────────────────────────────

# Notes:
# ─────────────────────────────────────────────────────────────────────────────
# 1. GitHub Pages default cache TTL is 10 minutes (600 seconds)
# 2. Cloudflare Free plan supports Cache Rules
# 3. For versioned assets (e.g., main.abc123.js), 1-year cache is safe
# 4. HTML pages should have shorter TTL to allow content updates
# 5. Use cache-busting query strings when updating files:
#    Example: /styles/main.css?v=20260301
# ─────────────────────────────────────────────────────────────────────────────
