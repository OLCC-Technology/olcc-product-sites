/**
 * RenoFlow i18n — 中 / EN / MS one-click language switcher.
 *
 * Strategy: snapshot every text node on load; on language switch, look up the
 * trimmed Chinese text in the dictionary and substitute. Strings not in the
 * dictionary (proper nouns, names, currency amounts, dates, mock data) stay
 * unchanged. Elements with mixed inline HTML use the [data-i18n="key"] hook.
 *
 * Persisted via localStorage("renoflow_lang"). Default: zh.
 *
 * Used by:
 *  - /renoflow/index.html         (landing)
 *  - /renoflow/demo/index.html    (interactive demo)
 *
 * Dictionary merges keys from both pages. Key collisions resolve to identical
 * translations across pages, which is the desired behavior.
 */
(function () {
  'use strict';

  const SUPPORTED = ['zh', 'en', 'ms'];
  const STORAGE_KEY = 'renoflow_lang';
  const HTML_LANG = { zh: 'zh-CN', en: 'en', ms: 'ms' };

  // ─────────────────────────────────────────────────────────────────────────
  // Dictionary
  // Key   = exact trimmed Chinese text content of a leaf text node, OR a custom
  //         data-i18n="..." key for elements containing inline HTML.
  // Value = replacement string (plain text for text nodes, HTML for data-i18n).
  // Strings not in the dict stay in their original form.
  // ─────────────────────────────────────────────────────────────────────────
  const DICT = {
    en: {
      // ── data-i18n HTML keys (elements with <em>/<strong>/<br>) ───────────
      'hero-h1': 'Free renovation bosses from spreadsheets and <em>WhatsApp</em>',
      'pain-h2': 'Every day <em>buried in quotes and chasing materials</em>',
      'demo-h2': 'No signup, <em>just open and look</em>',
      'features-h2': 'Everything you use daily, <em>built in</em>',
      'pricing-h2': 'Pick a plan that <em>fits your size</em>',
      'cases-h2': 'Renovation companies already using <em>RenoFlow</em>',
      'faq-h2': 'What you may <em>want to know</em>',
      'cta-h2': "Let's spend <em>30 minutes</em><br>discussing your business",
      'banner-left': '✨ <strong>RenoFlow</strong> · Management system built for 1-3 person renovation teams',

      // ── Nav (landing) ────────────────────────────────────────────────────
      '功能': 'Features',
      '线上 Demo': 'Live Demo',
      '方案': 'Plans',
      '案例': 'Cases',
      '常见问题': 'FAQ',
      '预约展示 →': 'Book a Demo →',

      // ── Hero ─────────────────────────────────────────────────────────────
      '专为 JB 装修公司打造  ·  Johor Bahru': 'Built for JB renovation contractors  ·  Johor Bahru',
      'RenoFlow 是一个为 1-3 人小型装修团队量身打造的工具。估价单、Supplier 比价、项目成本、工时、PO、进度款、保修期 — 老板自己一个人，也能把账算清。':
        'RenoFlow is built for 1-3 person renovation teams. Quotes, supplier comparison, project costs, hours, POs, progress payments, warranty periods — even a one-person business can keep the books straight.',
      '看 5 分钟 Demo': 'Watch 5-min Demo',
      '查看方案': 'View Plans',
      '8 模块': '8 modules',
      '从估价单到保修期': 'From quote to warranty',
      '30 分钟': '30 mins',
      '出一张专业估价单': 'For a pro quote',
      '中文界面 + 本地支援': 'Chinese UI + local support',

      // ── Float cards + dashboard preview ─────────────────────────────────
      '估价单已生成': 'Quote generated',
      'Supplier 比价完成': 'Supplier comparison done',
      '这是今天的项目概况': "Today's project overview",
      '进行中项目': 'Active projects',
      '应收进度款': 'Receivables',
      '本月毛利': 'Monthly margin',
      '保修中项目': 'Projects under warranty',
      '今日待办': "Today's tasks",
      '2 个本周交付': '2 due this week',
      '⚠ 3 笔': '⚠ 3 due',
      '↑ vs 估价': '↑ vs quote',
      '1 个本月到期': '1 due this month',
      '待出': 'To send',
      '就绪': 'Ready',
      '追踪中': 'Tracking',

      // ── Pain section ─────────────────────────────────────────────────────
      '您是不是也遇到这些？': 'Sound familiar?',
      '您现在的痛': 'What hurts now',
      '老板自己一个人扛全部': 'You carry everything alone',
      '一张估价单要花 2-3 小时，常漏品项结果亏钱': 'A quote takes 2-3 hours, missed line items eat profit',
      '三家 supplier 报价靠 WhatsApp 截图比，找半天': 'Comparing 3 supplier quotes via WhatsApp screenshots takes ages',
      '外包工时全靠 WhatsApp 截图算钱，常漏算多算': 'Subcontractor hours via WhatsApp screenshots — always over or under',
      '项目做完算账才发现，估的赚的和实际差很多': 'Only at project end do you find quote vs actual differs hugely',
      '进度款收到哪一期，要翻 WhatsApp 才记得': 'You scroll WhatsApp to remember which payment milestone is in',
      '保修期到了没人提醒，客户要找重修才想起来': 'No warranty reminder — only when client demands rework do you remember',
      'RenoFlow 帮您': 'How RenoFlow helps',
      '一个人也能把账算清': 'One person, books still straight',
      '选模板 + 拉品项库，30 分钟出一张专业估价单': 'Pick a template + drag from your item library — 30-min pro quote',
      '同一品项三家 supplier 报价并排比较，最低自动标': 'Same items, 3 suppliers side-by-side — lowest auto-flagged',
      '外包工记工时手机一开就填，月底自动算钱': 'Subcontractors log hours on their phone — month-end auto-payroll',
      '每个项目都有"估 vs 实"对比，赚多少一目了然': 'Every project has Quote vs Actual — see margin at a glance',
      '订金/中期/尾款各期清清楚楚，到期自动 WhatsApp 提醒': 'Deposit / mid / final clearly tracked — auto WhatsApp reminders',
      '保修期到期前自动通知，主动联系客户做好印象': 'Auto-notify before warranty ends — reach out to clients proactively',

      // ── Demo section ─────────────────────────────────────────────────────
      'Live Demo · 立即试用': 'Live Demo · Try Now',
      '点击下方查看完整 demo。从估价单到保修期，8 个模块全部能点。这就是您未来每天会用的系统。':
        "Click below to view the full demo. From quote to warranty — all 8 modules are clickable. This is the system you'll use every day.",
      '🏠 老板视角 (全功能)': '🏠 Owner view (full features)',
      '完整互动 Demo': 'Full interactive demo',
      '点击下方按钮在新窗口打开 demo（推荐手机/桌面浏览）。可切换 3 个视角、点击 8 个模块、查看客户 portal 手机版界面。':
        'Click below to open the demo in a new window (mobile or desktop). Switch views, explore 8 modules, see the mobile client portal.',
      '打开 Demo': 'Open Demo',
      '想要一对一讲解？预约 30 分钟': 'Want a 1-on-1 walkthrough? Book 30 min',

      // ── Features ─────────────────────────────────────────────────────────
      '八大核心模块': '8 core modules',
      '不是通用 SaaS 硬塞进来。每个模块都是为 JB 小型装修队的实际工作流程设计 — 从估价到保修期，老板一个人也搞得定。':
        'Not a generic SaaS forced to fit. Every module is built for JB small renovation teams — from quote to warranty, runnable by one boss.',
      '估价单生成': 'Quote builder',
      '选模板 + 拉品项库，30 分钟出一张专业 PDF 估价单。可加公司 logo + 水印。':
        'Pick a template + drag from your item library — pro PDF quote in 30 min. Add company logo + watermark.',
      'Supplier 报价对比': 'Supplier price comparison',
      '同一品项群发三家 supplier，回价并排显示，最低自动标。':
        'Send the same items to 3 suppliers — replies side-by-side, lowest auto-flagged.',
      '项目成本核算': 'Project cost analysis',
      '每个项目"估价 vs 实际"自动对比，哪里赚哪里亏一目了然。':
        'Quote vs Actual per project — see where you profit or lose at a glance.',
      '工人/外包工时': 'Worker / subcontractor hours',
      '工人手机记工时，按日/项目归档。月底自动算钱，不再多算少算。':
        'Workers log on their phone, archived by day/project. Auto-payroll month-end.',
      '进度款收款': 'Progress payments',
      '订金/中期/尾款各期清清楚楚。到期前自动 WhatsApp 提醒客户。':
        'Deposit / mid / final clearly tracked. Auto-WhatsApp reminders before due.',
      '保修期管理': 'Warranty management',
      '每个项目保修期自动记录。到期前提醒，主动跟进做好客户印象。':
        'Each project warranty auto-tracked. Reminded before expiry, follow up proactively.',
      '项目进度追踪': 'Project tracking',
      '每个项目从签约到验收的阶段一目了然。延误自动标红。':
        'Each project from signing to handover at a glance. Delays auto-flagged.',
      '采购订单 PO': 'Purchase Orders (PO)',
      '选定 supplier 后一键生成 PO，到货签收 + 付款追踪全部跟着 PO 走。':
        'One-click PO from chosen supplier — delivery + payment tracking all flow with the PO.',

      // ── Pricing ──────────────────────────────────────────────────────────
      '透明定价': 'Transparent pricing',
      '所有方案都包含 hosting、域名、SSL 证书、每日备份和 8 大核心模块。Setup 费用一次性，月费起算。':
        'All plans include hosting, domain, SSL, daily backup and 8 core modules. One-time setup fee, plus monthly.',
      '适合 1 人接单 · ≤ 5 项目同时 · 老板一个人扛': 'For 1-person ops · ≤ 5 concurrent projects · solo boss',
      '/月': '/mo',
      'Setup 一次性 RM 1,800': 'One-time setup RM 1,800',
      '估价单生成 + 品项库': 'Quote builder + item library',
      '进度款收款 + WhatsApp 提醒': 'Progress payments + WhatsApp reminders',
      '保修期管理 + 到期通知': 'Warranty management + expiry alerts',
      'Hosting + 域名 + SSL': 'Hosting + domain + SSL',
      '工时记录 + PO': 'Hours + PO',
      '了解更多': 'Learn more',
      '⭐ 最受欢迎': '⭐ Most popular',
      '适合 1-3 人小队 · 5-15 项目同时 · 用外包工': 'For 1-3 person teams · 5-15 concurrent · uses subcontractors',
      'Setup 一次性 RM 3,500 · 首月免费': 'One-time setup RM 3,500 · 1st month free',
      'Solo 全部功能': 'Everything in Solo',
      'Supplier 报价对比 (3 家并排)': 'Supplier comparison (3 side-by-side)',
      'PO 采购单 + 到货追踪': 'POs + delivery tracking',
      '项目成本核算 (估 vs 实)': 'Project costs (quote vs actual)',
      '工人/外包工时记录': 'Worker / subcontractor hour logging',
      '多版本估价单': 'Multi-version quotes',
      '最多 3 位员工账号': 'Up to 3 staff accounts',
      '自定义报表 · 优先客服': 'Custom reports · priority support',
      '开始 30 天试用': 'Start 30-day trial',
      '适合 5+ 人 · 15+ 项目同时 · 想做更大': 'For 5+ people · 15+ concurrent · scaling up',
      '/月 起': '/mo from',
      'Setup 一次性 RM 6,000 起': 'One-time setup from RM 6,000',
      'Pro 所有功能': 'Everything in Pro',
      '无限员工账号': 'Unlimited staff accounts',
      '白标 (您的品牌名)': 'White-label (your brand)',
      '客制开发': 'Custom development',
      '专属经理': 'Dedicated manager',
      '会计系统 API 整合': 'Accounting API integration',
      '优先功能开发': 'Priority feature requests',
      'SLA 保证': 'SLA guarantee',
      '联络我们': 'Contact us',

      // ── Cases ────────────────────────────────────────────────────────────
      '真实案例': 'Real cases',
      '这些是 RenoFlow 的早期 pilot 客户。我们和他们一起把系统打磨成真正合用的工具。客户名字在客户允许后会更新。':
        "These are RenoFlow's early pilot clients. We polished the system with them. Names will be updated as clients allow.",
      '以前一张估价单熬夜写到半夜，现在选模板拉品项 30 分钟搞定。客户说我的估价单比别家专业，谈单容易多了。':
        "I used to stay up past midnight writing quotes. Now I pick a template and drag line items — done in 30 minutes. Clients say my quotes look more professional than competitors' — closing deals got easier.",
      'Supplier 比价功能救了我。以前比三家要找半天 WhatsApp 截图，现在并排显示最低自动标，一个项目省下几千。':
        'The supplier comparison saved me. I used to dig through WhatsApp screenshots — now side-by-side with lowest auto-flagged, saves thousands per project.',
      '以前外包工时全靠 WhatsApp 截图算，常常多算少算。现在他们自己记工时，月底我一键算钱，省了一整天功夫。':
        'Subcontractor hours used to come via WhatsApp screenshots — always over or under. Now they log it themselves, I run payroll in one click — saves me a whole day.',
      'Johor Bahru · 老板': 'Johor Bahru · Owner',

      // ── FAQ ──────────────────────────────────────────────────────────────
      '我自己一个人接单，会不会用不上这么多功能？': "I'm a solo operator — won't this be too much?",
      '恰恰相反 — 一个人接单才更需要系统帮您记着。估价、收款进度、保修期，每件都要追，没系统就靠脑记和翻 WhatsApp。Solo 方案 RM 180/月，就是为 1 人老板设计的最精简组合。等团队扩大再升 Pro。':
        "On the contrary — a solo op needs the system MORE to remember things. Quotes, payment milestones, warranties — without a system you're juggling mentally and scrolling WhatsApp. The Solo plan at RM 180/mo is the leanest combo for 1-person bosses. Upgrade to Pro when you grow.",
      '我现有的客户资料和过去的估价单怎么办？': 'What about my existing customer data and past quotes?',
      '我们的服务包含数据搬迁。您给我们现有的 Excel、PDF 报价、或纸本资料，我们帮您整理 + 输入系统。包括把您常用的品项库（水电、瓷砖、五金、木工的常用价格）建好。不用您花时间。':
        'Our service includes data migration. Give us your Excel, PDF quotes, or paper records — we organize and import them. Including building your item library (electrical, tiling, hardware, carpentry common pricing). No time investment from you.',
      '每个项目都不一样，估价单可以自定义吗？': 'Every project is different — can I customize quotes?',
      '可以。Setup 阶段我们会跟您一起建您专属的品项库（您常用的水电、油漆、瓷砖、木工等），之后估价就是拉品项、改数量。模板和栏位都可以按您的习惯调整。这是 RenoFlow 跟通用 SaaS 最大的差别。':
        "Yes. During setup we build your custom item library (your regular electrical, paint, tile, carpentry items), then quoting is just drag + adjust quantity. Templates and fields adapt to your habits. This is RenoFlow's biggest difference from generic SaaS.",
      '外包工不会用 app 怎么办？': "What if subcontractors can't use apps?",
      '工时记录只是手机浏览器打开链接、点几下就完成，不用注册不用下 app。如果实在不愿意填，您也可以让他们继续 WhatsApp 报工时，您自己进系统补登 — 算钱仍然自动化。':
        'Logging hours is just opening a mobile link and tapping a few times — no signup, no app install. If they refuse, they can report via WhatsApp and you backfill in the system — payroll stays automated.',
      'Supplier 不肯用系统怎么办？': "What if suppliers won't use the system?",
      'Supplier 端零门槛。您发估价请求时系统会自动发一条 WhatsApp 链接给 supplier，他在手机浏览器里输入价格就好，不用注册不用 app。这是设计上的核心考虑 — 您能让 supplier 配合的方式，他们才会用。':
        'Zero friction on the supplier side. When you send a quote request, the system auto-sends a WhatsApp link — they enter prices in their mobile browser. No signup, no app. Designed around what suppliers actually agree to use.',
      '保修期管理具体怎么运作？': 'How does warranty management actually work?',
      '签约时您设保修期（例如水电 1 年、瓷砖 6 个月）。系统会在到期前 30 天提醒您，您可以主动联系客户做一次回访。客户感觉好，下次装修或推荐朋友的概率自然高。这就是 1-3 人小队最难做、但最能留客的事。':
        'At contract signing you set the warranty (e.g. electrical 1yr, tiling 6mo). The system reminds you 30 days before expiry so you can proactively check in. Clients feel cared for — much higher chance of repeat or referral. The hardest yet most retention-effective thing for 1-3 person teams.',
      '可以试用一段时间再决定吗？': 'Can I trial it before deciding?',
      'Pro 方案提供首月免费试用 — Setup 完成后您有 30 天评估。不满意可全额退还 Setup 费用，您只损失搬数据的时间，没有现金损失。':
        'Pro plan offers 1st month free trial — 30 days to evaluate after setup. Not satisfied? Full refund of setup fee. You only lose the data migration time, no cash loss.',
      '你们公司在 JB 哪里？出事可以找你们吗？': 'Where in JB are you? Can I find you if something goes wrong?',
      '我们就在 Johor Bahru。WhatsApp 即时回复、必要时上门。这是我们和国外 SaaS 最大的差别。':
        "We're right here in Johor Bahru. Instant WhatsApp reply, on-site when needed. This is our biggest difference vs overseas SaaS.",

      // ── CTA + footer (landing) ───────────────────────────────────────────
      '下一步': 'Next step',
      '免费咨询 · 不绑约 · 现场或线上 demo 任您选': 'Free consultation · No contract · On-site or online demo',
      'WhatsApp 我们': 'WhatsApp us',
      '先看 demo': 'See demo first',
      '为 1-3 人小型装修团队量身打造的工具。让装修老板从估价表和 WhatsApp 解脱出来。':
        'Built for 1-3 person renovation teams. Freeing renovation bosses from spreadsheets and WhatsApp.',
      '产品': 'Product',
      '核心功能': 'Core features',
      '定价方案': 'Pricing',
      '客户案例': 'Customer cases',
      '联络': 'Contact',

      // ── Demo banner / industry bar ───────────────────────────────────────
      '预约 Demo →': 'Book Demo →',
      '行业演示：': 'Industry demo:',
      '🏠 装修公司 (老板视角)': '🏠 Renovation co. (Boss view)',
      'Demo · 数据为演示用': 'Demo · sample data only',

      // ── Demo sidebar ─────────────────────────────────────────────────────
      '老板后台': 'Boss backend',
      '日常': 'Daily',
      '仪表盘': 'Dashboard',
      '采购': 'Procurement',
      '财务': 'Finance',
      '运营': 'Operations',
      '工时记录': 'Hours',
      'Supplier 比价': 'Supplier comparison',

      // ── Demo: Dashboard ──────────────────────────────────────────────────
      '早安，陈老板 👋': 'Good morning, Boss Chen 👋',
      '这是今天的陈氏装修概况 · 2026/05/24': "Today's overview · 2026/05/24",
      '本月报表': 'Monthly report',
      '+ 新建项目': '+ New project',
      '⚠ 3 笔到期': '⚠ 3 due',
      '↑ 12% vs 估价': '↑ 12% vs quote',
      '查看全部 →': 'View all →',
      '项目': 'Project',
      '类型': 'Type',
      '说明': 'Description',
      '状态': 'Status',
      '估价单': 'Quote',
      '今日截止，待发给客户确认': 'Due today, pending send to client',
      '3 家 supplier 回价已齐，最低 RM 32/m²': '3 suppliers replied, lowest RM 32/m²',
      '进度款': 'Payment',
      '中期款 RM 8,500 到期 3 天': 'Mid-payment RM 8,500 due in 3 days',
      '保修期': 'Warranty',
      '水电保修期 25 天后到期，建议回访': 'Electrical warranty ends in 25 days, suggest visit',
      '工时': 'Hours',
      '李师傅 + 黄师傅 本周工时待确认': "This week's worker hours pending confirmation",
      '紧急': 'Urgent',
      '待收': 'Awaiting',
      '提醒': 'Reminder',
      '待审': 'Pending review',

      // ── Demo: Projects board ─────────────────────────────────────────────
      '所有进行中项目，按阶段排列。延误自动标红': 'All active projects by stage. Delays auto-flagged.',
      '筛选': 'Filter',
      '📝 估价中': '📝 Quoting',
      '📋 采购中': '📋 Procuring',
      '🔨 施工中': '🔨 Building',
      '✅ 验收中': '✅ Handover',
      '今日截止': 'Due today',
      '3 天内': 'Within 3 days',
      '瓷砖待到': 'Tiles incoming',
      '如期': 'On schedule',
      '延误 2 天': '2 days late',
      '本周': 'This week',
      '完工待验': 'Done, pending handover',
      '已签约': 'Signed',
      '进度 60%': '60% progress',
      '进度 40%': '40% progress',

      // ── Demo: Quote builder ──────────────────────────────────────────────
      '估价单生成 · 林先生客厅翻新': 'Quote builder · Mr. Lim living room',
      '从品项库拉选 + 改数量 + 一键导出 PDF': 'Drag from item library + adjust qty + 1-click PDF',
      '预览 PDF': 'Preview PDF',
      '+ 加品项': '+ Add item',
      '客户资料': 'Customer details',
      '客户姓名': 'Customer name',
      '项目地址': 'Project address',
      '面积': 'Area',
      '项目品项（从您的装修品项库拉选）': 'Project items (from your renovation library)',
      '品项': 'Item',
      '单位': 'Unit',
      '数量': 'Qty',
      '单价 (RM)': 'Unit price (RM)',
      '小计 (RM)': 'Subtotal (RM)',
      '水电改造': 'Electrical rewiring',
      '新加 4 个 socket + 灯位重新走线': 'Add 4 sockets + relocate lighting',
      '套': 'set',
      '墙身油漆': 'Wall paint',
      'Nippon 立邦 全亚光 5 升': 'Nippon matte 5L',
      '瓷砖铺设（包工包料）': 'Tile laying (labour + material)',
      '600×600 抛光砖 含勾缝': '600×600 polished tiles incl. grout',
      '石膏天花板': 'Plaster ceiling',
      '含间接灯槽设计': 'Incl. cove light design',
      '木工 - 电视墙 + 收纳柜': 'Carpentry — TV wall + storage',
      '实木皮包面 + 暗藏灯条': 'Veneer + hidden light strips',
      '小计 + 6% SST': 'Subtotal + 6% SST',
      '已自动加 6% SST': 'Auto-added 6% SST',
      '客厅 800 sqft': 'Living 800 sqft',

      // ── Demo: Supplier comparison ────────────────────────────────────────
      'Supplier 报价对比 · 黄太太厨房瓷砖': 'Supplier comparison · Mrs. Wong kitchen tiles',
      '三家 supplier 回价并排显示，最低自动标 ⭐': 'Three suppliers side-by-side — lowest auto-flagged ⭐',
      '+ 加一家 supplier': '+ Add a supplier',
      '采用 Supplier B → 生成 PO': 'Use Supplier B → Generate PO',
      '600×600 抛光砖（每 m²）': '600×600 polished tile (per m²)',
      '瓷砖胶 25kg': 'Tile adhesive 25kg',
      '勾缝剂 5kg': 'Grout 5kg',
      '送货费': 'Delivery fee',
      '免费 (>RM 500)': 'Free (>RM 500)',
      '总计（含送货）': 'Total (incl. delivery)',
      '通用瓷砖': 'Universal Tiles',

      // ── Demo: PO ─────────────────────────────────────────────────────────
      '本月所有 PO，按状态追踪': "This month's POs, tracked by status",
      '已完成': 'Completed',
      '+ 新建 PO': '+ New PO',
      '本月 PO 数': 'POs this month',
      '待到货': 'Pending arrival',
      '已到未付': 'Arrived, unpaid',
      '本月总采购': 'Total purchasing',
      '运送中 · 预计 5/26 到': 'In transit · ETA 5/26',
      '已到未付 · 3 天': 'Arrived, unpaid · 3 days',
      '已到 已付': 'Arrived, paid',

      // ── Demo: Payment ────────────────────────────────────────────────────
      '每个项目订金/中期/尾款分期追踪 · 到期自动 WhatsApp 提醒客户':
        'Per project: deposit / mid / final tracked · auto-WhatsApp reminders',
      '手动发提醒': 'Send reminder',
      '本月已收': 'Received this month',
      '应收待收': 'Receivable',
      '逾期未收': 'Overdue',
      '合约总额': 'Total contracts',
      '↑ vs 上月': '↑ vs last month',
      '3 笔到期': '3 due',
      '1 笔逾期 12 天': '1 overdue 12 days',
      '6 个进行中项目': '6 active projects',
      '应收款（按到期日排序）': 'Receivables (sorted by due date)',
      '项目 / 客户': 'Project / Customer',
      '期别': 'Stage',
      '金额': 'Amount',
      '应收日': 'Due date',
      '操作': 'Action',
      '合约 RM 35K': 'Contract RM 35K',
      '合约 RM 42K': 'Contract RM 42K',
      '合约 RM 24K': 'Contract RM 24K',
      '合约 RM 12K': 'Contract RM 12K',
      '中期款 (40%)': 'Mid (40%)',
      '中期款 (50%)': 'Mid (50%)',
      '订金 (30%)': 'Deposit (30%)',
      '尾款 (20%)': 'Final (20%)',
      '逾期 12 天': 'Overdue 12 days',
      '3 天到期': 'Due in 3 days',
      '验收后': 'After handover',
      '发催款': 'Send reminder',
      '自动已排': 'Auto-scheduled',

      // ── Demo: Cost ───────────────────────────────────────────────────────
      '项目成本核算 · 泰丰花园翻新': 'Project costs · Tai Hong Garden renovation',
      '估价 vs 实际成本，每个品类分别对比': 'Quote vs actual, per category',
      '导出 Excel': 'Export Excel',
      '+ 加成本项': '+ Add cost item',
      '合约金额': 'Contract amount',
      '估算总成本': 'Estimated total cost',
      '实际成本（至今）': 'Actual cost (to date)',
      '预计最终毛利': 'Projected final margin',
      '毛利 32%': 'Margin 32%',
      '已完成 65%': '65% complete',
      '分品类成本对比（估 vs 实）': 'Cost by category (quote vs actual)',
      '水电料': 'Electrical materials',
      '瓷砖 + 工': 'Tiles + labour',
      '油漆 + 工': 'Paint + labour',
      '木工': 'Carpentry',
      '外包工时': 'Subcontractor hours',
      '其他杂支': 'Other expenses',
      '(未完)': '(in progress)',
      '(未发生)': '(not yet)',

      // ── Demo: Hours ──────────────────────────────────────────────────────
      '工人/外包工时记录': 'Worker / subcontractor hours',
      '工人手机记工时 · 月底自动算钱': 'Workers log on phone · auto payroll month-end',
      '发送本月报表': "Send month's report",
      '+ 加工人': '+ Add worker',
      '本月总工时': 'Total hours this month',
      '5 位外包工': '5 subcontractors',
      '本月应付工钱': 'Wages payable',
      '待审核工时': 'Hours pending review',
      '2 人待确认': '2 awaiting confirmation',
      '本周高峰日': 'Peak day this week',
      '周三': 'Wednesday',
      '本月工时明细（按工人）': "Month's hour breakdown (by worker)",
      '工人': 'Worker',
      '工种': 'Trade',
      '本月工时': 'Hours this month',
      '时薪 (RM)': 'Hourly (RM)',
      '项目分配': 'Projects',
      '应付 (RM)': 'Payable (RM)',
      '水电': 'Electrical',
      '瓷砖': 'Tiling',
      '油漆': 'Paint',
      '泥水': 'Masonry',
      '已确认': 'Confirmed',
      '22h 待审': '22h pending',
      '20h 待审': '20h pending',

      // ── Demo: Warranty ───────────────────────────────────────────────────
      '每个项目按品类设保修期 · 到期前 30 天自动提醒您主动回访':
        'Per-category warranty · auto-reminder 30 days before expiry to proactively reach out',
      '历史保修记录': 'Warranty history',
      '+ 加项目保修': '+ Add warranty',
      '本月到期': 'Expiring this month',
      '下月到期': 'Expiring next month',
      '本月主动回访': 'Proactive visits this month',
      '建议回访': 'Suggest visit',
      '1 个推荐了朋友': '1 referred a friend',
      '⚠️ 即将到期（30 天内）': '⚠️ Expiring soon (within 30 days)',
      '保修中项目': 'Projects under warranty',
      '到期': 'Expires',
      '剩余': 'Remaining',
      '主动回访': 'Proactive visit',
      '查看': 'View',
      '25 天': '25 days',
      '49 天': '49 days',
      '285 天': '285 days',
      '151 天': '151 days',

      // ── Demo: footer ─────────────────────────────────────────────────────
      '想知道您的装修队可以怎样使用 RenoFlow？': 'Curious how your team can use RenoFlow?',
      '我们提供一对一咨询 · 现场 demo · 免费试用 30 天':
        '1-on-1 consultation · on-site demo · free 30-day trial',

      // ── Info-box keys (data-i18n on each .info-box) ──────────────────────
      'info-dashboard':
        '💡 <strong>Why this matters:</strong> A renovation boss juggles many things — quotes, chasing payments, materials, site visits. The dashboard prioritises today\'s must-dos so you know what to tackle first, never dropping the ball.',
      'info-projects':
        '💡 <strong>Why this matters:</strong> 1-3 person teams easily get tangled when several projects run in parallel. The board shows each project\'s stage at a glance. Delayed projects auto-flag red — you instantly know what needs firefighting.',
      'info-quote':
        '💡 <strong>Why this matters:</strong> Quotes used to take 2-3 hours with missed items costing money. Now: drag from item library + adjust qty — done in 30 minutes. Same client wants a new version? Duplicate it; the old one is archived. Client asks "why so expensive?" — show the line-item breakdown.',
      'info-supplier':
        '💡 <strong>Why this matters:</strong> Comparison used to mean digging through WhatsApp screenshots. Now: blast the same items to 3 suppliers, replies side-by-side, lowest auto-flagged ⭐, 1-click → PO. <strong>This single deal saves RM 820 by picking Supplier B</strong> — tens of thousands across a year.',
      'info-po':
        '💡 <strong>Why this matters:</strong> All procurement flows through POs — supplier has a record, you have a record, the client billing has proof. "What\'s arrived? What\'s still unpaid?" — visible at a glance. You never forget to pay a supplier (and damage the relationship, which raises future quotes).',
      'info-payment-warn':
        '⚠️ <strong>Mr. Chen storefront mid-payment 12 days overdue.</strong> System auto-sent WhatsApp reminders on 5/13, 5/15, 5/19. Suggest a personal call today.',
      'info-cost-warn':
        '⚠️ <strong>Paint over budget by 5% (RM 150).</strong> Likely missed second primer coat in the original quote. Suggestion: next time, quote paint at 2 primer + 2 topcoats by default.',
      'info-cost':
        '💡 <strong>Why this matters:</strong> The thing 1-3 person teams most easily skip — how much each project actually earned. Quote vs Actual auto-comparison → see which category often overshoots → adjust your future quoting. Margins can climb from 20% to 30% over a year.',
      'info-hours':
        '💡 <strong>Why this matters:</strong> Subcontractors don\'t need an app — they open a mobile link and tap a few times. At month-end you 1-click export the report, hours × rate auto-calculated. No more arguments over miscalculations — better relationships mean easier callouts.',
      'info-warranty':
        '💡 <strong>Why this matters:</strong> The hardest yet most retention-effective thing for 1-3 person teams — proactive follow-ups. The system reminds you 30 days before warranty expiry → you call or visit → clients feel cared for → much higher chance of repeat or referral. This one feature alone drives returning customers.',
    },

    ms: {
      // ── data-i18n HTML keys ──────────────────────────────────────────────
      'hero-h1': 'Bebaskan bos renovasi daripada hamparan dan <em>WhatsApp</em>',
      'pain-h2': 'Setiap hari <em>terbenam dalam sebut harga dan kejar bahan</em>',
      'demo-h2': 'Tiada daftar, <em>buka dan lihat terus</em>',
      'features-h2': 'Semua yang anda guna setiap hari, <em>terbina dalam</em>',
      'pricing-h2': 'Pilih pelan yang <em>sesuai dengan saiz anda</em>',
      'cases-h2': 'Syarikat renovasi yang sudah guna <em>RenoFlow</em>',
      'faq-h2': 'Yang anda mungkin <em>ingin tahu</em>',
      'cta-h2': 'Mari luangkan <em>30 minit</em><br>berbincang tentang perniagaan anda',
      'banner-left': '✨ <strong>RenoFlow</strong> · Sistem pengurusan untuk pasukan renovasi 1-3 orang',

      // Nav
      '功能': 'Ciri',
      '线上 Demo': 'Demo Langsung',
      '方案': 'Pelan',
      '案例': 'Kes',
      '常见问题': 'Soalan Lazim',
      '预约展示 →': 'Tempah Demo →',

      // Hero
      '专为 JB 装修公司打造  ·  Johor Bahru': 'Khas untuk kontraktor renovasi JB  ·  Johor Bahru',
      'RenoFlow 是一个为 1-3 人小型装修团队量身打造的工具。估价单、Supplier 比价、项目成本、工时、PO、进度款、保修期 — 老板自己一个人，也能把账算清。':
        'RenoFlow dibina untuk pasukan renovasi 1-3 orang. Sebut harga, perbandingan pembekal, kos projek, jam kerja, PO, bayaran kemajuan, tempoh waranti — bos seorang pun boleh urus akaun dengan teratur.',
      '看 5 分钟 Demo': 'Tonton Demo 5 Minit',
      '查看方案': 'Lihat Pelan',
      '8 模块': '8 modul',
      '从估价单到保修期': 'Dari sebut harga ke waranti',
      '30 分钟': '30 minit',
      '出一张专业估价单': 'Hasilkan sebut harga profesional',
      '中文界面 + 本地支援': 'UI Cina + sokongan tempatan',

      // Floats + dashboard
      '估价单已生成': 'Sebut harga dijana',
      'Supplier 比价完成': 'Perbandingan pembekal siap',
      '这是今天的项目概况': 'Tinjauan projek hari ini',
      '进行中项目': 'Projek aktif',
      '应收进度款': 'Belum diterima',
      '本月毛利': 'Untung bulan ini',
      '保修中项目': 'Projek dalam waranti',
      '今日待办': 'Tugasan hari ini',
      '2 个本周交付': '2 untuk minggu ini',
      '⚠ 3 笔': '⚠ 3 tertunggak',
      '↑ vs 估价': '↑ vs anggaran',
      '1 个本月到期': '1 tamat bulan ini',
      '待出': 'Untuk hantar',
      '就绪': 'Sedia',
      '追踪中': 'Sedang dijejak',

      // Pain
      '您是不是也遇到这些？': 'Kedengaran biasa?',
      '您现在的痛': 'Masalah anda sekarang',
      '老板自己一个人扛全部': 'Anda tanggung semua sendirian',
      '一张估价单要花 2-3 小时，常漏品项结果亏钱': 'Satu sebut harga ambil 2-3 jam, item tertinggal menyebabkan rugi',
      '三家 supplier 报价靠 WhatsApp 截图比，找半天': 'Banding 3 sebut harga pembekal guna tangkap layar WhatsApp lambat',
      '外包工时全靠 WhatsApp 截图算钱，常漏算多算': 'Jam kerja subkontraktor guna WhatsApp — selalu silap',
      '项目做完算账才发现，估的赚的和实际差很多': 'Hanya selepas projek siap anda dapati anggaran vs sebenar jauh berbeza',
      '进度款收到哪一期，要翻 WhatsApp 才记得': 'Anda perlu scroll WhatsApp untuk ingat fasa bayaran mana yang masuk',
      '保修期到了没人提醒，客户要找重修才想起来': 'Tiada peringatan waranti — bila klien minta kerja semula baru anda ingat',
      'RenoFlow 帮您': 'RenoFlow bantu anda',
      '一个人也能把账算清': 'Seorang pun boleh urus akaun',
      '选模板 + 拉品项库，30 分钟出一张专业估价单': 'Pilih templat + tarik dari pustaka item — sebut harga profesional 30 minit',
      '同一品项三家 supplier 报价并排比较，最低自动标': 'Item sama, 3 pembekal sebelah-menyebelah — terendah ditanda auto',
      '外包工记工时手机一开就填，月底自动算钱': 'Subkontraktor isi jam kerja di telefon — gaji auto hujung bulan',
      '每个项目都有"估 vs 实"对比，赚多少一目了然': 'Setiap projek ada Anggaran vs Sebenar — lihat untung sekilas',
      '订金/中期/尾款各期清清楚楚，到期自动 WhatsApp 提醒': 'Deposit / tengah / akhir dijejaki jelas — auto peringatan WhatsApp',
      '保修期到期前自动通知，主动联系客户做好印象': 'Auto-makluman sebelum waranti tamat — hubungi pelanggan secara proaktif',

      // Demo section
      'Live Demo · 立即试用': 'Demo Langsung · Cuba Sekarang',
      '点击下方查看完整 demo。从估价单到保修期，8 个模块全部能点。这就是您未来每天会用的系统。':
        'Klik di bawah untuk lihat demo penuh. Dari sebut harga ke waranti — 8 modul boleh diklik. Inilah sistem yang anda guna setiap hari.',
      '🏠 老板视角 (全功能)': '🏠 Pandangan bos (ciri penuh)',
      '完整互动 Demo': 'Demo interaktif penuh',
      '点击下方按钮在新窗口打开 demo（推荐手机/桌面浏览）。可切换 3 个视角、点击 8 个模块、查看客户 portal 手机版界面。':
        'Klik butang di bawah untuk buka demo dalam tetingkap baru (telefon atau desktop). Tukar pandangan, jelajah 8 modul, lihat portal pelanggan mudah alih.',
      '打开 Demo': 'Buka Demo',
      '想要一对一讲解？预约 30 分钟': 'Mahu penerangan satu-satu? Tempah 30 minit',

      // Features
      '八大核心模块': '8 modul teras',
      '不是通用 SaaS 硬塞进来。每个模块都是为 JB 小型装修队的实际工作流程设计 — 从估价到保修期，老板一个人也搞得定。':
        'Bukan SaaS generik yang dipaksa muat. Setiap modul direka untuk aliran kerja pasukan renovasi kecil JB — sebut harga ke waranti, satu bos pun boleh urus.',
      '估价单生成': 'Penjana Sebut Harga',
      '选模板 + 拉品项库，30 分钟出一张专业 PDF 估价单。可加公司 logo + 水印。':
        'Pilih templat + tarik dari pustaka item — PDF sebut harga profesional 30 minit. Tambah logo + tera air.',
      'Supplier 报价对比': 'Perbandingan Pembekal',
      '同一品项群发三家 supplier，回价并排显示，最低自动标。':
        'Hantar item sama kepada 3 pembekal — balasan sebelah-menyebelah, terendah ditanda auto.',
      '项目成本核算': 'Analisis Kos Projek',
      '每个项目"估价 vs 实际"自动对比，哪里赚哪里亏一目了然。':
        'Anggaran vs Sebenar bagi setiap projek — lihat untung rugi sekilas.',
      '工人/外包工时': 'Jam Kerja Pekerja / Sub',
      '工人手机记工时，按日/项目归档。月底自动算钱，不再多算少算。':
        'Pekerja log di telefon, diarkib ikut hari/projek. Gaji auto hujung bulan.',
      '进度款收款': 'Bayaran Kemajuan',
      '订金/中期/尾款各期清清楚楚。到期前自动 WhatsApp 提醒客户。':
        'Deposit / tengah / akhir dijejaki jelas. Auto-peringatan WhatsApp sebelum tarikh tamat.',
      '保修期管理': 'Pengurusan Waranti',
      '每个项目保修期自动记录。到期前提醒，主动跟进做好客户印象。':
        'Setiap projek auto-direkod. Peringatan sebelum tamat, susul secara proaktif.',
      '项目进度追踪': 'Penjejakan Projek',
      '每个项目从签约到验收的阶段一目了然。延误自动标红。':
        'Setiap projek dari kontrak ke serah-terima jelas. Lewat ditanda auto.',
      '采购订单 PO': 'Pesanan Belian (PO)',
      '选定 supplier 后一键生成 PO，到货签收 + 付款追踪全部跟着 PO 走。':
        'PO satu klik dari pembekal pilihan — penghantaran + bayaran semua mengikut PO.',

      // Pricing
      '透明定价': 'Harga telus',
      '所有方案都包含 hosting、域名、SSL 证书、每日备份和 8 大核心模块。Setup 费用一次性，月费起算。':
        'Semua pelan termasuk hosting, domain, SSL, sandaran harian dan 8 modul teras. Bayaran setup sekali sahaja, ditambah bulanan.',
      '适合 1 人接单 · ≤ 5 项目同时 · 老板一个人扛': 'Untuk operasi seorang · ≤ 5 projek serentak · bos sendirian',
      '/月': '/bln',
      'Setup 一次性 RM 1,800': 'Setup sekali RM 1,800',
      '估价单生成 + 品项库': 'Penjana sebut harga + pustaka item',
      '进度款收款 + WhatsApp 提醒': 'Bayaran kemajuan + peringatan WhatsApp',
      '保修期管理 + 到期通知': 'Pengurusan waranti + amaran tamat',
      'Hosting + 域名 + SSL': 'Hosting + domain + SSL',
      '工时记录 + PO': 'Jam kerja + PO',
      '了解更多': 'Ketahui Lagi',
      '⭐ 最受欢迎': '⭐ Paling popular',
      '适合 1-3 人小队 · 5-15 项目同时 · 用外包工': 'Untuk pasukan 1-3 · 5-15 projek serentak · guna subkontraktor',
      'Setup 一次性 RM 3,500 · 首月免费': 'Setup sekali RM 3,500 · bulan pertama percuma',
      'Solo 全部功能': 'Semua dalam Solo',
      'Supplier 报价对比 (3 家并排)': 'Perbandingan pembekal (3 sebelah)',
      'PO 采购单 + 到货追踪': 'PO + penjejakan penghantaran',
      '项目成本核算 (估 vs 实)': 'Kos projek (anggaran vs sebenar)',
      '工人/外包工时记录': 'Log jam pekerja / sub',
      '多版本估价单': 'Sebut harga pelbagai versi',
      '最多 3 位员工账号': 'Sehingga 3 akaun staf',
      '自定义报表 · 优先客服': 'Laporan tersuai · sokongan utama',
      '开始 30 天试用': 'Mula percubaan 30 hari',
      '适合 5+ 人 · 15+ 项目同时 · 想做更大': 'Untuk 5+ orang · 15+ projek · sedang berkembang',
      '/月 起': '/bln dari',
      'Setup 一次性 RM 6,000 起': 'Setup sekali dari RM 6,000',
      'Pro 所有功能': 'Semua dalam Pro',
      '无限员工账号': 'Akaun staf tanpa had',
      '白标 (您的品牌名)': 'Label putih (jenama anda)',
      '客制开发': 'Pembangunan tersuai',
      '专属经理': 'Pengurus khas',
      '会计系统 API 整合': 'Integrasi API perakaunan',
      '优先功能开发': 'Permintaan ciri keutamaan',
      'SLA 保证': 'Jaminan SLA',
      '联络我们': 'Hubungi kami',

      // Cases
      '真实案例': 'Kes sebenar',
      '这些是 RenoFlow 的早期 pilot 客户。我们和他们一起把系统打磨成真正合用的工具。客户名字在客户允许后会更新。':
        'Inilah pelanggan pilot awal RenoFlow. Kami sempurnakan sistem bersama mereka. Nama akan dikemas kini apabila pelanggan benarkan.',
      '以前一张估价单熬夜写到半夜，现在选模板拉品项 30 分钟搞定。客户说我的估价单比别家专业，谈单容易多了。':
        'Dulu saya berjaga lewat malam menulis sebut harga. Sekarang pilih templat dan tarik item — siap dalam 30 minit. Pelanggan kata sebut harga saya nampak lebih profesional — tutup deal jadi mudah.',
      'Supplier 比价功能救了我。以前比三家要找半天 WhatsApp 截图，现在并排显示最低自动标，一个项目省下几千。':
        'Ciri perbandingan pembekal selamatkan saya. Dulu korek tangkap layar WhatsApp — kini sebelah-menyebelah dengan terendah ditanda auto, jimat ribuan setiap projek.',
      '以前外包工时全靠 WhatsApp 截图算，常常多算少算。现在他们自己记工时，月底我一键算钱，省了一整天功夫。':
        'Dulu jam subkontraktor datang dari tangkap layar WhatsApp — selalu silap. Kini mereka log sendiri, saya jalankan gaji satu klik — jimat sehari penuh.',
      'Johor Bahru · 老板': 'Johor Bahru · Bos',

      // FAQ
      '我自己一个人接单，会不会用不上这么多功能？': 'Saya operasi seorang — adakah ini terlalu banyak?',
      '恰恰相反 — 一个人接单才更需要系统帮您记着。估价、收款进度、保修期，每件都要追，没系统就靠脑记和翻 WhatsApp。Solo 方案 RM 180/月，就是为 1 人老板设计的最精简组合。等团队扩大再升 Pro。':
        'Sebaliknya — operasi seorang LEBIH perlukan sistem untuk ingat. Sebut harga, fasa bayaran, waranti — tanpa sistem anda menjugel mental dan scroll WhatsApp. Pelan Solo RM 180/bulan adalah kombo paling ringkas untuk bos seorang. Naik taraf ke Pro bila berkembang.',
      '我现有的客户资料和过去的估价单怎么办？': 'Bagaimana dengan data pelanggan dan sebut harga lama saya?',
      '我们的服务包含数据搬迁。您给我们现有的 Excel、PDF 报价、或纸本资料，我们帮您整理 + 输入系统。包括把您常用的品项库（水电、瓷砖、五金、木工的常用价格）建好。不用您花时间。':
        'Perkhidmatan kami termasuk pemindahan data. Beri kami Excel, sebut harga PDF, atau rekod kertas — kami susun dan import untuk anda. Termasuk bina pustaka item anda (elektrik, jubin, perkakas, kayu — harga biasa). Tiada masa anda terbuang.',
      '每个项目都不一样，估价单可以自定义吗？': 'Setiap projek lain — boleh sesuaikan sebut harga?',
      '可以。Setup 阶段我们会跟您一起建您专属的品项库（您常用的水电、油漆、瓷砖、木工等），之后估价就是拉品项、改数量。模板和栏位都可以按您的习惯调整。这是 RenoFlow 跟通用 SaaS 最大的差别。':
        'Boleh. Semasa setup kami bina pustaka item tersuai anda (elektrik, cat, jubin, kayu biasa), kemudian sebut harga hanya tarik + ubah kuantiti. Templat dan medan diselaraskan dengan tabiat anda. Inilah perbezaan terbesar RenoFlow dari SaaS generik.',
      '外包工不会用 app 怎么办？': 'Bagaimana jika subkontraktor tak boleh guna app?',
      '工时记录只是手机浏览器打开链接、点几下就完成，不用注册不用下 app。如果实在不愿意填，您也可以让他们继续 WhatsApp 报工时，您自己进系统补登 — 算钱仍然自动化。':
        'Log jam kerja hanya buka pautan di pelayar mudah alih — tiada daftar, tiada pemasangan app. Jika benar-benar enggan, mereka boleh terus lapor melalui WhatsApp dan anda isi dalam sistem — gaji kekal automatik.',
      'Supplier 不肯用系统怎么办？': 'Bagaimana jika pembekal tak mahu guna sistem?',
      'Supplier 端零门槛。您发估价请求时系统会自动发一条 WhatsApp 链接给 supplier，他在手机浏览器里输入价格就好，不用注册不用 app。这是设计上的核心考虑 — 您能让 supplier 配合的方式，他们才会用。':
        'Zero friksi di pihak pembekal. Bila anda hantar permintaan sebut harga, sistem auto-hantar pautan WhatsApp — mereka masukkan harga dalam pelayar mudah alih. Tiada daftar, tiada app. Direka berdasarkan apa yang pembekal sebenarnya bersetuju guna.',
      '保修期管理具体怎么运作？': 'Bagaimana pengurusan waranti berfungsi?',
      '签约时您设保修期（例如水电 1 年、瓷砖 6 个月）。系统会在到期前 30 天提醒您，您可以主动联系客户做一次回访。客户感觉好，下次装修或推荐朋友的概率自然高。这就是 1-3 人小队最难做、但最能留客的事。':
        'Semasa kontrak anda tetapkan waranti (cth elektrik 1thn, jubin 6bln). Sistem peringatkan anda 30 hari sebelum tamat supaya anda boleh hubungi pelanggan secara proaktif. Pelanggan rasa diutamakan — peluang renovasi semula atau rujukan jauh lebih tinggi. Perkara paling sukar tapi paling berkesan untuk pasukan 1-3 orang.',
      '可以试用一段时间再决定吗？': 'Boleh saya cuba dahulu sebelum buat keputusan?',
      'Pro 方案提供首月免费试用 — Setup 完成后您有 30 天评估。不满意可全额退还 Setup 费用，您只损失搬数据的时间，没有现金损失。':
        'Pelan Pro tawarkan percubaan bulan pertama percuma — 30 hari menilai selepas setup. Tak puas hati? Bayaran setup dipulangkan penuh. Anda hanya rugi masa pemindahan data, tiada kerugian wang.',
      '你们公司在 JB 哪里？出事可以找你们吗？': 'Anda di mana di JB? Boleh saya cari jika ada masalah?',
      '我们就在 Johor Bahru。WhatsApp 即时回复、必要时上门。这是我们和国外 SaaS 最大的差别。':
        'Kami betul-betul di Johor Bahru. Balasan WhatsApp segera, datang ke premis bila perlu. Inilah perbezaan terbesar kami berbanding SaaS luar negara.',

      // CTA + footer
      '下一步': 'Langkah seterusnya',
      '免费咨询 · 不绑约 · 现场或线上 demo 任您选': 'Perundingan percuma · tiada kontrak · demo di tapak atau dalam talian',
      'WhatsApp 我们': 'WhatsApp kami',
      '先看 demo': 'Lihat demo dahulu',
      '为 1-3 人小型装修团队量身打造的工具。让装修老板从估价表和 WhatsApp 解脱出来。':
        'Dibina untuk pasukan renovasi 1-3 orang. Membebaskan bos renovasi dari hamparan dan WhatsApp.',
      '产品': 'Produk',
      '核心功能': 'Ciri teras',
      '定价方案': 'Harga',
      '客户案例': 'Kes pelanggan',
      '联络': 'Hubungi',

      // Demo banner / industry bar
      '预约 Demo →': 'Tempah Demo →',
      '行业演示：': 'Demo industri:',
      '🏠 装修公司 (老板视角)': '🏠 Syarikat renovasi (Pandangan bos)',
      'Demo · 数据为演示用': 'Demo · data contoh sahaja',

      // Demo sidebar
      '老板后台': 'Backend bos',
      '日常': 'Harian',
      '仪表盘': 'Papan pemuka',
      '采购': 'Perolehan',
      '财务': 'Kewangan',
      '运营': 'Operasi',
      '工时记录': 'Jam kerja',
      'Supplier 比价': 'Perbandingan pembekal',

      // Demo dashboard
      '早安，陈老板 👋': 'Selamat pagi, Bos Chen 👋',
      '这是今天的陈氏装修概况 · 2026/05/24': 'Tinjauan hari ini · 2026/05/24',
      '本月报表': 'Laporan bulanan',
      '+ 新建项目': '+ Projek baru',
      '⚠ 3 笔到期': '⚠ 3 tertunggak',
      '↑ 12% vs 估价': '↑ 12% vs anggaran',
      '查看全部 →': 'Lihat semua →',
      '项目': 'Projek',
      '类型': 'Jenis',
      '说明': 'Penerangan',
      '状态': 'Status',
      '估价单': 'Sebut harga',
      '今日截止，待发给客户确认': 'Tamat hari ini, perlu hantar kepada klien',
      '3 家 supplier 回价已齐，最低 RM 32/m²': '3 pembekal sudah balas, terendah RM 32/m²',
      '进度款': 'Bayaran',
      '中期款 RM 8,500 到期 3 天': 'Bayaran tengah RM 8,500 tamat 3 hari',
      '保修期': 'Waranti',
      '水电保修期 25 天后到期，建议回访': 'Waranti elektrik tamat 25 hari, cadang lawatan',
      '工时': 'Jam',
      '李师傅 + 黄师傅 本周工时待确认': 'Jam kerja pekerja minggu ini menunggu pengesahan',
      '紧急': 'Penting',
      '待收': 'Menunggu',
      '提醒': 'Peringatan',
      '待审': 'Belum disemak',

      // Projects board
      '所有进行中项目，按阶段排列。延误自动标红': 'Semua projek aktif mengikut fasa. Lewat ditandakan auto.',
      '筛选': 'Tapis',
      '📝 估价中': '📝 Sebut harga',
      '📋 采购中': '📋 Perolehan',
      '🔨 施工中': '🔨 Pembinaan',
      '✅ 验收中': '✅ Serah-terima',
      '今日截止': 'Tamat hari ini',
      '3 天内': 'Dalam 3 hari',
      '瓷砖待到': 'Jubin masuk',
      '如期': 'Ikut jadual',
      '延误 2 天': 'Lewat 2 hari',
      '本周': 'Minggu ini',
      '完工待验': 'Siap, tunggu serah-terima',
      '已签约': 'Dimeterai',
      '进度 60%': 'Kemajuan 60%',
      '进度 40%': 'Kemajuan 40%',

      // Quote builder
      '估价单生成 · 林先生客厅翻新': 'Penjana sebut harga · Ruang tamu En. Lim',
      '从品项库拉选 + 改数量 + 一键导出 PDF': 'Tarik dari pustaka item + ubah kuantiti + 1-klik PDF',
      '预览 PDF': 'Pratonton PDF',
      '+ 加品项': '+ Tambah item',
      '客户资料': 'Maklumat pelanggan',
      '客户姓名': 'Nama pelanggan',
      '项目地址': 'Alamat projek',
      '面积': 'Keluasan',
      '项目品项（从您的装修品项库拉选）': 'Item projek (dari pustaka renovasi anda)',
      '品项': 'Item',
      '单位': 'Unit',
      '数量': 'Kuantiti',
      '单价 (RM)': 'Harga unit (RM)',
      '小计 (RM)': 'Subjumlah (RM)',
      '水电改造': 'Wayar elektrik',
      '新加 4 个 socket + 灯位重新走线': 'Tambah 4 soket + pemasangan lampu',
      '套': 'set',
      '墙身油漆': 'Cat dinding',
      'Nippon 立邦 全亚光 5 升': 'Nippon mati 5L',
      '瓷砖铺设（包工包料）': 'Pemasangan jubin (kerja + bahan)',
      '600×600 抛光砖 含勾缝': 'Jubin gilap 600×600 termasuk grouting',
      '石膏天花板': 'Siling plaster',
      '含间接灯槽设计': 'Termasuk reka cove light',
      '木工 - 电视墙 + 收纳柜': 'Kerja kayu — dinding TV + storan',
      '实木皮包面 + 暗藏灯条': 'Lapisan veneer + jalur lampu tersembunyi',
      '小计 + 6% SST': 'Subjumlah + 6% SST',
      '已自动加 6% SST': 'Auto-tambah 6% SST',
      '客厅 800 sqft': 'Ruang tamu 800 sqft',

      // Supplier
      'Supplier 报价对比 · 黄太太厨房瓷砖': 'Perbandingan pembekal · Jubin dapur Pn. Wong',
      '三家 supplier 回价并排显示，最低自动标 ⭐': 'Tiga pembekal sebelah-menyebelah — terendah auto ⭐',
      '+ 加一家 supplier': '+ Tambah pembekal',
      '采用 Supplier B → 生成 PO': 'Guna Pembekal B → Jana PO',
      '600×600 抛光砖（每 m²）': 'Jubin gilap 600×600 (per m²)',
      '瓷砖胶 25kg': 'Gam jubin 25kg',
      '勾缝剂 5kg': 'Grout 5kg',
      '送货费': 'Caj penghantaran',
      '免费 (>RM 500)': 'Percuma (>RM 500)',
      '总计（含送货）': 'Jumlah (termasuk penghantaran)',
      '通用瓷砖': 'Pembekal Jubin Umum',

      // PO
      '本月所有 PO，按状态追踪': 'Semua PO bulan ini, dijejaki ikut status',
      '已完成': 'Selesai',
      '+ 新建 PO': '+ PO Baru',
      '本月 PO 数': 'PO bulan ini',
      '待到货': 'Belum tiba',
      '已到未付': 'Tiba, belum bayar',
      '本月总采购': 'Jumlah perolehan',
      '运送中 · 预计 5/26 到': 'Dalam penghantaran · ETA 5/26',
      '已到未付 · 3 天': 'Tiba, belum bayar · 3 hari',
      '已到 已付': 'Tiba, sudah bayar',

      // Payment
      '每个项目订金/中期/尾款分期追踪 · 到期自动 WhatsApp 提醒客户':
        'Per projek: deposit / tengah / akhir dijejaki · auto-peringatan WhatsApp',
      '手动发提醒': 'Hantar peringatan',
      '本月已收': 'Diterima bulan ini',
      '应收待收': 'Belum diterima',
      '逾期未收': 'Tertunggak',
      '合约总额': 'Jumlah kontrak',
      '↑ vs 上月': '↑ vs bulan lepas',
      '3 笔到期': '3 tertunggak',
      '1 笔逾期 12 天': '1 tertunggak 12 hari',
      '6 个进行中项目': '6 projek aktif',
      '应收款（按到期日排序）': 'Belum diterima (ikut tarikh tamat)',
      '项目 / 客户': 'Projek / Pelanggan',
      '期别': 'Fasa',
      '金额': 'Jumlah',
      '应收日': 'Tarikh tamat',
      '操作': 'Tindakan',
      '合约 RM 35K': 'Kontrak RM 35K',
      '合约 RM 42K': 'Kontrak RM 42K',
      '合约 RM 24K': 'Kontrak RM 24K',
      '合约 RM 12K': 'Kontrak RM 12K',
      '中期款 (40%)': 'Tengah (40%)',
      '中期款 (50%)': 'Tengah (50%)',
      '订金 (30%)': 'Deposit (30%)',
      '尾款 (20%)': 'Akhir (20%)',
      '逾期 12 天': 'Tertunggak 12 hari',
      '3 天到期': 'Tamat 3 hari',
      '验收后': 'Selepas serah-terima',
      '发催款': 'Hantar peringatan',
      '自动已排': 'Auto-dijadual',

      // Cost
      '项目成本核算 · 泰丰花园翻新': 'Kos projek · Renovasi Tai Hong Garden',
      '估价 vs 实际成本，每个品类分别对比': 'Anggaran vs sebenar, per kategori',
      '导出 Excel': 'Eksport Excel',
      '+ 加成本项': '+ Tambah kos',
      '合约金额': 'Jumlah kontrak',
      '估算总成本': 'Anggaran jumlah kos',
      '实际成本（至今）': 'Kos sebenar (setakat ini)',
      '预计最终毛利': 'Untung akhir dijangka',
      '毛利 32%': 'Untung 32%',
      '已完成 65%': 'Siap 65%',
      '分品类成本对比（估 vs 实）': 'Kos ikut kategori (anggaran vs sebenar)',
      '水电料': 'Bahan elektrik',
      '瓷砖 + 工': 'Jubin + kerja',
      '油漆 + 工': 'Cat + kerja',
      '木工': 'Kerja kayu',
      '外包工时': 'Jam subkontraktor',
      '其他杂支': 'Lain-lain',
      '(未完)': '(belum siap)',
      '(未发生)': '(belum berlaku)',

      // Hours
      '工人/外包工时记录': 'Jam pekerja / sub',
      '工人手机记工时 · 月底自动算钱': 'Pekerja log di telefon · gaji auto hujung bulan',
      '发送本月报表': 'Hantar laporan bulan ini',
      '+ 加工人': '+ Tambah pekerja',
      '本月总工时': 'Jumlah jam bulan ini',
      '5 位外包工': '5 subkontraktor',
      '本月应付工钱': 'Gaji perlu bayar',
      '待审核工时': 'Jam menunggu semakan',
      '2 人待确认': '2 menunggu pengesahan',
      '本周高峰日': 'Hari puncak',
      '周三': 'Rabu',
      '本月工时明细（按工人）': 'Pecahan jam bulan ini (ikut pekerja)',
      '工人': 'Pekerja',
      '工种': 'Trade',
      '本月工时': 'Jam bulan ini',
      '时薪 (RM)': 'Kadar (RM/jam)',
      '项目分配': 'Projek',
      '应付 (RM)': 'Perlu bayar (RM)',
      '水电': 'Elektrik',
      '瓷砖': 'Jubin',
      '油漆': 'Cat',
      '泥水': 'Konkrit',
      '已确认': 'Disahkan',
      '22h 待审': '22j menunggu',
      '20h 待审': '20j menunggu',

      // Warranty
      '每个项目按品类设保修期 · 到期前 30 天自动提醒您主动回访':
        'Waranti per-kategori · auto-peringatan 30 hari sebelum tamat untuk hubungi proaktif',
      '历史保修记录': 'Sejarah waranti',
      '+ 加项目保修': '+ Tambah waranti',
      '本月到期': 'Tamat bulan ini',
      '下月到期': 'Tamat bulan depan',
      '本月主动回访': 'Lawatan proaktif',
      '建议回访': 'Cadang lawatan',
      '1 个推荐了朋友': '1 rujuk kawan',
      '⚠️ 即将到期（30 天内）': '⚠️ Hampir tamat (30 hari)',
      '保修中项目': 'Projek dalam waranti',
      '到期': 'Tamat',
      '剩余': 'Baki',
      '主动回访': 'Lawatan proaktif',
      '查看': 'Lihat',
      '25 天': '25 hari',
      '49 天': '49 hari',
      '285 天': '285 hari',
      '151 天': '151 hari',

      // Demo footer
      '想知道您的装修队可以怎样使用 RenoFlow？': 'Ingin tahu bagaimana pasukan anda boleh guna RenoFlow?',
      '我们提供一对一咨询 · 现场 demo · 免费试用 30 天': 'Perundingan satu-satu · demo di tapak · percubaan 30 hari',

      // Info-box keys
      'info-dashboard':
        '💡 <strong>Mengapa ini penting:</strong> Bos renovasi tangani banyak perkara — sebut harga, kejar bayaran, bahan, lawatan tapak. Papan pemuka utamakan apa yang mesti dibuat hari ini supaya anda tahu apa nak buat dahulu.',
      'info-projects':
        '💡 <strong>Mengapa ini penting:</strong> Pasukan 1-3 orang mudah jadi kucar-kacir bila beberapa projek berjalan serentak. Papan ini tunjuk fasa setiap projek sekilas. Projek lewat ditanda merah auto — anda terus tahu mana yang perlu diselamatkan.',
      'info-quote':
        '💡 <strong>Mengapa ini penting:</strong> Sebut harga dulu ambil 2-3 jam, item terlepas tepu duit. Sekarang: tarik dari pustaka + ubah kuantiti — siap 30 minit. Pelanggan sama mahu versi baru? Salin; yang lama diarkib. Pelanggan tanya "kenapa mahal?" — tunjuk pecahan item.',
      'info-supplier':
        '💡 <strong>Mengapa ini penting:</strong> Dulu banding harga maksudnya korek tangkap layar WhatsApp. Sekarang: hantar item sama kepada 3 pembekal, balasan sebelah-menyebelah, terendah ditanda auto ⭐, 1-klik → PO. <strong>Deal ini jimat RM 820 dengan pilih Pembekal B</strong> — puluhan ribu sepanjang tahun.',
      'info-po':
        '💡 <strong>Mengapa ini penting:</strong> Semua perolehan mengikut PO — pembekal ada rekod, anda ada rekod, pelanggan ada bukti. "Apa sudah sampai? Apa belum bayar?" — jelas sekilas. Anda takkan terlupa bayar pembekal (rosakkan hubungan, harga akan datang naik).',
      'info-payment-warn':
        '⚠️ <strong>Bayaran tengah En. Chen tertunggak 12 hari.</strong> Sistem auto-hantar peringatan WhatsApp pada 5/13, 5/15, 5/19. Cadang panggilan peribadi hari ini.',
      'info-cost-warn':
        '⚠️ <strong>Cat melebihi belanjawan 5% (RM 150).</strong> Mungkin terlupa lapisan pelapis kedua dalam anggaran asal. Cadangan: lain kali, anggar cat dengan 2 pelapis + 2 lapisan akhir secara lalai.',
      'info-cost':
        '💡 <strong>Mengapa ini penting:</strong> Perkara paling mudah dilupakan pasukan 1-3 orang — berapa untung sebenar setiap projek. Anggaran vs Sebenar auto → nampak kategori mana selalu lebih → laraskan anggaran masa depan. Margin boleh naik dari 20% ke 30% setahun.',
      'info-hours':
        '💡 <strong>Mengapa ini penting:</strong> Subkontraktor tak perlu app — buka pautan mudah alih, tap beberapa kali. Hujung bulan anda eksport laporan satu klik, jam × kadar auto-kira. Tiada lagi pergaduhan tentang silap kira — hubungan baik, panggilan akan datang lebih mudah.',
      'info-warranty':
        '💡 <strong>Mengapa ini penting:</strong> Perkara paling sukar tapi paling berkesan untuk pasukan 1-3 orang — susulan proaktif. Sistem ingatkan anda 30 hari sebelum waranti tamat → anda hubungi atau lawat → pelanggan rasa diutamakan → peluang renovasi semula atau rujukan jauh lebih tinggi.',
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Switcher UI: injected once into <body> on init.
  // ─────────────────────────────────────────────────────────────────────────
  const CSS = `
.renoflow-lang-switch {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 10000;
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.94);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 58, 46, 0.12);
  border-radius: 100px;
  padding: 3px;
  box-shadow: 0 2px 10px rgba(45, 58, 46, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif;
}
.renoflow-lang-switch button {
  appearance: none;
  -webkit-appearance: none;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 100px;
  background: transparent;
  color: #6b7568;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  line-height: 1;
}
.renoflow-lang-switch button.active {
  background: #2d3a2e;
  color: #faf7f2;
}
.renoflow-lang-switch button:not(.active):hover {
  color: #2d3a2e;
  background: rgba(45, 58, 46, 0.06);
}
@media (max-width: 480px) {
  .renoflow-lang-switch { top: 8px; right: 8px; padding: 2px; }
  .renoflow-lang-switch button { padding: 4px 9px; font-size: 11px; }
}
`;

  function injectSwitcher() {
    if (document.querySelector('.renoflow-lang-switch')) return;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'renoflow-lang-switch';
    wrap.setAttribute('data-no-i18n', '');
    wrap.innerHTML =
      '<button data-lang="zh">中</button>' +
      '<button data-lang="en">EN</button>' +
      '<button data-lang="ms">MS</button>';
    document.body.appendChild(wrap);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Text-node snapshot + substitution.
  // ─────────────────────────────────────────────────────────────────────────
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE']);
  const nodeMap = new Map(); // text node → original textContent
  const elMap = new Map(); // [data-i18n] element → original innerHTML

  function shouldSkip(parent) {
    if (!parent) return true;
    if (SKIP_TAGS.has(parent.tagName)) return true;
    if (parent.closest('[data-no-i18n]')) return true;
    // Skip text nodes inside elements that have their own data-i18n key.
    if (parent.closest('[data-i18n]')) return true;
    return false;
  }

  function walkText(cb) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(n.parentElement)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = walker.nextNode())) cb(n);
  }

  function snapshot() {
    walkText((n) => {
      if (!nodeMap.has(n)) nodeMap.set(n, n.textContent);
    });
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!elMap.has(el)) elMap.set(el, el.innerHTML);
    });
  }

  function apply(lang) {
    const dict = DICT[lang] || {};
    // [data-i18n] elements first
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const orig = elMap.get(el);
      if (lang === 'zh') {
        el.innerHTML = orig;
      } else if (dict[key] != null) {
        el.innerHTML = dict[key];
      } else {
        el.innerHTML = orig;
      }
    });
    // Text nodes
    nodeMap.forEach((origText, node) => {
      if (!node.isConnected) return;
      if (lang === 'zh') {
        node.textContent = origText;
        return;
      }
      const trimmed = origText.trim();
      if (dict[trimmed] != null) {
        // Preserve surrounding whitespace.
        node.textContent = origText.replace(trimmed, dict[trimmed]);
      } else {
        node.textContent = origText;
      }
    });
    // <html lang>
    document.documentElement.lang = HTML_LANG[lang] || 'zh-CN';
    // Active button state
    document.querySelectorAll('.renoflow-lang-switch button').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore quota / private-mode errors */
    }
  }

  function getInitialLang() {
    let saved = 'zh';
    try {
      saved = localStorage.getItem(STORAGE_KEY) || 'zh';
    } catch (e) {
      /* ignore */
    }
    if (!SUPPORTED.includes(saved)) saved = 'zh';
    return saved;
  }

  function init() {
    injectSwitcher();
    snapshot();
    const lang = getInitialLang();
    apply(lang);
    document.querySelectorAll('.renoflow-lang-switch button').forEach((btn) => {
      btn.addEventListener('click', () => apply(btn.dataset.lang));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
