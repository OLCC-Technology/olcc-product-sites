# OLCC Product Sites — monorepo

Marketing sites and interactive demos for all OLCC Technology *Flow products.

| Product       | Subdomain (planned)              | Live? |
| ------------- | -------------------------------- | ----- |
| CarwashFlow   | carwashflow.olcc.com.my          | ✅    |
| BeautyFlow    | beautyflow.olcc.com.my           | —     |
| FoodFlow      | foodflow.olcc.com.my             | —     |
| FleetFlow     | fleetflow.olcc.com.my            | —     |
| YogaFlow      | yogaflow.olcc.com.my             | —     |

> **Migration note:** legacy per-product repos (`eduflow-landing`, `tripflow-demo`) will be folded into this monorepo as those products are refreshed.

## How it works

The site is a thin Next.js 15 wrapper around a folder of static HTML files. The HTML is generated once (via the `olcc-sales-toolkit` Claude skill) and copied verbatim into `public/`. Next.js handles routing, subdomain rewrites, and Vercel deployment — it never re-renders the HTML.

```
public/carwashflow/index.html       # landing page
public/carwashflow/demo/index.html  # interactive demo
```

Two layers of routing put those files at clean URLs:

1. **`middleware.ts`** — maps the subdomain to a product slug.
   `carwashflow.olcc.com.my/demo` → internally `/carwashflow/demo`.
2. **`next.config.ts` rewrites** — map clean paths to the `.html` files.
   `/carwashflow/demo` → `/carwashflow/demo/index.html`.

The bare apex (`olcc.com.my` or the Vercel default domain) falls through to `app/page.tsx`, which lists every product.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Open these URLs to verify routing:

| URL                                  | What you should see                  |
| ------------------------------------ | ------------------------------------ |
| http://localhost:3000                | Product index (lists CarwashFlow)    |
| http://localhost:3000/carwashflow    | CarwashFlow landing page             |
| http://localhost:3000/carwashflow/demo | CarwashFlow interactive demo       |

To test the subdomain rewrite locally, edit `/etc/hosts`:

```
127.0.0.1  carwashflow.localhost
```

Then visit `http://carwashflow.localhost:3000/` and `http://carwashflow.localhost:3000/demo`.

## Editing content (most common task)

You almost never need to touch any `.ts` / `.tsx` files. Marketing copy, pricing, FAQ, WhatsApp links — all live inside the static HTML.

**See [`CONTENT.md`](./CONTENT.md) for the field-by-field edit guide.**

After editing:

```bash
git add public/
git commit -m "carwashflow: update Q4 pricing"
git push                  # Vercel auto-deploys on push to main
```

## Adding a new *Flow product

1. Generate the landing + demo HTML using the `olcc-sales-toolkit` skill.
2. `mkdir -p public/<slug>/demo` and drop the two HTML files in.
3. Add two rewrite entries to `next.config.ts`:
   ```ts
   { source: "/<slug>",        destination: "/<slug>/index.html" },
   { source: "/<slug>/demo",   destination: "/<slug>/demo/index.html" },
   ```
4. Add the slug to `PRODUCT_SLUGS` in `middleware.ts`.
5. Add the product entry to `lib/constants.ts` and `app/page.tsx`.
6. In Vercel dashboard, add `<slug>.olcc.com.my` as a domain on this project.

## Deployment

Auto-deploys from GitHub `main` branch to Vercel. Preview deploys for every PR.

Live since 2026-05-23.

- **Production:** `main` → https://olcc-product-sites.vercel.app (custom domain to follow)
- **Preview:** any PR → `olcc-product-sites-git-<branch>-ongcheongwei-ais-projects.vercel.app`

See [`DEPLOY.md`](./DEPLOY.md) for the one-time GitHub + Vercel setup steps.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- pnpm
- Node ≥ 18.17

— OLCC Technology Sdn. Bhd. · Johor Bahru
