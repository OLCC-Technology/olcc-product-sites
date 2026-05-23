import type { NextConfig } from "next";
import path from "node:path";

/**
 * Rewrites map clean public URLs to static HTML files in `public/`.
 *
 * Strategy:
 * - Each *Flow product lives at /<product>/index.html and /<product>/demo/index.html
 *   inside public/. These are pure static HTML — no React/JSX.
 * - Rewrites expose them at clean paths:
 *     /carwashflow         -> public/carwashflow/index.html
 *     /carwashflow/demo    -> public/carwashflow/demo/index.html
 * - Subdomain routing (e.g. carwashflow.olcc.com.my -> /carwashflow) is
 *   handled by middleware.ts, which prepends the product slug to the path
 *   before these rewrites run.
 *
 * To add a new product (BeautyFlow, FoodFlow, etc.):
 *   1. Drop HTML into public/<product>/index.html and public/<product>/demo/index.html
 *   2. Add an entry below
 *   3. Add the slug to PRODUCT_SLUGS in middleware.ts
 */
const config: NextConfig = {
  // Pin tracing root to this project so a stray package-lock.json in the
  // user's home directory doesn't confuse Next's workspace detection.
  outputFileTracingRoot: path.join(__dirname),

  async rewrites() {
    return [
      // CarwashFlow
      { source: "/carwashflow", destination: "/carwashflow/index.html" },
      { source: "/carwashflow/demo", destination: "/carwashflow/demo/index.html" },
      // EduFlow
      { source: "/eduflow", destination: "/eduflow/index.html" },
      { source: "/eduflow/demo", destination: "/eduflow/demo/index.html" },
      // TripFlow
      { source: "/tripflow", destination: "/tripflow/index.html" },
      { source: "/tripflow/demo", destination: "/tripflow/demo/index.html" },
    ];
  },

  // Allow demo to be embedded in an iframe by the landing page (same-origin)
  // and by future product landings on sibling subdomains.
  async headers() {
    return [
      {
        source: "/carwashflow/demo/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.olcc.com.my https://*.vercel.app",
          },
        ],
      },
      {
        source: "/eduflow/demo/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.olcc.com.my https://*.vercel.app",
          },
        ],
      },
      {
        source: "/tripflow/demo/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.olcc.com.my https://*.vercel.app",
          },
        ],
      },
    ];
  },
};

export default config;
