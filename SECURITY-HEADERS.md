# ============================================
# Security Headers Configuration for fernan.dev
# ============================================
# Last Updated: 2026-03-01
# ============================================

## Current Limitations

GitHub Pages (via Cloudflare) has limitations on setting security headers via `<meta>` tags:

### ❌ Cannot be set via `<meta>` (require HTTP headers):
- `Content-Security-Policy` (CSP) - **frame-ancestors directive ignored**
- `X-Frame-Options` - **Completely ignored in meta**
- `Strict-Transport-Security` (HSTS) - **Must be HTTP header**

### ✅ Work via `<meta>`:
- `X-Content-Type-Options`
- `X-XSS-Protection` (deprecated but harmless)
- `Referrer-Policy`
- `Permissions-Policy`
- `Cache-Control`

---

## Solution: Cloudflare Transform Rules

To properly set security headers on GitHub Pages:

### Option 1: Cloudflare Transform Rules (Recommended)

1. Go to: https://dash.cloudflare.com → Select Domain → **Rules** → **Transform Rules** → **Modify Response Header**

2. Create rule: **Security Headers**
   - **When incoming requests match:** Hostname equals `fernan.dev`
   - **Response header:**
     ```
     Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://static.cloudflareinsights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
     ```
   - **Operation:** Set static

3. Create rule: **X-Frame-Options**
   - **When incoming requests match:** Hostname equals `fernan.dev`
   - **Response header:**
     ```
     X-Frame-Options: DENY
     ```
   - **Operation:** Set static

4. Create rule: **HSTS**
   - **When incoming requests match:** Hostname equals `fernan.dev` AND Scheme equals `https`
   - **Response header:**
     ```
     Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
     ```
   - **Operation:** Set static

---

### Option 2: Cloudflare Page Rules (Legacy, simpler)

1. Go to: https://dash.cloudflare.com → Select Domain → **Rules** → **Page Rules**

2. Create rule: `fernan.dev/*`
   - **Settings:**
     - **Cache Level:** Cache Everything
     - **Edge Cache TTL:** 1 year
     - **Custom Headers:**
       - `X-Frame-Options: DENY`
       - `X-Content-Type-Options: nosniff`

*Note: Page Rules don't support CSP or HSTS headers*

---

### Option 3: GitHub Actions with Custom Headers

Use a GitHub Action to deploy to Cloudflare Pages or S3 + CloudFront with custom headers.

Example: Deploy to Cloudflare Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: fernan-dev
          directory: .
          wranglerConfig: wrangler.toml
```

`wrangler.toml`:
```toml
[[headers]]
for = "/*"
[headers.values]
  Content-Security-Policy = "default-src 'self'; frame-ancestors 'none'"
  X-Frame-Options = "DENY"
  X-Content-Type-Options = "nosniff"
  Strict-Transport-Security = "max-age=31536000"
```

---

## Current Meta Tags (Working)

These meta tags in `_includes/startHtml.html` provide partial protection:

```html
<!-- X-Content-Type-Options: Prevents MIME sniffing -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />

<!-- X-XSS-Protection: Legacy XSS filter (deprecated) -->
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />

<!-- Referrer-Policy: Controls referrer information -->
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

<!-- Permissions-Policy: Disables unnecessary browser features -->
<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" />

<!-- Cache-Control: Prevents transformation by proxies -->
<meta http-equiv="Cache-Control" content="no-transform" />
```

---

## Verification

After configuring Cloudflare Transform Rules, verify headers:

```bash
# Check all security headers
curl -I https://fernan.dev/

# Expected output:
# content-security-policy: default-src 'self'; ...
# x-frame-options: DENY
# strict-transport-security: max-age=31536000
# x-content-type-options: nosniff
# referrer-policy: strict-origin-when-cross-origin
```

---

## Priority Recommendations

| Priority | Action | Impact |
|----------|--------|--------|
| **High** | Add `X-Frame-Options: DENY` via Cloudflare | Prevents clickjacking |
| **High** | Add `Content-Security-Policy` with `frame-ancestors 'none'` | Prevents XSS + clickjacking |
| **Medium** | Add `Strict-Transport-Security` | Enforces HTTPS |
| **Low** | Keep existing meta tags | Partial protection |

---

## References

- [Cloudflare Transform Rules](https://developers.cloudflare.com/rules/transform/)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [HTTP Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
