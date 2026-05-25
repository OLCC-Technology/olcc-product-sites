import { NextResponse, type NextRequest } from "next/server";

/**
 * Subdomain → product slug routing.
 *
 * carwashflow.olcc.com.my/        -> /carwashflow
 * carwashflow.olcc.com.my/demo    -> /carwashflow/demo
 * beautyflow.olcc.com.my/         -> /beautyflow      (when added)
 *
 * Also handles Vercel default domains for staging:
 *   carwashflow.vercel.app -> /carwashflow
 *
 * The bare apex (olcc.com.my or olcc-product-sites.vercel.app) falls through
 * to /app/page.tsx which lists all products.
 *
 * To add a product: add its slug to PRODUCT_SLUGS below.
 */
const PRODUCT_SLUGS = ["carwashflow", "eduflow", "tripflow", "renoflow"] as const;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();

  // Skip Next internals and static assets — let them resolve normally.
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".") // files in /public (favicons, og images, etc.)
  ) {
    return NextResponse.next();
  }

  // Extract product slug from the leftmost subdomain label.
  // e.g. "carwashflow.olcc.com.my" -> "carwashflow"
  //      "carwashflow-git-main-team.vercel.app" -> first label
  const firstLabel = hostname.split(".")[0];

  // Match a known product slug. For Vercel preview URLs like
  // "olcc-product-sites-git-main-...", firstLabel won't match and we fall through.
  const matchedProduct = PRODUCT_SLUGS.find(
    (slug) => firstLabel === slug || firstLabel.startsWith(`${slug}-`),
  );

  if (matchedProduct) {
    // Rewrite to /<product><original-path>
    // Path "/" becomes "/carwashflow", "/demo" becomes "/carwashflow/demo".
    const newPath =
      url.pathname === "/" ? `/${matchedProduct}` : `/${matchedProduct}${url.pathname}`;
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = newPath;
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request that isn't a static file or Next internal.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
