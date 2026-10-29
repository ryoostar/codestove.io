# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based static website for CodeStove (코드스토브), an IT solutions company. The site is built using the OneFlow Jekyll theme, which is designed for creating one-page websites with multiple sections. The site is primarily in Korean (locale: ko-KR) and showcases services in Enterprise Software, AIoT, and IoT Business.

**Live URL**: https://codestove.io
**Repository**: ryoostar/codestove.io

## Development Commands

### Local Development with Docker
```bash
docker compose up
```
The site will be available at `http://0.0.0.0:4000/`

### JavaScript Build Commands
```bash
# Minify and build JavaScript
npm run build:js

# Watch JavaScript files for changes and rebuild
npm run watch:js

# Uglify JavaScript manually
npm run uglify
```

### Jekyll/Ruby Setup (if not using Docker)
```bash
bundle install
bundle exec jekyll serve
```

## Architecture and Structure

### Site Configuration
- **_config.yml**: Main Jekyll configuration file containing:
  - Theme skin selection (default, air, aqua, contrast, dark, dirt, neon, mint, plum, sunrise)
  - Site metadata (title, locale, URL, repository)
  - Masthead settings (sticky navigation, opacity, background images)
  - Footer links and copyright
  - Jekyll plugins configuration

### Content Structure
- **_pages/**: Contains main page content
  - `index.html`: Homepage with multiple sections (Enterprise Software, AIoT, IoT Business, Contact Us)
  - `imprint.md`: Legal/imprint information
  - Sections are defined inline using `<section>` tags with IDs matching navigation anchors

- **_data/navigation.yml**: Navigation menu configuration
  - Defines anchor links to sections on the homepage
  - Each entry has title (Korean), URL (anchor link), and description

### Layout System
- **_layouts/**: Jekyll layout templates
  - `default.html`: Base layout wrapper
  - `page.html`: Extends default layout for pages

- **_includes/**: Reusable components
  - `masthead.html`: Site header and navigation
  - `footer.html`: Site footer with links
  - `page__hero.html`: Hero section with overlay images
  - `image-text-row`: Component for image+text rows
  - `gallery`: Gallery component for showcasing images
  - `popup.html`: Cookie/CDN consent banner (controlled by `show-popup` in _config.yml)
  - `cs-hero.html`: Typographic homepage hero (rolling keyword, floating tags, gradient blobs). Included from `_pages/index.html`; the theme's `page__hero.html` is no longer used on the homepage.
  - `head/custom.html`: Favicons + Pretendard webfont + AOS CSS (CDN)
  - `scripts.html`: Loads `main.min.js`, then AOS JS (CDN) and `assets/js/codestove.js`
  - `editables/`: Custom editable components

### Styling
- **_sass/oneflow/**: SCSS source files organized by component
  - `_variables.scss`: Theme variables and colors
  - `_sections.scss`: Section-specific styles
  - `_boxes.scss`: Box/card component styles
  - `skins/`: Color scheme variations (10 themes available)
  - Main entry point: `oneflow.scss`

- **_sass/_custom-styles.scss**: Custom overrides (imported by `assets/css/main.scss`). This is the ACTIVE file.
  `assets/css/custom-styles.css` is a stale, unused copy — do not edit it.
- **_sass/_codestove.scss**: CodeStove design system (design tokens, glass masthead, typographic hero, AOS helpers, reduced-motion). Imported last in `main.scss`.
- **_sass/oneflow/skins/_codestove.scss**: Active skin (`oneflow-skin: "codestove"`). Sets Pretendard as the global font and brand colors.

### JavaScript
- **assets/js/**:
  - `_main.js`: Main JavaScript source (unminified)
  - `main.min.js`: Production minified bundle (generated)
  - `codestove.js`: Not part of the bundle. Initializes AOS (`once: true`, 800ms) and runs the hero rolling keyword. Honors `prefers-reduced-motion`.
  - `plugins/`: jQuery plugins (fitvids, magnific-popup, greedy-navigation, smooth-scroll, gumshoe, etc.)
  - `vendor/jquery/`: jQuery library
  - Build process concatenates and minifies all JS files into `main.min.js`

### Assets
- **assets/images/**: Site images (header backgrounds, logos, content images)
- **assets/fonts/**: Custom web fonts
- **assets/webfonts/**: Font Awesome icon fonts

## Content Management

### Adding New Sections
1. Add section markup in `_pages/index.html` with unique ID
2. Add navigation link in `_data/navigation.yml` pointing to section ID
3. Use front matter variables for reusable content (gallery, image-text-row, etc.)

### Image Text Rows
Define in page front matter:
```yaml
image-text-row:
  - header: "Section Title"
    excerpt: "Description text"
    image-url: "/assets/images/example.webp"
    image-width: "500px"
    image-right: false  # or true to position image on right
```
Include in page: `{% include image-text-row %}`

### Galleries
Define in page front matter:
```yaml
gallery:
  - url: /assets/images/full-size.webp
    image_path: /assets/images/thumb.webp
    alt: "Alt text"
    title: "Title"
```
Include in page: `{% include gallery %}`

### Theme Customization
- Change color scheme: Edit `oneflow-skin` in `_config.yml`
- Modify masthead behavior: Set `sticky-masthead` and `masthead-opacity` in `_config.yml`
- Add/remove footer links: Edit `footer.links` array in `_config.yml`

## Jekyll Plugins

Active plugins (github-pages compatible):
- jekyll-sitemap: Generates sitemap.xml
- jekyll-gist: Embed GitHub gists
- jekyll-feed: Generates RSS/Atom feed
- jekyll-include-cache: Caches include files for performance
- jekyll-algolia: Search integration (configured but may not be active)
- jemoji: GitHub-style emoji support

## Deployment Configuration

### Git Remotes
This checkout has a single remote, and it is the production repository:
```bash
origin    https://github.com/ryoostar/codestove.io   # Production repo (GitHub Pages)
```
Older notes mentioned a separate `codestove.io` remote for production and `origin`
pointing at a development repo (shine-codestove/codestove-site). That is no longer the
case here — run `git remote -v` before deploying and push to whichever remote points at
`ryoostar/codestove.io`.

### Deployment Process
```bash
# 1. Test locally (Docker, or the `jekyll` config in .claude/launch.json)
docker compose up

# 2. Commit changes on your working branch
git add -A
git commit -m "Your commit message"

# 3. Fast-forward main (from the main checkout) and push to the production repository
git merge --ff-only <your-branch>
git push origin main

# 4. GitHub Pages builds and deploys automatically (1-2 minutes);
#    check with: gh run list --repo ryoostar/codestove.io --limit 1
```
Deploying is pushing `main` to `ryoostar/codestove.io`. Feature branches are not built.

### _config.yml Production Settings
```yaml
url: "https://codestove.io"
baseurl: ""  # Empty for root domain
repository: "ryoostar/codestove.io"
show-popup: false  # Cookie banner disabled
```

### GitHub Pages Configuration
- **Custom Domain**: www.codestove.io (defined in CNAME file)
- **HTTPS Enforcement**: Enabled
- **Source Branch**: main
- **Build**: Automatic via GitHub Actions

### DNS Configuration
Domain registrar settings for codestove.io:

**Apex Domain (A Records):**
```
Type: A
Name: @ (or leave empty)
Values:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
```

**www Subdomain (CNAME):**
```
Type: CNAME
Name: www
Value: ryoostar.github.io
```

**URL Behavior:**
- codestove.io → redirects to → https://www.codestove.io
- www.codestove.io → https://www.codestove.io
- All HTTP requests → redirects to → HTTPS

### Custom Design Features

**Active stylesheets** (compiled via `assets/css/main.scss`):
- `_sass/_codestove.scss` – the CodeStove design system (redesign started 2026-10-29): CSS tokens (`--cs-*`), glass masthead, typographic hero, section layout (`--cs-max` reading width, centered `h1`/muted `h2`, `.cs-section-intro`), `.cs-feature` cards, image rows, contact cards, `.cs-badge`, `.cs-legal` page, responsive + reduced-motion rules. Put new styles here.
- `_sass/_custom-styles.scss` – the few older customizations still active (smooth scroll, gallery hover, section separator, itr hover). Everything else (highlight boxes, contact cards, IoT ad grid, the whole portfolio page) moved to `_codestove.scss`.
- `assets/css/custom-styles.css` is an old, unused copy. Do not edit it.

**Design Components (index page, top to bottom):**
- **Hero** (`_includes/cs-hero.html`): eyebrow pill, title with rolling gradient keyword (`.cs-roll`), lead, dark/ghost CTAs, proof strip (`.cs-hero__proof` – numbers count up via `data-count`; keep them in sync with the portfolio stats), floating tags, blurred gradient blobs, dot grid, scroll indicator.
- **Clients marquee** (`_includes/cs-clients.html`, data in `_data/clients.yml`): full-bleed band under the hero; two identical `.cs-marquee__track` lists (second is `aria-hidden`) scroll with a CSS keyframe, pause on hover, wrap statically under reduced motion.
- **Enterprise**: `.cs-feature` cards (AI / full-stack) + `.cs-value` cards (성능 · 안정성 · 확장성). The old `figure.third` stock-image tiles were removed (files still in `assets/images/software-*.webp`).
- **AIoT**: image rows (`.itr-container`); the image containers carry `data-parallax="0.1"`. `codestove.js` writes a `--py` custom property on them and the stylesheet applies it to `.itr-image`, so the measured rect never includes the offset. Disabled under 768px and under reduced motion.
- **IoT Business**: `.cs-notice` (legal obligation callout), three `.cs-strength` cards, the `.cs-process` stepper (five `.cs-step` items; one is `.is-active`, auto-advances every 3s while in view, pauses on hover, click/Enter/Space selects) and the `.cs-iot-contact` pill (phone + iot@codestove.io). This replaced the two `iot-advertise-*.png` images; their text content was moved into the markup.
- **Portfolio preview** (`#projects`): `.cs-carousel` with a scroll-snap `.cs-carousel__track` of `.cs-project` cards rendered from `_data/featured_projects.yml` (keep it in sync with `_pages/portfolio.html`), prev/next buttons, and a link to `/portfolio/`.
- **Contact**: dark `.cs-contact` block (same look as the portfolio CTA) holding the three `.contact-card.contact-card--glass` cards.

**Portfolio page (`_pages/portfolio.html`):** compact typographic hero (`.cs-page-hero`, no stock photo), pill filter buttons, alternating timeline with white cards and black year pills, white stat cards whose numbers count up (`.stat-number[data-count][data-suffix]`), and a dark CTA block (`.portfolio-cta`, `.cs-btn--light`). The timeline/stat reveal uses the page's own IntersectionObserver (`.visible`), not AOS; the count-up lives in `codestove.js`. All portfolio styles are in `_codestove.scss`.

**Motion (`assets/js/codestove.js`, loaded after AOS in `_includes/scripts.html`):**
- `AOS.init` (once, 700ms, offset 60); hero keyword rolls every 3s; `.masthead.is-scrolled` is toggled after 12px of scroll (adds a shadow); any `[data-count]` element counts up when scrolled into view (`data-suffix`, optional `data-count-delay` in ms); `[data-parallax]` images drift on scroll; `.cs-process` auto-highlights steps; `.cs-carousel` buttons scroll by one card.
- No GSAP/Swiper: parallax, the stepper and the carousel are small vanilla implementations in `codestove.js`, so the only third-party scripts are jQuery (bundled) and AOS (CDN).
- Put `data-aos` on elements INSIDE a `section.site-section`, never on the section itself (the theme positions sections with `translateX(-50%)`; AOS would override that transform). `_codestove.scss` also force-neutralizes any `section.site-section[data-aos]`.
- `body { overflow-x: hidden }` is required because `fade-left/right` slide elements in from off-canvas.
- All decorative motion is disabled under `prefers-reduced-motion`.

**Cache busting:** `main.css` and `codestove.js` are linked with `?v={{ site.time | date: '%s' }}` (`_includes/head.html`, `_includes/scripts.html`), so every build gets a fresh URL. Without this the browser kept serving stale JS during local development.

**Local dev without Docker:** `.claude/launch.json` defines a `jekyll` config (`bundle exec jekyll serve --livereload` on port 4000). `_config.yml` changes still need a server restart.

**Content notes:**
- `/imprint` (`_pages/imprint.md`) is a Korean site notice / privacy page, linked from the footer copyright line. It lists the CDNs the site loads from; update it if you add or remove third-party resources.
- Portfolio "년간 운영" stat is computed from 2022 at build time (`site.time`).
- Footer social links come from `footer.links` in `_config.yml`; entries without `url` are skipped by `_includes/footer.html`.

**Data files:** `_data/clients.yml` (marquee), `_data/featured_projects.yml` (homepage carousel: title, year, category `iot|web|platform|marketing`, category_label, icon, client, summary).

**Important Design Notes:**
- Images use `.webp` format for optimal performance
- Color palette: `--cs-blue #3b9cba`, `--cs-purple #6f42c1`, `--cs-orange #ff7a45`, ink `#14191f`
- All text content is in Korean

### Troubleshooting

**Images not loading:**
- Ensure images are pushed to the repository
- Verify paths start with `/assets/images/`
- Check file extensions (.webp, .png, etc.)
- Wait for GitHub Pages build to complete

**HTTPS not working:**
1. Check CNAME file exists and contains correct domain
2. Verify DNS settings point to GitHub Pages IPs
3. In GitHub Settings → Pages, remove and re-add custom domain
4. Wait up to 24 hours for SSL certificate provisioning

**Changes not appearing:**
- Make sure `main` was pushed to the remote that points at `ryoostar/codestove.io` (here: `origin`); feature branches are not deployed
- Check GitHub Actions for build status
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- _config.yml changes require Docker restart: `docker compose restart`

## Important Notes

- This is a fork of the OneFlow theme, not a gem-based theme, so theme files are directly editable
- Site uses webp image format for performance
- Korean language content throughout
- Background images and overlays configured in both `_config.yml` and page front matter
- Masthead is sticky by default with 0.85 opacity
- HTML compression is enabled for production builds (disabled in development env)
- Docker is the recommended development environment (no local Ruby/Jekyll setup needed)
- Cookie consent banner is disabled (`show-popup: false` in _config.yml)
