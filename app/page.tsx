/**
 * OLCC Technology — product index.
 *
 * Shown when someone visits the bare apex (olcc.com.my or
 * olcc-product-sites.vercel.app) without a product subdomain.
 *
 * Real subdomain traffic (carwashflow.olcc.com.my) is rewritten by
 * middleware.ts before reaching this page.
 */
export default function ProductIndex() {
  const products = [
    {
      slug: "carwashflow",
      name: "CarwashFlow",
      tagline: "洗车中心管理系统",
      url: "/carwashflow",
      live: true,
    },
    // Add future products here as they ship.
    // { slug: "beautyflow", name: "BeautyFlow", tagline: "美容中心管理", url: "/beautyflow", live: false },
  ];

  return (
    <main
      style={{
        fontFamily:
          "'Fraunces', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#faf7f2",
        color: "#2d3a2e",
        minHeight: "100vh",
        padding: "80px 24px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>
        OLCC Technology
      </h1>
      <p style={{ fontSize: 18, color: "#4a5a4d", marginBottom: 48 }}>
        Vertical SaaS for Malaysian SMEs · Johor Bahru
      </p>

      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Products</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li
            key={p.slug}
            style={{
              padding: "20px 24px",
              border: "1px solid #d4e3d6",
              borderRadius: 12,
              marginBottom: 12,
              background: "#fff",
            }}
          >
            <a
              href={p.url}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textDecoration: "none",
                color: "#2d3a2e",
              }}
            >
              <div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: "#4a5a4d", fontSize: 14 }}>{p.tagline}</div>
              </div>
              <div style={{ color: "#5a7a5f", fontSize: 14 }}>
                {p.live ? "Live →" : "Coming soon"}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 64, fontSize: 13, color: "#4a5a4d" }}>
        OLCC Technology Sdn. Bhd. · WhatsApp{" "}
        <a href="https://wa.me/60165789873" style={{ color: "#5a7a5f" }}>
          +60 16-578 9873
        </a>
      </footer>
    </main>
  );
}
