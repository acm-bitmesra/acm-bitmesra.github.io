# Architecture

- `app/` — route-oriented Next.js App Router pages.
- `components/` — reusable UI building blocks.
- `data/` — content and interfaces separated from presentation.
- `lib/` — site constants and URL helpers.
- `public/` — static assets such as robots and sitemap.
- `docs/` — maintainer documentation.
- `.github/workflows/` — static deployment automation.

## Future backend direction

Frontend → API → Authentication → Database → Services.

Potential future service domains: identity, events, projects, attendance, security, hostel, notifications, analytics.

The static site deliberately does not ship a fake backend or insecure client-side authentication.
