import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OLCC Technology — *Flow product suite",
  description:
    "OLCC Technology Sdn. Bhd. builds vertical SaaS for Malaysian SMEs. CarwashFlow, BeautyFlow, FoodFlow and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
