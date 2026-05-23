# Deployment — one-time setup

This is the cookbook for getting `olcc-product-sites` from local repo to live on `carwashflow.olcc.com.my`. You only need to do this once; after that, every `git push` to `main` deploys automatically.

---

## Prerequisites

Install these CLIs once (Node 18+ and pnpm assumed already installed):

```bash
# GitHub CLI — for creating the repo
brew install gh                              # if you have Homebrew
# OR download .pkg from https://github.com/cli/cli/releases/latest

# Vercel CLI — for linking the project
pnpm add -g vercel
```

Then authenticate:

```bash
gh auth login                                # choose GitHub.com → HTTPS → browser
vercel login                                 # use your OLCC email
```

---

## Step 3 — push to GitHub

From the repo root:

```bash
cd ~/projects/olcc-product-sites

git init
git add .
git commit -m "Initial commit: monorepo skeleton + CarwashFlow landing & demo"
git branch -M main

# Create private repo under OLCC-Technology org and push in one shot
gh repo create OLCC-Technology/olcc-product-sites \
  --private \
  --source=. \
  --remote=origin \
  --push \
  --description "Marketing sites + demos for OLCC *Flow products"
```

Verify: `gh repo view --web`

---

## Step 4 — deploy to Vercel

From the same repo root:

```bash
vercel link --scope=OLCC-Technology         # creates .vercel/, picks team
vercel                                       # preview deploy (one-time)
vercel --prod                                # promote to production
```

Vercel will autodetect Next.js — accept all defaults.

You'll get two URLs back:

- Production: `https://olcc-product-sites.vercel.app`
- Preview: `https://olcc-product-sites-<hash>-olcc-technology.vercel.app`

Verify the deploy:

| URL                                                | Expected                          |
| -------------------------------------------------- | --------------------------------- |
| `…vercel.app/`                                     | Product index (lists CarwashFlow) |
| `…vercel.app/carwashflow`                          | CarwashFlow landing               |
| `…vercel.app/carwashflow/demo`                     | CarwashFlow interactive demo      |

---

## Step 5 — auto-deploy on push

Connect the GitHub repo to Vercel so every `git push main` redeploys automatically:

1. Go to https://vercel.com/olcc-technology/olcc-product-sites/settings/git
2. Click **Connect Git Repository** → choose `OLCC-Technology/olcc-product-sites`
3. Production branch: `main` (default)
4. Save

That's it — push a commit and watch it deploy.

---

## Step 6 — custom domain `carwashflow.olcc.com.my`

> Skip this step until you own `olcc.com.my`. Until then, just share `https://olcc-product-sites.vercel.app/carwashflow` (or the cleaner `https://carwashflow-olcc.vercel.app` if you create that subdomain alias in Vercel).

### In Vercel dashboard

1. Go to https://vercel.com/olcc-technology/olcc-product-sites/settings/domains
2. **Add Domain** → enter `carwashflow.olcc.com.my` → Add
3. Vercel shows you the DNS record to create. It's usually one of:
   - **CNAME** `carwashflow` → `cname.vercel-dns.com`
   - (Or **A** `carwashflow` → `76.76.21.21` if your DNS doesn't support CNAME on subdomains)

### In your domain registrar (where `olcc.com.my` is managed)

4. Open DNS settings for `olcc.com.my`.
5. Add the record Vercel told you to add. Example for Cloudflare:
   - Type: `CNAME`
   - Name: `carwashflow`
   - Target: `cname.vercel-dns.com`
   - Proxy: **DNS only** (grey cloud) — Vercel handles SSL
6. TTL: leave at Auto / 5 min.
7. Save.

Propagation usually takes 1–5 minutes. Vercel auto-issues an SSL cert once DNS resolves.

Verify: `dig carwashflow.olcc.com.my` should return the Vercel CNAME, and the site should load with a valid certificate.

### Add the apex too (optional, recommended)

If you want `olcc.com.my` itself to serve the product index, repeat the same steps with `olcc.com.my` and `www.olcc.com.my`. Vercel handles the redirect.

---

## Future: add a new product subdomain

When you ship BeautyFlow:

1. Drop HTML into `public/beautyflow/` (see [README.md](./README.md#adding-a-new-flow-product) for code changes).
2. Push.
3. Vercel dashboard → Domains → add `beautyflow.olcc.com.my` → add the CNAME at your registrar.

Same project, same deploy, just a new subdomain. That's the whole point of the monorepo.

---

## Troubleshooting

**Vercel deploy fails with `Module not found`**
Run `pnpm install` locally first to make sure `pnpm-lock.yaml` is committed.

**Subdomain shows the product index instead of the landing**
Middleware isn't matching. Check that the subdomain's first label exactly matches a slug in `PRODUCT_SLUGS` (in `middleware.ts`).

**Demo iframe is blank on the landing page**
The landing page currently hard-codes `https://demo.olcc.com.my/washflow` — that URL doesn't exist. Update the HTML to point at `https://carwashflow.olcc.com.my/demo` (see [CONTENT.md](./CONTENT.md#-known-typo-demo-subdomain-path)).

**`pnpm dev` works but `vercel dev` doesn't**
`vercel dev` runs the same Next server but emulates the production routing — middleware will read the Host header from your browser, not from Vercel. To test subdomain rewrites locally, use `/etc/hosts` (see README).
