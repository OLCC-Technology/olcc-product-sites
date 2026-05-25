# Content edit guide

Everything a non-developer is likely to change — prices, WhatsApp number, FAQ wording — lives inside the static HTML files. This doc points you to the exact line in each file.

> All paths are relative to the repo root.
> Line numbers reflect the original generated HTML; if you've edited the file, search for the snippet instead.

---

## Language switcher

A floating dropdown appears in the top-right corner of every page if more than one language is available for that page. Controlled by the `<meta name="olcc-langs">` tag in each HTML file's `<head>`.

- **Live for:** CarwashFlow landing + demo (zh, en, ms)
- **Pending:** EduFlow, TripFlow, RenoFlow (zh only — switcher hidden until translations land)

URL convention:
- `/<product>` → zh (default, no language segment)
- `/<product>/en` → English
- `/<product>/ms` → Bahasa Malaysia
- `/<product>/demo/en` → English demo (and similar for `/ms`)

### How to add EN + MS for another product

1. **Translate** `public/<product>/index.html` into English. Save as `public/<product>/en/index.html`.
2. **Translate** `public/<product>/index.html` into Bahasa Malaysia. Save as `public/<product>/ms/index.html`.
3. Repeat for `public/<product>/demo/index.html` if there's a demo.
4. Edit each translated file's `<meta name="olcc-langs">` (already injected at the top of `<head>`) and change `content="zh"` to `content="zh,en,ms"`.
5. **Also update the original Chinese HTML** — change its meta tag to `content="zh,en,ms"` too, so the switcher shows up on the zh page.
6. Add rewrite entries to `next.config.ts`:
   ```ts
   { source: "/<product>/en",       destination: "/<product>/en/index.html" },
   { source: "/<product>/ms",       destination: "/<product>/ms/index.html" },
   { source: "/<product>/demo/en",  destination: "/<product>/demo/en/index.html" },
   { source: "/<product>/demo/ms",  destination: "/<product>/demo/ms/index.html" },
   ```
7. Commit and push — auto-deploys in ~30s.

### Reference: CarwashFlow translation scripts

When CarwashFlow was translated, the Chinese → English/Malay mapping was captured in throwaway scripts at `/tmp/translate-carwashflow-{en,ms}.mjs` and `/tmp/translate-carwashflow-demo-{en,ms}.mjs`. These scripts contain the canonical OLCC brand voice in each language (e.g. "tauke" not "boss" for Malay, "ShinePro" as the mock business name, etc.) — useful as reference when translating sibling products.

---

## CarwashFlow — landing page

**File:** `public/carwashflow/index.html`

| What to change         | Where (line ≈) | Snippet to search for                           |
| ---------------------- | -------------- | ----------------------------------------------- |
| Hero title             | top of `<body>` | `让洗车中心老板从 Excel 和 WhatsApp 解脱出来` |
| WhatsApp CTA (primary) | **1560**       | `https://wa.me/60165789873`                    |
| Floating WhatsApp btn  | **1603**       | `class="wa-float"`                              |
| WhatsApp text          | **1590**       | `WhatsApp: +60 16-578 9873`                    |
| Email                  | **1591**       | `ongcheongwei@yesteaching.com`                  |
| "打开 Demo" 按钮链接    | **1346, 1564** | `olcc-product-sites.vercel.app/carwashflow/demo` |
| Pricing                | search `RM`    | look for `RM 99` / `RM 299` etc.                |
| FAQ                    | search `FAQ`   | each `<details><summary>` is one question       |
| Page `<title>` / SEO   | top of `<head>` | `<title>`, `<meta name="description">`         |

### 🔄 When you register `olcc.com.my` and bind `carwashflow.olcc.com.my`

The "打开 Demo" button currently points at the Vercel default URL:
`https://olcc-product-sites.vercel.app/carwashflow/demo`

Once the custom subdomain is live, do this find-and-replace in `public/carwashflow/index.html`:

```
https://olcc-product-sites.vercel.app/carwashflow/demo
  →
https://carwashflow.olcc.com.my/demo
```

(Affects lines 1346 and 1564 — both `<a>` tags with `class="btn-primary"` and `class="btn-ghost"`.)

---

## CarwashFlow — interactive demo

**File:** `public/carwashflow/demo/index.html`

The demo is a 3-view simulation (老板 / 员工 / 顾客). It has no pricing or contact info, so the only fields you'd typically edit are:

| What to change          | Snippet to search for                                  |
| ----------------------- | ------------------------------------------------------ |
| Demo center name        | `示范洗车中心` (or your placeholder business name)     |
| Mock member data        | search for `Mr. Tan` / `RM 50` inside `<script>` block |
| View labels (老板/员工/顾客) | `data-view="boss"` and surrounding tab labels      |

---

## Brand-wide constants (React side)

`lib/constants.ts` holds the canonical WhatsApp number, email, and product list. **These are only used by the apex product index at `app/page.tsx`** — they are NOT pulled into the HTML files. If you change `OLCC.whatsappNumber` here, you also need to update the HTML files above.

Why this duplication? Because the HTML files are generated once by the `olcc-sales-toolkit` Claude skill and copied in as-is. Treating them as plain artifacts (not React components) keeps editing simple — anyone who can use VS Code's find-and-replace can update copy, no React knowledge required.

If you want to remove the duplication, the next step would be: convert the HTML files into Next.js pages that import from `lib/constants.ts`. That's a bigger refactor; defer until at least 2–3 products are live.

---

## Adding a new FAQ item

In `public/carwashflow/index.html`, find the FAQ section and add a new `<details>` block matching the existing pattern:

```html
<details>
  <summary>你新加的问题？</summary>
  <p>回答内容。</p>
</details>
```

---

## After editing

```bash
git add public/
git commit -m "carwashflow: <short description>"
git push
```

Vercel auto-deploys within ~30 seconds. Verify at `https://carwashflow.olcc.com.my` (or the Vercel default URL during pre-DNS staging).
