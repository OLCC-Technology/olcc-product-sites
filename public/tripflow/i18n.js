/**
 * TripFlow i18n — three-language (zh / en / ms) client-side switcher.
 *
 * How it works
 * ------------
 *  • Source HTML stays in 中文 (zh) — that's the fallback.
 *  • This script walks all visible text nodes on first run and stores
 *    each node's original text in a WeakMap.
 *  • Switching to en / ms looks up the trimmed Chinese string in `DICT`
 *    and swaps the node's textContent.
 *  • Switching back to zh restores from the WeakMap.
 *  • Elements with `data-i18n-html="<key>"` get whole-innerHTML replacement
 *    from `HTML_DICT` (used for h1/h2 that have <em>/<br> inside).
 *  • The active button gets `.active`; choice is persisted in
 *    localStorage('tripflow-lang') and <html lang="..."> is updated.
 *
 * Demo data (driver names, routes, customer names) intentionally has no
 * dictionary entry, so it stays in Chinese on all languages.
 */

(function () {
  "use strict";

  // ============== TEXT DICTIONARY (single-string keys) ==============
  const DICT = {
    en: {
      // ===== Nav (landing) =====
      "功能": "Features",
      "线上 Demo": "Live Demo",
      "方案": "Pricing",
      "案例": "Cases",
      "常见问题": "FAQ",
      "预约展示 →": "Book a Demo →",
      "by OLCC": "by OLCC",

      // ===== Hero =====
      "看 5 分钟 Demo": "Watch 5-min Demo",
      "查看方案": "See Pricing",
      "多车型": "All Vehicle Types",
      "MPV · 面包车 · 大巴": "MPV · Van · Bus",
      "8 模块": "8 Modules",
      "从调度到客户 Portal": "From dispatch to customer portal",
      "中文界面 + 本地支援": "Bilingual UI + Local Support",
      "TripFlow 是一个为包车公司、车队、旅游运输量身打造的管理系统。行程调度、报价、司机工资、车辆成本 — 一个系统全部搞定。":
        "TripFlow is a management system purpose-built for charter companies, fleets, and tourism transport. Trip dispatch, quoting, driver payroll, vehicle costs — all handled in one system.",

      // ===== Hero visual / dashboard mock =====
      "司机工资已自动算好": "Driver payroll auto-calculated",
      "早安，陈老板 👋": "Good morning, Boss Chen 👋",
      "这是今天的绿洲包车概况": "Here's today's overview of Oasis Charter",
      "本月行程": "Trips this month",
      "↑ +24 趟": "↑ +24 trips",
      "月营业额": "Monthly revenue",
      "88% 已收": "88% collected",
      "未收账款": "Outstanding",
      "⚠ 3 客户": "⚠ 3 customers",
      "今日行程": "Today's trips",
      "7 位司机": "7 drivers",
      "今日待办": "Today's tasks",
      "即将出发": "Departing soon",
      "明天 3 辆同时出车，1 位司机调休": "3 vehicles dispatched tomorrow, 1 driver on leave",
      "待协调": "Needs coordination",
      "本月司机工资已自动算好": "This month's payroll auto-calculated",
      "就绪": "Ready",
      "司机看自己工资明细": "Drivers view their own payslip",
      "李师傅刚查看": "Mr. Lee just viewed",

      // ===== Pain points =====
      "您是不是也遇到这些？": "Sound familiar?",
      "如果您正在经营一间包车公司，这些场景应该再熟悉不过。TripFlow 就是来终结它们的。":
        "If you run a charter company, these scenes should be all too familiar. TripFlow is here to end them.",
      "您现在的痛": "Your current pain",
      "调度像在玩拼图": "Dispatching feels like a puzzle",
      "调度靠 WhatsApp + 白板，常冲突或漏接（同一辆车双重 booking）":
        "Dispatch by WhatsApp + whiteboard — clashes and missed jobs are routine (same car double-booked)",
      "司机换班/调休难安排，多辆同时出车时难协调":
        "Driver shift swaps / leave are hard to manage; coordinating multiple vehicles is painful",
      "报价靠口头 + 记忆，同样路线不同司机报不同价":
        "Quotes done by memory — same route, different driver, different price",
      "司机工资难算 — 折返、过夜、加班费常生争议":
        "Driver pay is hard to calculate — return trips, overnights, OT cause constant arguments",
      "月底对账时司机来问 \"我这趟有没有算到？\"，自己也忘了":
        "Month-end reconciliation: driver asks \"was this trip counted?\" and you can't remember",
      "客户问 \"你们之前包过 XX 路线对吗？多少钱？\"，要翻一堆 WhatsApp":
        "Customer asks \"didn't you do route X before? what was the price?\" — you scroll through endless WhatsApp",
      "TripFlow 帮您": "TripFlow's answer",
      "把车队变成精准的机器": "Turn your fleet into a precise machine",
      "调度看板一目了然，哪辆车哪个时段已 booked 自动锁定，不会重复":
        "Dispatch board at a glance — every booked vehicle/slot is auto-locked, no duplicates",
      "司机排班 + 调休一键安排，多车出动时系统帮您协调":
        "Driver scheduling + leave in one click; system auto-coordinates multi-vehicle dispatches",
      "标准化路线报价库，同样行程报价永远一致":
        "Standardised route quote library — identical trips always get identical pricing",
      "司机工资按行程 + 时数 + 过夜费 + 加班费自动算，分钟级出报表":
        "Driver pay auto-calculated by trips + hours + overnight + OT — reports in minutes",
      "每位司机 portal 自己看每趟工资明细，不再来问":
        "Every driver has a portal showing their own per-trip payslip — no more questions",
      "路线报价历史 + 客户行程历史 全部档案化，3 秒查到":
        "Route quote history + customer trip history all archived — find anything in 3 seconds",

      // ===== Demo CTA section =====
      "Live Demo · 立即试用": "Live Demo · Try Now",
      "点击下方查看完整 demo。3 个行业自由切换，8 个模块全部能点。这就是您未来每天会用的系统。":
        "Click below to view the full demo. Switch between industries, click any of the 8 modules — this is the system you'll be using every day.",
      "🚐 包车公司 demo": "🚐 Charter Company Demo",
      "完整互动 Demo": "Full Interactive Demo",
      "点击下方按钮在新窗口打开 demo（推荐手机/桌面浏览）。可点击 8 个模块、查看客户 portal 手机版界面。":
        "Click below to open the demo in a new window (mobile or desktop). Try all 8 modules and the customer portal mobile view.",
      "打开 Demo": "Open Demo",
      "想要一对一讲解？预约 30 分钟": "Want a 1-on-1 walkthrough? Book a 30-min session",

      // ===== Features =====
      "八大核心模块": "8 Core Modules",
      "不是通用 SaaS 硬塞进来。每个模块都是为包车公司的实际工作流程设计。":
        "Not a generic SaaS shoehorned in. Every module is designed around how charter companies actually work.",
      "调度仪表盘": "Dispatch Dashboard",
      "早上一开就看见今天所有行程、可用车辆、待办事项。30 秒掌握车队状况。":
        "Open it in the morning and see every trip, available vehicle and task. 30 seconds to grasp the whole fleet.",
      "行程调度": "Trip Dispatch",
      "拖拉式分配车辆 + 司机，自动检测时段冲突。一辆车不会被重复 booking。":
        "Drag-and-drop vehicle + driver assignment with auto conflict detection. No more double-booking.",
      "司机排班 + 调休": "Driver Scheduling + Leave",
      "司机班表 + 休假一目了然。多辆同时出车时，系统帮您找最合适的司机组合。":
        "Driver rosters + leave at a glance. When multiple vehicles go out, the system finds the best driver combination.",
      "报价管理": "Quote Management",
      "标准路线 + 车型报价库，新报价 30 秒生成。月结客户自动累积发票。":
        "Standard route + vehicle quote library; new quote in 30 seconds. Monthly customers get auto-aggregated invoices.",
      "客户 + 行程历史": "Customers + Trip History",
      "每位客户的过往行程、报价、付款状态档案化。\"之前包过吗？\" 3 秒查到。":
        "Every customer's past trips, quotes and payment status archived. \"Have we done this before?\" — 3 seconds.",
      "司机管理": "Driver Management",
      "每位司机的执照、驾照到期、行程记录、工资历史全部档案化。":
        "Every driver's licence, expiry dates, trip history and payroll record — all archived.",
      "司机工资计算": "Driver Payroll",
      "按行程 + 时数 + 过夜费 + 加班费自动算。月底分钟级出报表，不再吵架。":
        "Auto-calculated by trips + hours + overnight + OT. Month-end reports in minutes — no more arguments.",
      "司机 Portal": "Driver Portal",
      "每位司机扫码登入看自己的班表、行程详情、本月工资明细 — 不再来问。":
        "Each driver scans a QR to see their roster, trip details and monthly payslip — no more questions.",

      // ===== Pricing =====
      "透明定价": "Transparent Pricing",
      "所有方案都包含 hosting、域名、SSL 证书、每日备份和 8 大核心模块。Setup 费用一次性，月费起算。":
        "All plans include hosting, domain, SSL, daily backups and all 8 modules. Setup is a one-off; monthly billing starts after.",
      "Starter": "Starter",
      "适合 1-3 辆车 · 老板 + 1-2 司机": "For 1-3 vehicles · owner + 1-2 drivers",
      "/月": "/month",
      "Setup 一次性 RM 1,800": "One-off setup RM 1,800",
      "8 大核心模块": "All 8 modules",
      "Hosting + 域名 + SSL": "Hosting + domain + SSL",
      "每日自动备份": "Daily auto-backup",
      "WhatsApp 客服支援": "WhatsApp support",
      "月结客户自动发票": "Monthly customer auto-invoicing",
      "多车队管理": "Multi-fleet management",
      "客制开发": "Custom development",
      "了解更多": "Learn more",
      "⭐ 最受欢迎": "⭐ Most Popular",
      "Professional": "Professional",
      "适合 5-15 辆车 · 多车型 + 调度员": "For 5-15 vehicles · multi-type + dispatcher",
      "Setup 一次性 RM 3,500 · 首月免费": "One-off setup RM 3,500 · first month free",
      "司机 Portal · 客户行程历史": "Driver Portal · Customer trip history",
      "月结客户自动累积发票": "Monthly customer auto-aggregated invoicing",
      "司机排班 + 调休协调": "Driver scheduling + leave coordination",
      "最多 2 个车队/分公司": "Up to 2 fleets / branches",
      "自定义报表 · 优先客服": "Custom reports · priority support",
      "开始 30 天试用": "Start 30-day Trial",
      "Enterprise": "Enterprise",
      "适合 15+ 辆车 · 多分公司 · 想客制": "For 15+ vehicles · multi-branch · wants customisation",
      "/月 起": "/month from",
      "Setup 一次性 RM 6,000 起": "One-off setup from RM 6,000",
      "Professional 所有功能": "Everything in Professional",
      "无限车队/分公司": "Unlimited fleets / branches",
      "白标 (您的品牌名)": "White-label (your brand)",
      "专属经理": "Dedicated account manager",
      "会计系统 API 整合": "Accounting API integration",
      "优先功能开发": "Priority feature development",
      "SLA 保证": "SLA guarantee",
      "联络我们": "Contact us",

      // ===== Cases =====
      "真实案例": "Real Cases",
      "不是 demo 假数据，是真实在运作的车队。我们的团队也在用，所以系统的每一个细节都是经过实战的。":
        "Not fake demo data — real fleets in production. Our own team uses it too, so every detail is battle-tested.",
      "以前调度要靠白板 + WhatsApp，经常一辆车被重复 booked。现在系统帮我看冲突，再也没出过乱。多辆车同时出动也容易协调，司机调休也清楚。":
        "We used to dispatch with a whiteboard + WhatsApp and the same vehicle kept getting double-booked. Now the system catches every conflict — no more mess. Multi-vehicle dispatch is easy, and driver leave is crystal clear.",
      "司机以前总是为加班费、过夜费跟我争。现在每个人 portal 自己看每趟实际工资，怎么算的一清二楚。月底再也不用熬夜核对。":
        "Drivers used to argue with me over OT and overnight fees. Now every driver sees their own per-trip pay in the portal — fully transparent. No more late nights reconciling.",
      "最有用是报价库。以前客户问 \"上次包 KL 多少钱？\" 要翻一堆 WhatsApp。现在 3 秒查到，报价永远一致，不会同一个客户不同司机报不同价。":
        "Best feature is the quote library. Customers asking \"how much was the KL trip last time?\" used to mean scrolling through WhatsApp. Now I find it in 3 seconds, and quotes are always consistent.",

      // ===== FAQ =====
      "您可能": "What you might",
      "想知道的": "want to know",
      "司机不太懂电脑/不会用 app 怎么办？": "What if drivers aren't comfortable with computers/apps?",
      "TripFlow 是为本地包车公司打造的，界面全中文、设计直觉。司机的常用功能只有 3 个 — 看今天的行程、签到/签退、看自己工资。培训 1 小时就能上手。如果之后有问题，我们 WhatsApp 教。":
        "TripFlow is built for local charter companies — bilingual UI, intuitive design. Drivers only use 3 features: see today's trips, clock in/out, view their payslip. 1-hour training is enough. We're on WhatsApp for any follow-up questions.",
      "现有的客户名单、行程记录、Excel 怎么办？": "What about my existing customer list, trip records and Excel sheets?",
      "我们的服务包含数据搬迁。您给我们现有的 Excel 或纸本资料 — 客户名单、车辆资料、司机档案、过往行程 — 我们帮您整理 + 输入系统。不用您和员工花时间。":
        "Data migration is included. Hand us your Excel sheets or paper records — customer lists, vehicle info, driver files, past trips — and we'll clean and import everything. Zero work for you or your staff.",
      "可以试用一段时间再决定吗？": "Can I try it for a while before deciding?",
      "Professional 方案提供首月免费试用 — Setup 完成后您有 30 天评估。不满意可全额退还 Setup 费用，您只损失搬数据的时间，没有现金损失。":
        "Professional comes with a free first month — 30 days to evaluate after setup. Not satisfied? Full setup refund. You only lose the data-migration time, no cash loss.",
      "数据安全吗？司机和客户隐私会不会被泄露？": "Is the data secure? Could driver or customer data leak?",
      "数据放在新加坡区的 Supabase 云端（符合 PDPA），每日自动备份。司机只能看到自己的行程，客户只能看到自己的预订。即使我们公司出事，您也能 100% 导出所有数据。":
        "Data sits in a Singapore-region Supabase cloud (PDPA-compliant), with daily auto-backups. Drivers see only their own trips; customers see only their own bookings. Even if our company disappears, you can export 100% of your data.",
      "如果用一段时间想停掉怎么办？": "What if I want to stop later?",
      "月费随时可停，停后我们继续保留您数据 30 天，让您可以完整导出。不会绑约（除非选年付方案）。":
        "Cancel anytime. We keep your data for 30 days after cancellation so you can export everything. No lock-in (unless you take the annual plan).",
      "多辆车同时出动时怎样协调？": "How does it handle multiple vehicles dispatched at the same time?",
      "这是 TripFlow 的核心强项之一。系统会显示每辆车 + 每位司机的状态（空闲/已 booked/调休），您可以一眼看出哪些组合可行。系统也会自动避免双重 booking — 您拖一辆已经被 book 的车给新行程，系统会立刻提醒。司机调休也输入系统后，调度时直接被排除。":
        "This is one of TripFlow's strongest points. The system shows each vehicle + driver status (free / booked / on leave) so workable combinations are instantly visible. Auto-conflict detection — drag a booked vehicle into a new trip and you'll be warned immediately. Leave is excluded from dispatch automatically.",
      "有 2 个车队或多间分公司，要买 2 份吗？": "If I have 2 fleets or branches, do I need 2 subscriptions?",
      "不用。Professional 方案支援最多 2 个车队/分公司。Enterprise 方案支援无限。每个车队有自己的车辆、司机、报表，但您一个 login 可以看全部。":
        "No. Professional supports up to 2 fleets/branches; Enterprise is unlimited. Each fleet has its own vehicles, drivers and reports, but one login sees everything.",
      "你们公司在哪里？出事可以找你们吗？": "Where are you based? Can I reach you if something happens?",
      "我们的团队就在新马本地（公司注册在马来西亚 Johor Bahru）。WhatsApp 即时回复、必要时上门。这是我们和国外 SaaS 最大的差别。":
        "Our team is in Singapore & Malaysia (company registered in Johor Bahru, Malaysia). WhatsApp replies are instant and we'll come on-site when needed. That's the biggest difference between us and overseas SaaS.",

      // ===== CTA =====
      "下一步": "Next Step",
      "免费咨询 · 不绑约 · 现场或线上 demo 任您选":
        "Free consultation · no lock-in · on-site or online demo, your choice",
      "WhatsApp 我们": "WhatsApp Us",
      "先看 demo": "See demo first",

      // ===== Footer =====
      "产品": "Product",
      "核心功能": "Core Features",
      "定价方案": "Pricing Plans",
      "客户案例": "Case Studies",
      "联络": "Contact",
      "为包车公司、车队、旅游运输量身打造的管理系统。让包车老板从 Excel 和白板调度解脱出来。":
        "A management system purpose-built for charter companies, fleets, and tourism transport. Free charter owners from Excel and whiteboard dispatch.",
      "© 2026 OLCC Technology Sdn. Bhd. All rights reserved.": "© 2026 OLCC Technology Sdn. Bhd. All rights reserved.",
      "TripFlow is a product of": "TripFlow is a product of",

      // ===== Demo page (top banner + sidebar + page chrome) =====
      "✨": "✨",
      "专为包车公司、车队、旅游运输打造的管理系统": "A management system built for charter companies, fleets and tourism transport",
      "预约 Demo →": "Book a Demo →",
      "行业演示：": "Industry demo:",
      "🚐 包车公司": "🚐 Charter Company",
      "Demo · 数据为演示用": "Demo · data is illustrative only",
      "车队管理后台": "Fleet management backend",
      "主要": "Main",
      "客户 & 司机": "Customers & Drivers",
      "财务": "Finance",
      "司机排班": "Driver Schedule",
      "客户管理": "Customer Management",
      "司机工资": "Driver Payroll",
      "+ 新增行程": "+ Add Trip",
      "本月营业额": "Monthly revenue",
      "↑ 比上月 +24 趟": "↑ +24 trips vs last month",
    },
    ms: {
      // ===== Nav (landing) =====
      "功能": "Ciri",
      "线上 Demo": "Demo Langsung",
      "方案": "Pelan",
      "案例": "Kes Pengguna",
      "常见问题": "Soalan Lazim",
      "预约展示 →": "Tempah Demo →",
      "by OLCC": "oleh OLCC",

      // ===== Hero =====
      "看 5 分钟 Demo": "Tonton Demo 5-min",
      "查看方案": "Lihat Pelan",
      "多车型": "Pelbagai Kenderaan",
      "MPV · 面包车 · 大巴": "MPV · Van · Bas",
      "8 模块": "8 Modul",
      "从调度到客户 Portal": "Daripada penghantaran ke portal pelanggan",
      "中文界面 + 本地支援": "UI Dwibahasa + Sokongan Tempatan",
      "TripFlow 是一个为包车公司、车队、旅游运输量身打造的管理系统。行程调度、报价、司机工资、车辆成本 — 一个系统全部搞定。":
        "TripFlow ialah sistem pengurusan yang dibina khas untuk syarikat sewa kereta, armada dan pengangkutan pelancongan. Penghantaran perjalanan, sebut harga, gaji pemandu, kos kenderaan — semua dalam satu sistem.",

      // ===== Hero visual / dashboard mock =====
      "司机工资已自动算好": "Gaji pemandu dikira automatik",
      "早安，陈老板 👋": "Selamat pagi, Bos Chen 👋",
      "这是今天的绿洲包车概况": "Ini ringkasan Oasis Charter hari ini",
      "本月行程": "Perjalanan bulan ini",
      "↑ +24 趟": "↑ +24 perjalanan",
      "月营业额": "Hasil bulanan",
      "88% 已收": "88% diterima",
      "未收账款": "Tertunggak",
      "⚠ 3 客户": "⚠ 3 pelanggan",
      "今日行程": "Perjalanan hari ini",
      "7 位司机": "7 pemandu",
      "今日待办": "Tugas hari ini",
      "即将出发": "Akan berlepas",
      "明天 3 辆同时出车，1 位司机调休": "3 kenderaan esok, 1 pemandu bercuti",
      "待协调": "Perlu diselaraskan",
      "本月司机工资已自动算好": "Gaji bulan ini dikira automatik",
      "就绪": "Sedia",
      "司机看自己工资明细": "Pemandu lihat butiran gaji sendiri",
      "李师傅刚查看": "En. Lee baru lihat",

      // ===== Pain points =====
      "您是不是也遇到这些？": "Pernah alami?",
      "如果您正在经营一间包车公司，这些场景应该再熟悉不过。TripFlow 就是来终结它们的。":
        "Jika anda mengendalikan syarikat sewa kereta, situasi ini pasti biasa. TripFlow di sini untuk mengakhirinya.",
      "您现在的痛": "Kesakitan anda sekarang",
      "调度像在玩拼图": "Penghantaran terasa macam main puzzle",
      "调度靠 WhatsApp + 白板，常冲突或漏接（同一辆车双重 booking）":
        "Penghantaran melalui WhatsApp + papan putih — sering bertindih atau terlepas (kenderaan sama tempahan dua kali)",
      "司机换班/调休难安排，多辆同时出车时难协调":
        "Pertukaran syif/cuti pemandu sukar diatur; menyelaras beberapa kenderaan serentak menyusahkan",
      "报价靠口头 + 记忆，同样路线不同司机报不同价":
        "Sebut harga ikut ingatan — laluan sama, pemandu berbeza, harga berbeza",
      "司机工资难算 — 折返、过夜、加班费常生争议":
        "Gaji pemandu sukar dikira — perjalanan balik, menginap, OT sering jadi pertikaian",
      "月底对账时司机来问 \"我这趟有没有算到？\"，自己也忘了":
        "Penyelarasan akhir bulan: pemandu tanya \"trip ini ada dikira?\" dan anda pun lupa",
      "客户问 \"你们之前包过 XX 路线对吗？多少钱？\"，要翻一堆 WhatsApp":
        "Pelanggan tanya \"dulu kami pernah sewa laluan XX, berapa?\" — anda terpaksa selongkar WhatsApp",
      "TripFlow 帮您": "TripFlow bantu anda",
      "把车队变成精准的机器": "Tukarkan armada anda jadi mesin yang tepat",
      "调度看板一目了然，哪辆车哪个时段已 booked 自动锁定，不会重复":
        "Papan penghantaran jelas sekali pandang — setiap kenderaan & slot yang ditempah dikunci automatik, tiada pertindihan",
      "司机排班 + 调休一键安排，多车出动时系统帮您协调":
        "Penjadualan + cuti pemandu satu klik; sistem selaraskan penghantaran berbilang kenderaan",
      "标准化路线报价库，同样行程报价永远一致":
        "Pustaka sebut harga laluan piawai — perjalanan sama sentiasa harga sama",
      "司机工资按行程 + 时数 + 过夜费 + 加班费自动算，分钟级出报表":
        "Gaji pemandu dikira automatik ikut trip + jam + menginap + OT — laporan dalam minit",
      "每位司机 portal 自己看每趟工资明细，不再来问":
        "Setiap pemandu ada portal untuk lihat butiran gaji setiap trip — tiada lagi pertanyaan",
      "路线报价历史 + 客户行程历史 全部档案化，3 秒查到":
        "Sejarah sebut harga laluan + sejarah perjalanan pelanggan diarkibkan — cari apa saja dalam 3 saat",

      // ===== Demo CTA section =====
      "Live Demo · 立即试用": "Demo Langsung · Cuba Sekarang",
      "点击下方查看完整 demo。3 个行业自由切换，8 个模块全部能点。这就是您未来每天会用的系统。":
        "Klik di bawah untuk lihat demo penuh. Tukar antara industri, klik mana-mana 8 modul — inilah sistem yang anda akan gunakan setiap hari.",
      "🚐 包车公司 demo": "🚐 Demo Syarikat Sewa Kereta",
      "完整互动 Demo": "Demo Interaktif Penuh",
      "点击下方按钮在新窗口打开 demo（推荐手机/桌面浏览）。可点击 8 个模块、查看客户 portal 手机版界面。":
        "Klik butang di bawah untuk buka demo dalam tetingkap baru (mudah alih atau desktop). Cuba 8 modul dan portal pelanggan versi mudah alih.",
      "打开 Demo": "Buka Demo",
      "想要一对一讲解？预约 30 分钟": "Mahukan demo bersemuka? Tempah sesi 30 minit",

      // ===== Features =====
      "八大核心模块": "8 Modul Teras",
      "不是通用 SaaS 硬塞进来。每个模块都是为包车公司的实际工作流程设计。":
        "Bukan SaaS umum yang dipaksa muat. Setiap modul direka berdasarkan cara sebenar syarikat sewa kereta beroperasi.",
      "调度仪表盘": "Papan Pemuka Penghantaran",
      "早上一开就看见今天所有行程、可用车辆、待办事项。30 秒掌握车队状况。":
        "Buka pada waktu pagi dan lihat semua perjalanan, kenderaan tersedia dan tugas. 30 saat fahami seluruh armada.",
      "行程调度": "Penghantaran Perjalanan",
      "拖拉式分配车辆 + 司机，自动检测时段冲突。一辆车不会被重复 booking。":
        "Tugaskan kenderaan + pemandu secara seret-dan-lepas dengan pengesanan konflik automatik. Tiada lagi tempahan dua kali.",
      "司机排班 + 调休": "Jadual + Cuti Pemandu",
      "司机班表 + 休假一目了然。多辆同时出车时，系统帮您找最合适的司机组合。":
        "Jadual pemandu + cuti jelas sekali pandang. Bila banyak kenderaan keluar, sistem cari kombinasi pemandu terbaik.",
      "报价管理": "Pengurusan Sebut Harga",
      "标准路线 + 车型报价库，新报价 30 秒生成。月结客户自动累积发票。":
        "Pustaka sebut harga laluan piawai + jenis kenderaan; sebut harga baru dalam 30 saat. Pelanggan bulanan dapat invois automatik terkumpul.",
      "客户 + 行程历史": "Pelanggan + Sejarah Perjalanan",
      "每位客户的过往行程、报价、付款状态档案化。\"之前包过吗？\" 3 秒查到。":
        "Setiap perjalanan, sebut harga dan status bayaran pelanggan diarkibkan. \"Pernah sewa dulu?\" — 3 saat.",
      "司机管理": "Pengurusan Pemandu",
      "每位司机的执照、驾照到期、行程记录、工资历史全部档案化。":
        "Lesen, tarikh tamat, sejarah perjalanan dan rekod gaji setiap pemandu — semua diarkibkan.",
      "司机工资计算": "Pengiraan Gaji Pemandu",
      "按行程 + 时数 + 过夜费 + 加班费自动算。月底分钟级出报表，不再吵架。":
        "Dikira automatik ikut trip + jam + menginap + OT. Laporan akhir bulan dalam minit — tiada lagi pergaduhan.",
      "司机 Portal": "Portal Pemandu",
      "每位司机扫码登入看自己的班表、行程详情、本月工资明细 — 不再来问。":
        "Setiap pemandu imbas QR untuk lihat jadual, butiran trip dan slip gaji bulan ini — tiada lagi pertanyaan.",

      // ===== Pricing =====
      "透明定价": "Harga Telus",
      "所有方案都包含 hosting、域名、SSL 证书、每日备份和 8 大核心模块。Setup 费用一次性，月费起算。":
        "Semua pelan termasuk hosting, domain, SSL, sandaran harian dan kesemua 8 modul. Yuran setup sekali sahaja; bayaran bulanan bermula selepas itu.",
      "Starter": "Starter",
      "适合 1-3 辆车 · 老板 + 1-2 司机": "Untuk 1-3 kenderaan · pemilik + 1-2 pemandu",
      "/月": "/bulan",
      "Setup 一次性 RM 1,800": "Setup sekali sahaja RM 1,800",
      "8 大核心模块": "Kesemua 8 modul",
      "Hosting + 域名 + SSL": "Hosting + domain + SSL",
      "每日自动备份": "Sandaran automatik harian",
      "WhatsApp 客服支援": "Sokongan WhatsApp",
      "月结客户自动发票": "Invois automatik pelanggan bulanan",
      "多车队管理": "Pengurusan berbilang armada",
      "客制开发": "Pembangunan tersuai",
      "了解更多": "Ketahui lebih lanjut",
      "⭐ 最受欢迎": "⭐ Paling Popular",
      "Professional": "Professional",
      "适合 5-15 辆车 · 多车型 + 调度员": "Untuk 5-15 kenderaan · pelbagai jenis + penghantar",
      "Setup 一次性 RM 3,500 · 首月免费": "Setup sekali sahaja RM 3,500 · bulan pertama percuma",
      "司机 Portal · 客户行程历史": "Portal Pemandu · Sejarah perjalanan pelanggan",
      "月结客户自动累积发票": "Invois automatik terkumpul pelanggan bulanan",
      "司机排班 + 调休协调": "Penjadualan + penyelarasan cuti pemandu",
      "最多 2 个车队/分公司": "Sehingga 2 armada / cawangan",
      "自定义报表 · 优先客服": "Laporan tersuai · sokongan keutamaan",
      "开始 30 天试用": "Mula Percubaan 30 Hari",
      "Enterprise": "Enterprise",
      "适合 15+ 辆车 · 多分公司 · 想客制": "Untuk 15+ kenderaan · pelbagai cawangan · mahu tersuai",
      "/月 起": "/bulan mulai",
      "Setup 一次性 RM 6,000 起": "Setup sekali sahaja mulai RM 6,000",
      "Professional 所有功能": "Semua dalam Professional",
      "无限车队/分公司": "Armada / cawangan tanpa had",
      "白标 (您的品牌名)": "Label putih (jenama anda)",
      "专属经理": "Pengurus akaun khusus",
      "会计系统 API 整合": "Integrasi API perakaunan",
      "优先功能开发": "Pembangunan ciri keutamaan",
      "SLA 保证": "Jaminan SLA",
      "联络我们": "Hubungi kami",

      // ===== Cases =====
      "真实案例": "Kes Sebenar",
      "不是 demo 假数据，是真实在运作的车队。我们的团队也在用，所以系统的每一个细节都是经过实战的。":
        "Bukan data demo palsu — armada sebenar yang sedang beroperasi. Pasukan kami sendiri turut menggunakannya, jadi setiap butiran sistem telah diuji di lapangan.",
      "以前调度要靠白板 + WhatsApp，经常一辆车被重复 booked。现在系统帮我看冲突，再也没出过乱。多辆车同时出动也容易协调，司机调休也清楚。":
        "Dulu kami hantar dengan papan putih + WhatsApp, kenderaan sama sering tempahan dua kali. Sekarang sistem tangkap setiap konflik — tiada lagi kekacauan. Penghantaran berbilang kenderaan mudah, cuti pemandu jelas.",
      "司机以前总是为加班费、过夜费跟我争。现在每个人 portal 自己看每趟实际工资，怎么算的一清二楚。月底再也不用熬夜核对。":
        "Pemandu dulu sering bergaduh dengan saya tentang OT dan yuran menginap. Sekarang semua orang lihat gaji setiap trip dalam portal — telus sepenuhnya. Tiada lagi malam panjang menyelaras.",
      "最有用是报价库。以前客户问 \"上次包 KL 多少钱？\" 要翻一堆 WhatsApp。现在 3 秒查到，报价永远一致，不会同一个客户不同司机报不同价。":
        "Ciri paling berguna ialah pustaka sebut harga. Pelanggan bertanya \"trip KL dulu berapa?\" dulu bermakna selongkar WhatsApp. Sekarang 3 saat jumpa, sebut harga sentiasa konsisten.",

      // ===== FAQ =====
      "您可能": "Apa yang anda mungkin",
      "想知道的": "ingin tahu",
      "司机不太懂电脑/不会用 app 怎么办？": "Bagaimana jika pemandu tak biasa dengan komputer / app?",
      "TripFlow 是为本地包车公司打造的，界面全中文、设计直觉。司机的常用功能只有 3 个 — 看今天的行程、签到/签退、看自己工资。培训 1 小时就能上手。如果之后有问题，我们 WhatsApp 教。":
        "TripFlow dibina untuk syarikat sewa kereta tempatan — UI dwibahasa, reka bentuk intuitif. Pemandu hanya guna 3 ciri: tengok perjalanan hari ini, masuk/keluar, dan slip gaji. Latihan 1 jam memadai. Kami sedia di WhatsApp untuk soalan susulan.",
      "现有的客户名单、行程记录、Excel 怎么办？": "Macam mana dengan senarai pelanggan, rekod perjalanan dan Excel yang sedia ada?",
      "我们的服务包含数据搬迁。您给我们现有的 Excel 或纸本资料 — 客户名单、车辆资料、司机档案、过往行程 — 我们帮您整理 + 输入系统。不用您和员工花时间。":
        "Migrasi data termasuk. Berikan kami lembaran Excel atau rekod kertas — senarai pelanggan, maklumat kenderaan, fail pemandu, perjalanan lepas — kami akan bersihkan dan import semuanya. Sifar kerja untuk anda atau staf.",
      "可以试用一段时间再决定吗？": "Boleh saya cuba dulu sebelum memutuskan?",
      "Professional 方案提供首月免费试用 — Setup 完成后您有 30 天评估。不满意可全额退还 Setup 费用，您只损失搬数据的时间，没有现金损失。":
        "Professional disertakan bulan pertama percuma — 30 hari untuk menilai selepas setup. Tidak berpuas hati? Bayaran setup dipulangkan sepenuhnya. Anda hanya kehilangan masa migrasi data, bukan wang.",
      "数据安全吗？司机和客户隐私会不会被泄露？": "Adakah data selamat? Boleh data pemandu atau pelanggan bocor?",
      "数据放在新加坡区的 Supabase 云端（符合 PDPA），每日自动备份。司机只能看到自己的行程，客户只能看到自己的预订。即使我们公司出事，您也能 100% 导出所有数据。":
        "Data berada di awan Supabase wilayah Singapura (mematuhi PDPA), dengan sandaran automatik harian. Pemandu hanya nampak perjalanan sendiri; pelanggan hanya nampak tempahan sendiri. Walaupun syarikat kami hilang, anda boleh eksport 100% data anda.",
      "如果用一段时间想停掉怎么办？": "Bagaimana jika saya mahu berhenti kemudian?",
      "月费随时可停，停后我们继续保留您数据 30 天，让您可以完整导出。不会绑约（除非选年付方案）。":
        "Batal bila-bila masa. Kami simpan data anda 30 hari selepas pembatalan supaya anda boleh eksport semuanya. Tiada ikat janji (kecuali anda pilih pelan tahunan).",
      "多辆车同时出动时怎样协调？": "Macam mana sistem urus beberapa kenderaan yang keluar serentak?",
      "这是 TripFlow 的核心强项之一。系统会显示每辆车 + 每位司机的状态（空闲/已 booked/调休），您可以一眼看出哪些组合可行。系统也会自动避免双重 booking — 您拖一辆已经被 book 的车给新行程，系统会立刻提醒。司机调休也输入系统后，调度时直接被排除。":
        "Ini antara kekuatan utama TripFlow. Sistem tunjuk status setiap kenderaan + pemandu (bebas / ditempah / bercuti) supaya kombinasi yang boleh kelihatan dengan jelas. Pengesanan konflik automatik — seret kenderaan yang sudah ditempah ke perjalanan baru, anda diberitahu segera. Cuti dikecualikan daripada penghantaran secara automatik.",
      "有 2 个车队或多间分公司，要买 2 份吗？": "Jika saya ada 2 armada atau cawangan, perlukah saya beli 2 langganan?",
      "不用。Professional 方案支援最多 2 个车队/分公司。Enterprise 方案支援无限。每个车队有自己的车辆、司机、报表，但您一个 login 可以看全部。":
        "Tidak perlu. Professional sokong sehingga 2 armada/cawangan; Enterprise tanpa had. Setiap armada ada kenderaan, pemandu dan laporan sendiri, tetapi satu login lihat semua.",
      "你们公司在哪里？出事可以找你们吗？": "Di mana lokasi anda? Boleh saya hubungi kalau ada masalah?",
      "我们的团队就在新马本地（公司注册在马来西亚 Johor Bahru）。WhatsApp 即时回复、必要时上门。这是我们和国外 SaaS 最大的差别。":
        "Pasukan kami di Singapura & Malaysia (syarikat berdaftar di Johor Bahru, Malaysia). Balasan WhatsApp segera dan kami datang ke premis bila perlu. Itu perbezaan terbesar antara kami dengan SaaS luar negara.",

      // ===== CTA =====
      "下一步": "Langkah Seterusnya",
      "免费咨询 · 不绑约 · 现场或线上 demo 任您选":
        "Konsultasi percuma · tiada ikat janji · demo bersemuka atau dalam talian, pilihan anda",
      "WhatsApp 我们": "WhatsApp Kami",
      "先看 demo": "Lihat demo dulu",

      // ===== Footer =====
      "产品": "Produk",
      "核心功能": "Ciri Teras",
      "定价方案": "Pelan Harga",
      "客户案例": "Kes Pengguna",
      "联络": "Hubungi",
      "为包车公司、车队、旅游运输量身打造的管理系统。让包车老板从 Excel 和白板调度解脱出来。":
        "Sistem pengurusan yang dibina khas untuk syarikat sewa kereta, armada dan pengangkutan pelancongan. Bebaskan pemilik daripada Excel dan penghantaran papan putih.",
      "© 2026 OLCC Technology Sdn. Bhd. All rights reserved.": "© 2026 OLCC Technology Sdn. Bhd. Semua hak terpelihara.",
      "TripFlow is a product of": "TripFlow ialah produk daripada",

      // ===== Demo page =====
      "✨": "✨",
      "专为包车公司、车队、旅游运输打造的管理系统": "Sistem pengurusan untuk syarikat sewa kereta, armada dan pengangkutan pelancongan",
      "预约 Demo →": "Tempah Demo →",
      "行业演示：": "Demo industri:",
      "🚐 包车公司": "🚐 Syarikat Sewa Kereta",
      "Demo · 数据为演示用": "Demo · data hanya untuk paparan",
      "车队管理后台": "Backend pengurusan armada",
      "主要": "Utama",
      "客户 & 司机": "Pelanggan & Pemandu",
      "财务": "Kewangan",
      "司机排班": "Jadual Pemandu",
      "客户管理": "Pengurusan Pelanggan",
      "司机工资": "Gaji Pemandu",
      "+ 新增行程": "+ Tambah Perjalanan",
      "本月营业额": "Hasil bulan ini",
      "↑ 比上月 +24 趟": "↑ +24 trip vs bulan lepas",
    },
  };

  // ============== HTML DICTIONARY (full innerHTML for complex h1/h2/...) ==============
  const HTML_DICT = {
    en: {
      "hero.eyebrow":
        '<span class="eyebrow-dot"></span>\n        Built for Singapore &amp; Malaysia charter companies',
      "hero.h1":
        'Free charter owners from Excel and <em>whiteboard dispatch</em><br>— for good',
      "pain.h2": 'Every day drains into <em>coordination &amp; payroll</em>',
      "demo.h2": "No signup — <em>just open and look</em>",
      "features.h2": "Everything you'll use daily — <em>built in</em>",
      "pricing.h2": "Pick the plan that <em>fits your size</em>",
      "cases.h2": "Charter companies <em>already using TripFlow</em>",
      "faq.h2": "Things you might <em>want to know</em>",
      "cta.h2": "Give us <em>30 minutes</em>,<br>let's talk about your fleet",
      "pricing.note":
        '💡 <strong>10% off annual</strong> · roughly one month free. Lock in this year\'s price against future increases.',
    },
    ms: {
      "hero.eyebrow":
        '<span class="eyebrow-dot"></span>\n        Direka untuk syarikat sewa kereta Singapura &amp; Malaysia',
      "hero.h1":
        'Bebaskan pemilik daripada Excel dan <em>penghantaran papan putih</em><br>— buat selamanya',
      "pain.h2": 'Setiap hari habis untuk <em>koordinasi &amp; kira gaji</em>',
      "demo.h2": "Tanpa daftar — <em>buka dan lihat terus</em>",
      "features.h2": "Semua yang anda guna setiap hari — <em>terbina dalam</em>",
      "pricing.h2": "Pilih pelan yang <em>sesuai dengan saiz anda</em>",
      "cases.h2": "Syarikat sewa kereta <em>yang sudah guna TripFlow</em>",
      "faq.h2": "Perkara yang anda mungkin <em>ingin tahu</em>",
      "cta.h2": "Beri kami <em>30 minit</em>,<br>mari berbual tentang armada anda",
      "pricing.note":
        '💡 <strong>10% diskaun tahunan</strong> · kira-kira sebulan percuma. Kunci harga tahun ini, tidak terjejas kenaikan masa depan.',
    },
    zh: {
      // Original Chinese — restored on switch back. Populated on first DOM scan.
    },
  };

  // ============== INTERNAL STATE ==============
  const STORAGE_KEY = "tripflow-lang";
  const SUPPORTED = ["zh", "en", "ms"];
  const HTML_LANG_TAG = { zh: "zh-Hans", en: "en", ms: "ms" };

  // Cache original text per text node so we can restore zh
  const origText = new WeakMap();
  // Cache original innerHTML for [data-i18n-html] elements
  const origHTML = new WeakMap();

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : "zh";
  }

  function collectTextNodes(root) {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        // Skip the language switcher buttons themselves
        if (p.closest && p.closest("[data-lang-switcher]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = "zh";

    // 1. Whole-innerHTML overrides (h1/h2 with inline em/br)
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      if (!origHTML.has(el)) origHTML.set(el, el.innerHTML);
      const key = el.getAttribute("data-i18n-html");
      if (lang === "zh") {
        el.innerHTML = origHTML.get(el);
      } else if (HTML_DICT[lang] && HTML_DICT[lang][key]) {
        el.innerHTML = HTML_DICT[lang][key];
      } else {
        el.innerHTML = origHTML.get(el);
      }
    });

    // 2. Text-node walking
    const nodes = collectTextNodes(document.body);
    for (const node of nodes) {
      if (!origText.has(node)) origText.set(node, node.textContent);
      const original = origText.get(node);
      const key = original.trim();
      if (lang === "zh") {
        node.textContent = original;
      } else if (DICT[lang] && DICT[lang][key]) {
        const lead = original.match(/^\s*/)[0];
        const trail = original.match(/\s*$/)[0];
        node.textContent = lead + DICT[lang][key] + trail;
      } else {
        node.textContent = original;
      }
    }

    // 3. Title + meta description
    const titles = {
      zh: document.documentElement.getAttribute("data-title-zh") || document.title,
      en: document.documentElement.getAttribute("data-title-en"),
      ms: document.documentElement.getAttribute("data-title-ms"),
    };
    if (titles[lang]) document.title = titles[lang];

    // 4. Update <html lang>
    document.documentElement.lang = HTML_LANG_TAG[lang];

    // 5. Active button highlight
    document.querySelectorAll("[data-lang-btn]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-lang-btn") === lang);
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-btn") === lang));
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function bindSwitcher() {
    document.querySelectorAll("[data-lang-btn]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        applyLang(b.getAttribute("data-lang-btn"));
      });
    });
  }

  function init() {
    // Stash document title variants for switching
    const root = document.documentElement;
    if (!root.hasAttribute("data-title-zh")) {
      root.setAttribute("data-title-zh", document.title);
    }
    bindSwitcher();
    applyLang(getLang());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for debugging
  window.TripFlowI18n = { applyLang, DICT, HTML_DICT };
})();
