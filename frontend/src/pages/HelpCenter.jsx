import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ChevronDown, HelpCircle, Zap, Code2, BarChart3, Users, Shield, Key, Building2, FolderKanban, Mail, ArrowRight, Check, Minus, Compass, Sparkles,
  UserPlus, UserCircle, Rocket, BadgeCheck, Database, Brain, ShieldCheck, LayoutDashboard, Activity, Eye, Target, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import CodeBlock, { buildPrompt } from "../components/ui/CodeBlock";
import TiltCard from "../components/ui/TiltCard";
import { Reveal } from "../components/ui/motion";
import { SDK_PLATFORMS, getSdkGuide, getMinimalHtmlSnippet } from "../lib/sdkGuides";
import { SUPPORT_EMAIL } from "../lib/runtimeConfig";
import { ABOUT, TAGLINE, ROLES, WORKSPACE_ROLES, WORKFLOW, INVITE_FLOW, PIPELINE, EVENT_EXAMPLE, LAYERS, ML, USE_CASES } from "../data/knowledge";

const C = { green: "#2bb89a", cyan: "#f67963", purple: "#3b2fa8", pink: "#e5604a", amber: "#f5a25d" };

const FAQS = [
  {
    section: "Getting Started",
    icon: Zap,
    color: C.green,
    items: [
      {
        q: "What is InsightFlow?",
        a: "InsightFlow is an analytics SaaS platform that tracks user behavior on websites and apps in real time. You create a project, copy the tracking credentials, install the SDK snippet, and start seeing events, DAU, retention, and AI insights.",
      },
      {
        q: "How do I create my first project?",
        a: "Sign up as an Organizer, complete verification, create a workspace, then create a project inside it. InsightFlow immediately gives you the API key, project id, SDK setup guide, and verify step.",
      },
      {
        q: "What roles are available?",
        a: "USER can join workspaces and view assigned analytics. ORGANIZER manages workspaces, projects, and SDK setup. SUPER_ADMIN controls the whole platform, including users, approvals, and system operations.",
      },
    ],
  },
  {
    section: "SDK Integration",
    icon: Code2,
    color: C.cyan,
    items: [
      {
        q: "How do I install the InsightFlow SDK?",
        a: "Open Projects, click SDK Setup, then choose either the paste-ready snippet guides or the installable npm package SDK. The guide tells you the exact file and paste location for HTML, React, Next.js, Vue, Angular, MERN, WordPress, React Native, and Flutter.",
      },
      {
        q: "What is the ingest endpoint?",
        a: "All events are sent to POST /api/ingest/event. The SDK snippet handles this automatically using the x-api-key header, projectId, eventName, and anonymousId or userId.",
      },
      {
        q: "My API key was shown once and I missed it. What do I do?",
        a: "For security, the raw API key is only shown once when the project is created. If you lose it, create a new project or implement API-key rotation later. Existing projects will still show the endpoint and project id, but not the raw key.",
      },
      {
        q: "Do I need to update the endpoint when I deploy?",
        a: "Yes. During local development the SDK points to your current backend URL. In production you should update the backend base URL so the snippet sends events to your deployed API.",
      },
    ],
  },
  {
    section: "Analytics",
    icon: BarChart3,
    color: C.purple,
    items: [
      {
        q: "Why is my Analytics page locked?",
        a: "Analytics unlock after SDK verification. Paste the snippet, refresh your website or app once so page_view is sent, then use Verify SDK inside InsightFlow. After the first event is received, the project becomes verified.",
      },
      {
        q: "What data does InsightFlow calculate?",
        a: "InsightFlow calculates overview metrics, DAU, MAU, retention, page analytics, event trends, click/scroll readiness, session journeys, and exam analytics when relevant events are present.",
      },
      {
        q: "How do I identify logged-in users?",
        a: "Call identify('user_id') after login or signup. Before that, InsightFlow tracks visitors with a stable anonymous id so user journeys still work even without authentication.",
      },
    ],
  },
  {
    section: "Workspaces & Teams",
    icon: Users,
    color: C.amber,
    items: [
      {
        q: "How do I invite team members?",
        a: "Go to Workspaces, open a workspace, add a teammate by email, and assign the role you want. Members can then access the workspaces and projects they are part of.",
      },
      {
        q: "Can invited users see analytics?",
        a: "Yes. If they are active members of the workspace, they can open the project analytics pages according to their assigned role and permissions.",
      },
    ],
  },
  {
    section: "Security",
    icon: Shield,
    color: C.pink,
    items: [
      {
        q: "Is the API key stored securely?",
        a: "Yes. The raw key is not stored in plain text. InsightFlow stores a hash and validates incoming tracking requests against that hash on the backend.",
      },
      {
        q: "How is project access controlled?",
        a: "Protected dashboard routes require login, and project analytics APIs verify that the current user actually belongs to the workspace or is a super admin before returning data.",
      },
    ],
  },
];



