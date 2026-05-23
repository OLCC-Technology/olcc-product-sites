# Content edit guide

Everything a non-developer is likely to change — prices, WhatsApp number, FAQ wording — lives inside the static HTML files. This doc points you to the exact line in each file.

> All paths are relative to the repo root.
> Line numbers reflect the original generated HTML; if you've edited the file, search for the snippet instead.

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
| Demo iframe link       | **1346, 1564** | `demo.olcc.com.my/washflow`  ⚠️ see typo below |
| Pricing                | search `RM`    | look for `RM 99` / `RM 299` etc.                |
| FAQ                    | search `FAQ`   | each `<details><summary>` is one question       |
| Page `<title>` / SEO   | top of `<head>` | `<title>`, `<meta name="description">`         |

### ⚠️ Known typo: demo subdomain path

The generated landing currently links to `https://demo.olcc.com.my/washflow` — note the missing `car`. The actual deployed demo will live at `https://carwashflow.olcc.com.my/demo`. Fix both line 1346 and 1564 with a find-and-replace:

```
demo.olcc.com.my/washflow   →   carwashflow.olcc.com.my/demo
```

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
