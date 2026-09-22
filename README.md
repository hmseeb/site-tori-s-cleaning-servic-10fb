# Tori's Cleaning Service — Website

A production-ready, single-page marketing website for **Tori's Cleaning Service**, a locally owned
residential and commercial cleaning business serving the Greater Houston metro.

## Stack

Vanilla HTML, CSS, and JavaScript — no build step, no dependencies, no environment variables.
Open `index.html` in a browser or serve the folder with any static host.

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
.
├── index.html            # Entry point — the entire single-page site
├── favicon.svg           # Favicon / app icon
├── site.webmanifest      # PWA manifest
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/styles.css    # All styles (design tokens, layout, responsive)
    └── js/main.js        # Nav, scroll spy, reveals, counters, slider, form validation
```

## Sections

1. **Announcement bar** — current booking availability
2. **Sticky header** with responsive navigation and a Call Now CTA
3. **Hero** — business name, tagline, dual CTA, trust markers
4. **Stats strip** — animated counters
5. **Services** — six service cards plus popular add-ons
6. **How It Works** — three-step process
7. **Why Tori's** — about the team and guarantees
8. **Service Areas** — Houston metro cities covered
9. **Testimonials** — accessible slider (autoplay, arrows, dots, swipe, keyboard)
10. **CTA band** — Call Now / Request a Quote
11. **Contact** — phone, email, service area, hours, and a validated quote form
12. **Footer** + sticky mobile call bar + back-to-top

## Features

- Fully responsive (mobile-first breakpoints at 1040 / 900 / 680 / 420 px)
- Semantic HTML5 landmarks, skip link, ARIA labels, visible focus states
- `prefers-reduced-motion` and print stylesheets respected
- SEO: meta description, canonical, Open Graph, Twitter cards, `HouseCleaningService`
  JSON-LD structured data
- Client-side form validation with inline errors; submission composes a pre-filled email
  (no backend or third-party API required)

## Images

All photography is sourced from Pexels and selected per section for topical relevance
(recurring cleaning, deep cleaning, move-out, kitchen/bath detail, commercial, post-construction,
laundry add-on, and the team). Every image carries descriptive, business-specific alt text.

## Contact

- Phone / text: (713) 555-0142
- Email: hello@toriscleaningservice.com
- Service area: Houston, TX and the surrounding metro
- Hours: Mon–Fri 7am–7pm · Sat 8am–4pm CT