const EXTRA_FAQS = [
  { section: "Roles", icon: UserCircle, color: C.cyan, items: [
    { q: "Which role should I register as, User or Organizer?", a: "Choose Personal (User) if you want individual access or you were invited by a company to view its analytics. Choose Team / Org (Organizer) if you are a company that wants to add workspaces and projects and track its own website or app." },
    { q: "What can an Organizer do that a User cannot?", a: "Organizers create workspaces and projects, generate API keys, use the SDK guide, verify the SDK, invite members and manage the full analytics. Users join workspaces they are invited to and view the analytics assigned to them." },
    { q: "Who is the Super Admin?", a: "Super Admin is the platform team's role. It manages users, organizations, verifications and approvals, workspaces, projects and settings. It cannot be chosen at public signup." },
  ] },
  { section: "Team Invitations", icon: UserPlus, color: C.purple, items: [
    { q: "How does inviting a teammate work?", a: "Open the workspace and add the member's email. InsightFlow checks whether an account exists for that email. If it doesn't, the person must create an account first. Then a collaboration invitation email is sent. Once they accept, the role you assigned (for example Viewer or Admin) takes effect." },
    { q: "Which roles can I give?", a: "Company users can be Owner/Admin, Team Member or Viewer. Viewers can see analytics, while Admins can also manage projects and members. Website visitors never need an account, they are tracked anonymously." },
  ] },
  { section: "Data & Predictions", icon: Database, color: C.green, items: [
    { q: "How is my event data stored?", a: "Events are saved in MongoDB as semi-structured documents. Fixed fields such as eventName, projectId, sessionId, anonymousId, userId and ts are always present, while a flexible properties object holds context like page and device." },
    { q: "What do the AI and ML layers do?", a: "The analytics engine turns raw events into metrics like page views, DAU and MAU. The AI layer explains those metrics in plain language. The ML layer predicts visitor retention (will a visitor return within 7 days?) using models such as XGBoost, Random Forest and Logistic Regression, so numbers come from ML while AI explains them." },
    { q: "Which websites can I track?", a: "Any site or app where you can add the InsightFlow script: coaching and exam platforms, college portals, e-commerce, HR portals and startup sites. Third-party sites like YouTube or Instagram cannot be tracked because you do not control their code." },
  ] },
];



const SECTIONS = [
  { id: "overview", label: "Overview", icon: Compass }, { id: "roles", label: "Roles", icon: UserCircle }, { id: "workflow", label: "Workflow", icon: Rocket },
  { id: "sdk", label: "SDK setup", icon: Code2 }, { id: "team", label: "Team invites", icon: UserPlus }, { id: "data", label: "Data, AI & ML", icon: Brain },
  { id: "faq", label: "FAQ", icon: HelpCircle }, { id: "contact", label: "Contact", icon: Mail },
];
const WF_ICONS = [UserPlus, Building2, FolderKanban, Key, Code2, BadgeCheck, LayoutDashboard, Users];
const ENDPOINT = "https://your-backend.onrender.com";
const ROLE_ICON = { USER: UserCircle, ORGANIZER: Building2, SUPER_ADMIN: ShieldCheck };

const Head = ({ eyebrow, title, sub }) => (
  <Reveal className="max-w-2xl">
    <span className="eyebrow">{eyebrow}</span>
    <h2 className="mt-3 text-[32px] font-extrabold leading-[1.1] text-ink sm:text-[44px]">{title}</h2>
    {sub && <p className="mt-4 text-[16px] leading-relaxed text-muted">{sub}</p>}
  </Reveal>
);

