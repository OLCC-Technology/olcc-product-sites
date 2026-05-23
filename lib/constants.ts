/**
 * Shared brand constants used by the OLCC product index page
 * (app/page.tsx) and any future React components.
 *
 * NOTE: The product landing/demo pages are still standalone HTML files
 * under public/<product>/. They embed their own copies of WhatsApp links
 * and pricing — see CONTENT.md for the editable locations there.
 */

export const OLCC = {
  legalName: "OLCC Technology Sdn. Bhd.",
  city: "Johor Bahru, Malaysia",
  whatsappNumber: "60165789873",
  whatsappDisplay: "+60 16-578 9873",
  email: "ongcheongwei@yesteaching.com",
} as const;

export const whatsappLink = (presetMessage: string) =>
  `https://wa.me/${OLCC.whatsappNumber}?text=${encodeURIComponent(presetMessage)}`;

export const PRODUCTS = {
  carwashflow: {
    slug: "carwashflow",
    name: "CarwashFlow",
    tagline: "洗车中心管理系统",
    subdomain: "carwashflow.olcc.com.my",
  },
  eduflow: {
    slug: "eduflow",
    name: "EduFlow",
    tagline: "教育中心 / 艺术中心管理系统",
    subdomain: "eduflow.olcc.com.my",
  },
  tripflow: {
    slug: "tripflow",
    name: "TripFlow",
    tagline: "包车 / 车队 / 旅游运输管理系统",
    subdomain: "tripflow.olcc.com.my",
  },
} as const;