const FaqItem = ({ item, color }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border bg-white transition-all duration-300 ${open ? "border-coral/40 shadow-[0_18px_40px_-24px_rgba(246,121,99,.6)]" : "border-line hover:border-slate-300"}`}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <span className="flex-1 text-[15px] font-bold text-ink">{item.q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-coral" : "text-slate-400"}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="ml-5 border-l-[3px] px-4 pb-5 text-[14.5px] leading-7 text-muted" style={{ borderColor: color }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoleCard = ({ r, i, active }) => {
  const Icon = ROLE_ICON[r.id];
  return (
    <TiltCard initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} max={4}
      className={`flex flex-col overflow-hidden rounded-[28px] border bg-white p-7 transition-all duration-500 ${active ? "border-transparent shadow-[0_30px_70px_-26px_rgba(246,121,99,.7)] ring-2 ring-coral" : "border-line shadow-[0_16px_44px_-24px_rgba(22,19,46,.25)]"}`}>
      <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: r.color }} />
      <div className="flex items-center justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `${r.color}1a`, color: r.color }}><Icon className="h-7 w-7" /></span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">Signup: {r.signup}</span>
      </div>
      <h3 className="mt-5 text-[24px] font-extrabold text-ink">{r.label}</h3>
      <p className="text-[13px] font-semibold" style={{ color: r.color }}>{r.short}</p>
      <p className="mt-3 text-[14.5px] leading-7 text-muted">{r.forWho}</p>
      <p className="mt-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">Can do</p>
      <ul className="mt-2 space-y-2">{r.can.map((c) => <li key={c} className="flex gap-2.5 text-[13.5px] leading-6 text-ink-2"><Check className="mt-1 h-4 w-4 shrink-0" style={{ color: "#2bb89a" }} />{c}</li>)}</ul>
      {r.cannot.length > 0 && <>
        <p className="mt-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">Not for</p>
        <ul className="mt-2 space-y-2">{r.cannot.map((c) => <li key={c} className="flex gap-2.5 text-[13.5px] leading-6 text-muted"><Minus className="mt-1 h-4 w-4 shrink-0 text-slate-300" />{c}</li>)}</ul></>}
      {r.id === "SUPER_ADMIN"
        ? <p className="mt-auto pt-7 text-[12.5px] font-semibold text-slate-400">Not available for public registration.</p>
        : <Link to="/signup" className="mt-auto pt-7"><span className={`btn w-full ${r.id === "ORGANIZER" ? "btn-primary" : "btn-ghost"}`}>Register as {r.signup}<ArrowRight className="h-4 w-4" /></span></Link>}
    </TiltCard>
  );
};

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(null);
  const [platform, setPlatform] = useState(SDK_PLATFORMS[0]?.id || "html");
  const [tab, setTab] = useState("script");
  const [who, setWho] = useState(null);
  const [invStep, setInvStep] = useState(0);
  const [spy, setSpy] = useState("overview");
  const searchRef = useRef(null), wfRef = useRef(null);
  const all = useMemo(() => [...FAQS, ...EXTRA_FAQS], []);

  /* timeline line that draws while scrolling */
  const { scrollYProgress } = useScroll({ target: wfRef, offset: ["start 65%", "end 70%"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  /* scroll-spy for the side navigation */
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setSpy(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); el && io.observe(el); });
    return () => io.disconnect();
  }, [search]);
  useEffect(() => { const t = setInterval(() => setInvStep((v) => (v + 1) % INVITE_FLOW.length), 2200); return () => clearInterval(t); }, []);
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  /* open #hash sections (used by the chatbot links) */
  useEffect(() => { const h = window.location.hash.slice(1); if (h) setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth" }), 300); }, []);

  const label = SDK_PLATFORMS.find((p) => p.id === platform)?.label || "your";
  const code = useMemo(() => { try { return getSdkGuide({ platform, apiKey: "YOUR_API_KEY", projectId: "YOUR_PROJECT_ID", endpoint: ENDPOINT }).code; } catch { return getMinimalHtmlSnippet(ENDPOINT); } }, [platform]);
  const q = search.trim().toLowerCase();
  const filtered = q
    ? all.map((s) => ({ ...s, items: s.items.filter((i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)) })).filter((s) => s.items.length)
    : section ? all.filter((s) => s.section === section) : all;
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-white">
      <Navbar overlay />

      {/* ───────── Hero ───────── */}
      <header className="relative overflow-hidden bg-ink pb-24 pt-36 sm:pt-44">
        <span className="if-blob absolute -left-24 top-10 h-96 w-96 rounded-full bg-coral/40" />
        <span className="if-blob absolute -right-20 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#5a4fc4]/50" style={{ animationDelay: "-4s" }} />
        <span className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)" }} />
        <div className="container-x relative text-center">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-semibold text-white/80 backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-coral" />InsightFlow Help Center</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-6 max-w-4xl text-[40px] font-extrabold leading-[1.04] text-white sm:text-[64px]">
            Everything about InsightFlow, <span className="text-coral-grad">explained.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/65">Roles, workflow, SDK setup, team invitations, data, AI and ML. Search or jump straight to what you need.</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="relative mx-auto mt-9 max-w-2xl rounded-full bg-gradient-to-r from-coral via-[#f5a25d] to-[#8f86ff] p-[1.5px] shadow-[0_30px_80px_-20px_rgba(246,121,99,.55)]">
            <div className="flex items-center gap-3 rounded-full bg-[#14112e] py-2 pl-6 pr-3">
              <Search className="h-5 w-5 text-white/50" />
              <input ref={searchRef} value={search} onChange={(e) => { setSearch(e.target.value); setSection(null); }} placeholder="Search roles, API key, verify SDK, invite, ML…" aria-label="Search help" className="flex-1 bg-transparent py-3 text-[16px] font-medium text-white outline-none placeholder:text-white/40" />
              <kbd className="hidden rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[12px] text-white/50 sm:block">Ctrl K</kbd>
            </div>
          </motion.div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Which role should I pick?", "API key", "Verify SDK", "Invite team", "Retention ML"].map((t) => <button key={t} onClick={() => setSearch(t.replace("Which role should I pick?", "role"))} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-semibold text-white/70 backdrop-blur transition hover:border-coral hover:bg-coral/20 hover:text-white">{t}</button>)}
          </div>
        </div>
      </header>

      <div className="container-x grid gap-12 pb-24 pt-14 lg:grid-cols-[220px_1fr]">
        {/* ───────── Side nav ───────── */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-1">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">On this page</p>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => jump(s.id)} className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-colors ${spy === s.id ? "text-ink" : "text-muted hover:text-ink"}`}>
                {spy === s.id && <motion.span layoutId="help-spy" className="absolute inset-0 rounded-xl bg-coral-soft" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                {spy === s.id && <motion.span layoutId="help-bar" className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-coral" />}
                <s.icon className={`relative h-4 w-4 ${spy === s.id ? "text-coral" : ""}`} /><span className="relative">{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-28">
          {!q && (<>
            {/* ───────── Overview ───────── */}
            <section id="overview" className="scroll-mt-28">
              <Head eyebrow="Overview" title="What InsightFlow does" sub={TAGLINE} />
              <Reveal delay={0.1}><p className="mt-5 max-w-3xl text-[15.5px] leading-8 text-muted">{ABOUT}</p></Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[[Activity, "Track", "Real-time events from your site or app", "#3b2fa8"], [Eye, "Detect", "Journey friction and drop-off points", "#f67963"], [Target, "Predict", "Visitor retention with ML models", "#2bb89a"], [MessageSquare, "Explain", "AI turns numbers into recommendations", "#f5a25d"]].map(([I, t, d, c], i) => (
                  <TiltCard key={t} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl border border-line bg-white p-6 shadow-[0_16px_40px_-26px_rgba(22,19,46,.3)]">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${c}1a`, color: c }}><I className="h-6 w-6" /></span>
                    <h3 className="mt-4 text-[18px] font-extrabold text-ink">{t}</h3><p className="mt-1 text-[14px] leading-6 text-muted">{d}</p>
                  </TiltCard>
                ))}
              </div>
              <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-2"><span className="mr-2 text-[13px] font-bold text-ink">Built for</span>{USE_CASES.map((u) => <span key={u} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-2">{u}</span>)}</Reveal>
            </section>

            {/* ───────── Roles ───────── */}
            <section id="roles" className="scroll-mt-28">
              <Head eyebrow="Roles" title="Which role should I register as?" sub="Pick the account type that matches how you will use InsightFlow. Each role has its own dashboard and permissions." />
              <Reveal delay={0.1} className="mt-8 rounded-3xl bg-gradient-to-br from-cream to-white p-6 ring-1 ring-line">
                <p className="text-[15px] font-bold text-ink">Quick chooser: what describes you?</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[["USER", "I am an individual, or a company invited me"], ["ORGANIZER", "I am a company that wants to add projects"]].map(([id, t]) => (
                    <button key={id} onClick={() => setWho(id)} className={`rounded-2xl border px-5 py-3 text-left text-[14px] font-bold transition ${who === id ? "border-coral bg-coral text-white shadow-[0_14px_30px_-12px_#f67963]" : "border-line bg-white text-ink-2 hover:border-coral"}`}>{t}</button>
                  ))}
                </div>
                <AnimatePresence mode="wait">{who && (
                  <motion.p key={who} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-[14.5px] leading-7 text-ink-2">
                    {who === "USER" ? <>Register as <b>Personal (User)</b>. You can view the workspaces and project analytics you are invited to.</> : <>Register as <b>Team / Org (Organizer)</b>. You will create workspaces, add projects, get API keys and invite your team.</>}
                  </motion.p>)}</AnimatePresence>
              </Reveal>
              <div className="mt-8 grid gap-6 lg:grid-cols-3">{ROLES.map((r, i) => <RoleCard key={r.id} r={r} i={i} active={who === r.id} />)}</div>
              <Reveal delay={0.1} className="mt-8 rounded-3xl border border-line bg-white p-6">
                <p className="text-[15px] font-bold text-ink">Roles inside a workspace</p>
                <p className="mt-1 text-[14px] text-muted">After an Organizer invites you, one of these roles decides what you can do in that workspace.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">{WORKSPACE_ROLES.map((r) => <div key={r.name} className="rounded-2xl bg-slate-50 p-4"><p className="font-extrabold text-ink">{r.name}</p><p className="mt-1 text-[13.5px] leading-6 text-muted">{r.text}</p></div>)}</div>
              </Reveal>
            </section>

            {/* ───────── Workflow ───────── */}
            <section id="workflow" className="scroll-mt-28">
              <Head eyebrow="Workflow" title="From signup to your first insight" sub="Eight steps. Scroll to follow the line." />
              <div ref={wfRef} className="relative mt-12">
                <span className="absolute bottom-0 left-[27px] top-0 w-[3px] rounded-full bg-slate-100" />
                <motion.span style={{ scaleY: line, transformOrigin: "top" }} className="absolute bottom-0 left-[27px] top-0 w-[3px] rounded-full bg-gradient-to-b from-coral to-[#f5a25d]" />
                <div className="space-y-6">
                  {WORKFLOW.map((w, i) => { const I = WF_ICONS[i]; return (
                    <motion.div key={w.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }} className="relative flex gap-5">
                      <motion.span initial={{ scale: 0.6 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-80px" }} className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-coral shadow-[0_12px_30px_-12px_rgba(246,121,99,.7)] ring-2 ring-coral/40"><I className="h-6 w-6" /></motion.span>
                      <div className="flex-1 rounded-3xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(22,19,46,.35)]">
                        <p className="text-[11px] font-bold tracking-widest text-coral-dark">STEP 0{i + 1}</p>
                        <h3 className="mt-1 text-[18px] font-extrabold text-ink">{w.title}</h3>
                        <p className="mt-1.5 text-[14.5px] leading-7 text-muted">{w.text}</p>
                        {i === 3 && <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-coral-soft px-3 py-2 text-[13px] font-bold text-coral-dark"><Key className="h-4 w-4" />Shown one time only. Copy it now.</p>}
                      </div>
                    </motion.div>); })}
                </div>
              </div>
            </section>

            {/* ───────── SDK ───────── */}
            <section id="sdk" className="scroll-mt-28">
              <Head eyebrow="SDK setup" title="Pick your stack, copy, deploy" sub="Choose your project's language or framework. Use the ready script directly, or copy the AI prompt and let any AI assistant implement it." />
              <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
                {SDK_PLATFORMS.map((p) => <button key={p.id} onClick={() => setPlatform(p.id)} className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${platform === p.id ? "bg-ink text-white shadow-lg" : "border border-line bg-white text-ink-2 hover:border-coral hover:text-coral"}`}>{p.label}</button>)}
              </Reveal>
              <div className="mt-6 inline-flex rounded-full bg-slate-100 p-1">
                {[["script", "Ready-to-use script"], ["prompt", "AI prompt"]].map(([id, t]) => <button key={id} onClick={() => setTab(id)} className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${tab === id ? "bg-white text-ink shadow" : "text-muted"}`}>{id === "prompt" && <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-coral" />}{t}</button>)}
              </div>
              <div className="mt-4"><CodeBlock code={tab === "script" ? code : buildPrompt(label, code, ENDPOINT)} label={tab === "script" ? `${label} · tracking snippet` : `${label} · prompt for your AI assistant`} /></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[["Hashed, one-time key", "Stored only as a hash and shown once.", Key], ["Go live, then verify", "Deploy, then click Verify SDK in InsightFlow.", BadgeCheck], ["Analytics opens", "We check your key and incoming events.", Rocket]].map(([t, d, I], i) => (
                  <Reveal key={t} delay={i * 0.08}><div className="h-full rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_-26px_rgba(22,19,46,.35)]"><I className="h-5 w-5 text-coral" /><p className="mt-2 text-[14.5px] font-bold text-ink">{t}</p><p className="mt-1 text-[13.5px] leading-6 text-muted">{d}</p></div></Reveal>
                ))}
              </div>
            </section>

            {/* ───────── Team invites ───────── */}
            <section id="team" className="scroll-mt-28">
              <Head eyebrow="Team invites" title="How inviting a teammate works" sub="An Organizer adds an email. InsightFlow does the rest." />
              <div className="mt-10 grid gap-3 md:grid-cols-5">
                {INVITE_FLOW.map((s, i) => (
                  <motion.div key={s.title} animate={{ y: invStep === i ? -8 : 0, scale: invStep === i ? 1.03 : 1 }} className={`relative rounded-3xl border p-5 transition-colors duration-500 ${invStep === i ? "border-coral/50 bg-white shadow-[0_24px_50px_-24px_rgba(246,121,99,.7)]" : "border-line bg-white/60"}`}>
                    <span className={`grid h-9 w-9 place-items-center rounded-xl text-[13px] font-extrabold transition-colors duration-500 ${invStep === i ? "bg-coral text-white" : i < invStep ? "bg-mint/60 text-[#0b6b58]" : "bg-slate-100 text-slate-400"}`}>{i < invStep ? <Check className="h-4 w-4" /> : i + 1}</span>
                    <p className="mt-3 text-[14.5px] font-extrabold text-ink">{s.title}</p><p className="mt-1 text-[13px] leading-6 text-muted">{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ───────── Data, AI & ML ───────── */}
            <section id="data" className="scroll-mt-28">
              <Head eyebrow="Data, AI and ML" title="From raw events to predictions" sub="Your raw events stay as they are. Analytics, AI and ML are layers built on top." />
              <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-3">
                {PIPELINE.map((p, i) => (
                  <div key={p} className="flex items-center gap-3">
                    <span className="rounded-2xl border border-white bg-white px-4 py-2.5 text-[13.5px] font-bold text-ink shadow-[0_14px_34px_-18px_rgba(22,19,46,.4)]">{p}</span>
                    {i < PIPELINE.length - 1 && <motion.span animate={{ x: [0, 6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}><ArrowRight className="h-4 w-4 text-coral" /></motion.span>}
                  </div>
                ))}
              </Reveal>
              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                <Reveal><CodeBlock label="Event document in MongoDB (semi-structured)" code={JSON.stringify(EVENT_EXAMPLE, null, 2)} maxH="max-h-[360px]" /></Reveal>
                <div className="grid gap-3 sm:grid-cols-2">
                  {LAYERS.map((l, i) => <Reveal key={l.name} delay={i * 0.07}><div className="h-full rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_-26px_rgba(22,19,46,.35)]"><p className="text-[11px] font-bold tracking-widest text-coral-dark">LAYER 0{i + 1}</p><p className="mt-1 text-[14.5px] font-extrabold text-ink">{l.name}</p><p className="mt-1 text-[12.5px] leading-6 text-muted">{l.text}</p></div></Reveal>)}
                </div>
              </div>
              <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-9">
                <p className="text-[12px] font-bold uppercase tracking-widest text-coral">Retention prediction</p>
                <p className="mt-2 max-w-2xl text-[18px] font-semibold leading-8">{ML.objective}</p>
                <div className="mt-5 flex flex-wrap gap-2">{ML.models.map((m, i) => <span key={m.name} className={`rounded-full px-4 py-2 text-[13px] font-bold ${i === 0 ? "bg-coral text-white" : "bg-white/10 text-white/80"}`}>{m.name}<i className="ml-2 text-[11px] font-medium not-italic opacity-70">{m.role}</i></span>)}</div>
                <div className="mt-5 flex flex-wrap gap-2">{ML.metrics.map((m) => <span key={m} className="rounded-lg border border-white/15 px-3 py-1 font-mono text-[12px] text-white/70">{m}</span>)}</div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">{ML.forecasts.map((f) => <div key={f.metric} className="rounded-2xl bg-white/[0.06] p-4"><p className="text-[14px] font-extrabold">{f.metric}</p><p className="mt-1 text-[13px] leading-6 text-white/65">{f.idea}</p><p className="mt-2 font-mono text-[11.5px] text-coral">{f.model}</p></div>)}</div>
                <p className="mt-6 max-w-3xl text-[13.5px] leading-7 text-white/60">{ML.note}</p>
              </Reveal>
            </section>
          </>)}

          {/* ───────── FAQ ───────── */}
          <section id="faq" className="scroll-mt-28">
            <Head eyebrow="FAQ" title={q ? `Results for “${search}”` : "Frequently asked questions"} />
            {!q && (
              <div className="mt-8 flex flex-wrap gap-2">
                {[null, ...all.map((s) => s.section)].map((s) => <button key={s || "all"} onClick={() => setSection(s)} className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${section === s ? "bg-coral text-white shadow-[0_10px_24px_-10px_#f67963]" : "border border-line bg-white text-ink-2 hover:border-coral hover:text-coral"}`}>{s || "All"}</button>)}
              </div>
            )}
            <div className="mt-10 space-y-10">
              {filtered.length === 0 && <p className="text-muted">No results. Try another keyword, or ask Flo in the chat bubble.</p>}
              {filtered.map((s) => (
                <div key={s.section}>
                  <h3 className="mb-4 flex items-center gap-3 text-[18px] font-extrabold text-ink"><span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${s.color}1f`, color: s.color }}><s.icon className="h-4 w-4" /></span>{s.section}</h3>
                  <div className="space-y-3">{s.items.map((it) => <FaqItem key={it.q} item={it} color={s.color} />)}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ───────── Contact ───────── */}
          <section id="contact" className="scroll-mt-28">
            <Reveal className="relative overflow-hidden rounded-[32px] bg-ink px-8 py-12 text-center sm:px-16">
              <span className="if-blob absolute -right-10 -top-20 h-72 w-72 rounded-full bg-coral/40" />
              <h2 className="relative text-[30px] font-extrabold text-white sm:text-[40px]">Still need help?</h2>
              <p className="relative mx-auto mt-3 max-w-md text-white/70">Ask Flo in the chat bubble, or write to us and we will get back to you.</p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="btn btn-primary relative mt-7"><Mail className="h-4 w-4" />{SUPPORT_EMAIL}</a>
            </Reveal>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HelpCenter;
