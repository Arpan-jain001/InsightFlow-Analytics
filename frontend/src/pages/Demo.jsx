import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Bell, Brain, Building2, Code2, FolderKanban, Key, Lightbulb, LayoutDashboard,
  Pause, Play, Rocket, SkipForward, SkipBack, Sparkles, Target, TrendingUp, UserPlus, UserCircle, Users, Zap, Shield, ShieldCheck, Check, Lock } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Navbar from "../components/Navbar";
import { CountUp } from "../components/ui/motion";
import { ROLES, INVITE_FLOW, WORKSPACE_ROLES } from "../data/knowledge";
import CodeBlock, { buildPrompt } from "../components/ui/CodeBlock";
import { SDK_PLATFORMS, getSdkGuide } from "../lib/sdkGuides";

const CORAL = "#f67963", INDIGO = "#3b2fa8", MINT = "#2bb89a", AMBER = "#f5a25d", INK = "#16132e";

/* ───────── sample data ───────── */
const DAU = [84, 102, 91, 134, 118, 156, 143, 179, 162, 198, 187, 221, 209, 243].map((u, i) => ({ d: `Mar ${11 + i}`, u, s: Math.round(u * 1.5) }));
const TOP_EVENTS = [
  { name: "page_view", count: 4821, color: INDIGO }, { name: "button_click", count: 2103, color: MINT },
  { name: "add_to_cart", count: 1342, color: CORAL }, { name: "checkout", count: 856, color: AMBER }, { name: "purchase", count: 412, color: INK },
];
const FUNNEL = [{ stage: "Page View", pct: 100, users: 4821 }, { stage: "Sign Up", pct: 40, users: 1928 }, { stage: "Add to Cart", pct: 20, users: 965 }, { stage: "Checkout", pct: 10, users: 482 }, { stage: "Purchase", pct: 5, users: 241 }];
const EVENT_COLORS = { page_view: INDIGO, button_click: MINT, add_to_cart: CORAL, checkout: AMBER, purchase: INK, signup: "#7b72d4" };
const PAGES = ["/products", "/home", "/checkout", "/auth", "/pricing"];
const KPIS = [
  { label: "Organizations", to: 126, suffix: "", change: "+18%", icon: Building2, color: CORAL },
  { label: "Projects live", to: 384, suffix: "", change: "+32%", icon: FolderKanban, color: INDIGO },
  { label: "Events today", to: 9.5, suffix: "K", dec: 1, change: "+12%", icon: Activity, color: MINT },
  { label: "Alerts resolved", to: 94, suffix: "%", change: "+9%", icon: Shield, color: AMBER },
];
const WORKFLOW = [
  { icon: UserPlus, title: "Register your organization", text: "Create an account for your company." },
  { icon: Building2, title: "Create a workspace", text: "One secure, isolated workspace per team." },
  { icon: FolderKanban, title: "Add a project", text: "A project is one website or app." },
  { icon: Key, title: "Receive a hashed API key", text: "Shown once, stored only as a hash." },
  { icon: Code2, title: "Add the SDK script", text: "Pick your stack, copy the script or AI prompt." },
  { icon: BadgeCheck, title: "Go live and verify", text: "Click Verify SDK. We check key and events." },
  { icon: LayoutDashboard, title: "Open analytics and AI insights", text: "Page views, DAU, MAU and recommendations." },
  { icon: Users, title: "Invite the team", text: "Add emails, assign Viewer or Admin roles." },
];
const NOTES = [
  { icon: AlertTriangle, title: "Critical drop", text: "Biggest loss is Sign Up to Add to Cart, a 50% drop.", color: CORAL },
  { icon: BadgeCheck, title: "Strong signal", text: "Checkout to Purchase holds a healthy 50% conversion.", color: MINT },
  { icon: Lightbulb, title: "Recommended test", text: "A/B test the Add to Cart button and supporting proof points.", color: AMBER },
  { icon: Target, title: "Retention play", text: "Retarget users who signed up but never reached the cart.", color: INDIGO },
];

const SCENES = [
  { id: "overview", label: "Overview", icon: Sparkles, title: "Platform at a glance", sub: "Workspaces, projects and event volume in one view." },
  { id: "workflow", label: "How it works", icon: Rocket, title: "From signup to your first insight", sub: "The eight steps every organization follows." },
  { id: "analytics", label: "Analytics", icon: BarChart3, title: "DAU, MAU and behaviour patterns", sub: "Trends and top events from your raw event stream." },
  { id: "live", label: "Live feed", icon: Bell, title: "Watch events arrive in real time", sub: "Every click, view and purchase as it happens." },
  { id: "funnels", label: "Funnels", icon: TrendingUp, title: "See where users drop and why", sub: "Funnel analysis with AI-backed next steps." },
  { id: "sdk", label: "SDK setup", icon: Code2, title: "Ready-to-use script for your stack", sub: "Pick a framework, copy the script or an AI prompt." },
  { id: "predict", label: "Predictions", icon: Brain, title: "Predict who will come back", sub: "ML predicts retention, AI explains it." },
  { id: "roles", label: "Roles and team", icon: UserCircle, title: "Who can do what", sub: "User, Organizer and Super Admin, plus team invitations." },
];
const DURATION = 9000;

const Tip = ({ active, payload, label }) => active && payload?.length ? (
  <div className="rounded-xl border border-line bg-white/95 px-3 py-2 text-[12px] shadow-lg backdrop-blur"><p className="font-bold text-ink">{label}</p>
    {payload.map((p) => <p key={p.dataKey} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}</div>
) : null;

const Panel = ({ children, className = "" }) => <div className={`rounded-3xl border border-line bg-white p-5 ${className}`}>{children}</div>;
const Sample = () => <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Sample data</span>;

/* ───────── scenes ───────── */
const Overview = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KPIS.map((k, i) => (
        <motion.div key={k.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
          className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${k.color}1f`, color: k.color }}><k.icon className="h-5 w-5" /></span>
          <p className="mt-3 text-[26px] font-extrabold leading-none text-ink"><CountUp to={k.to} suffix={k.suffix} decimals={k.dec || 0} /></p>
          <p className="mt-1 flex items-center justify-between text-[12px] text-muted">{k.label}<span className="font-bold text-[#2bb89a]">{k.change}</span></p>
        </motion.div>
      ))}
    </div>
    <Panel>
      <div className="mb-2 flex items-center justify-between"><p className="font-bold text-ink">Daily active users</p><Sample /></div>
      <div className="h-[230px]"><ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DAU}><defs><linearGradient id="gU" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={CORAL} stopOpacity=".35" /><stop offset="1" stopColor={CORAL} stopOpacity="0" /></linearGradient></defs>
          <CartesianGrid stroke="#ececf3" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 11, fill: "#9a9ab0" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: "#9a9ab0" }} axisLine={false} tickLine={false} width={32} />
          <Tooltip content={<Tip />} /><Area dataKey="u" name="Users" stroke={CORAL} strokeWidth={2.5} fill="url(#gU)" /><Area dataKey="s" name="Sessions" stroke={INDIGO} strokeWidth={2} fill="transparent" />
        </AreaChart></ResponsiveContainer></div>
    </Panel>
  </div>
);

const Workflow = ({ tick }) => {
  const active = Math.min(WORKFLOW.length - 1, Math.floor((tick / 100) * WORKFLOW.length));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {WORKFLOW.map((w, i) => {
        const on = i === active, done = i < active;
        return (
          <motion.div key={w.title} animate={{ scale: on ? 1.02 : 1 }} className={`flex gap-4 rounded-2xl border p-4 transition-colors ${on ? "border-coral/50 bg-white shadow-[0_18px_40px_-22px_rgba(246,121,99,.7)]" : done ? "border-line bg-white" : "border-line bg-white/50"}`}>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${on ? "bg-coral text-white" : done ? "bg-mint/50 text-[#0b6b58]" : "bg-slate-100 text-slate-400"}`}>{done ? <BadgeCheck className="h-5 w-5" /> : <w.icon className="h-5 w-5" />}</span>
            <span><span className="text-[11px] font-bold tracking-widest text-coral-dark">STEP 0{i + 1}</span><span className="block font-bold text-ink">{w.title}</span><span className="block text-[13px] leading-6 text-muted">{w.text}</span></span>
          </motion.div>
        );
      })}
    </div>
  );
};

const Analytics = () => (
  <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
    <Panel>
      <div className="mb-3 flex items-center justify-between"><p className="font-bold text-ink">Top events</p><Sample /></div>
      <div className="space-y-4">
        {TOP_EVENTS.map((e, i) => (
          <div key={e.name}>
            <div className="mb-1.5 flex justify-between text-[13px]"><span className="font-mono font-semibold text-ink-2">{e.name}</span><span className="font-bold text-ink">{e.count.toLocaleString()}</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${(e.count / TOP_EVENTS[0].count) * 100}%` }} transition={{ delay: 0.15 + i * 0.1, duration: 0.8 }} className="h-full rounded-full" style={{ background: e.color }} /></div>
          </div>
        ))}
      </div>
    </Panel>
    <Panel>
      <p className="font-bold text-ink">Event mix</p>
      <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={TOP_EVENTS} dataKey="count" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={3} stroke="none">{TOP_EVENTS.map((e) => <Cell key={e.name} fill={e.color} />)}</Pie><Tooltip content={<Tip />} /></PieChart></ResponsiveContainer></div>
      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted">{TOP_EVENTS.map((e) => <span key={e.name} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: e.color }} />{e.name}</span>)}</div>
    </Panel>
  </div>
);

const Live = () => {
  const [feed, setFeed] = useState(() => Array.from({ length: 5 }, (_, i) => mk(i)));
  function mk(i) { const ev = Object.keys(EVENT_COLORS)[Math.floor(Math.random() * 6)]; return { id: Date.now() + i + Math.random(), ev, user: `${Math.random() > 0.5 ? "anon" : "user"}_${Math.random().toString(16).slice(2, 6)}`, page: PAGES[Math.floor(Math.random() * PAGES.length)] }; }
  useEffect(() => { const t = setInterval(() => setFeed((f) => [mk(0), ...f].slice(0, 7)), 1500); return () => clearInterval(t); }, []);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Panel>
        <div className="mb-3 flex items-center gap-2 font-bold text-ink"><span className="h-2 w-2 animate-pulse rounded-full bg-[#2bb89a]" />Live event stream</div>
        <div className="space-y-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {feed.map((f) => (
              <motion.div key={f.id} layout initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: EVENT_COLORS[f.ev] }} />
                <span className="w-28 font-mono text-[12.5px] font-bold text-ink">{f.ev}</span><span className="flex-1 truncate font-mono text-[12px] text-muted">{f.user}</span><span className="font-mono text-[12px] text-ink-2">{f.page}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Panel>
      <Panel className="flex flex-col justify-between">
        <div><p className="font-bold text-ink">Active right now</p><p className="mt-2 text-[44px] font-extrabold leading-none text-coral">128</p><p className="mt-1 text-[13px] text-muted">visitors on your site</p></div>
        <div className="mt-6 rounded-2xl bg-coral-soft p-4"><p className="flex items-center gap-2 text-[13px] font-bold text-coral-dark"><Bell className="h-4 w-4" />Alert</p><p className="mt-1 text-[13px] leading-6 text-ink-2">Checkout errors up 14% in the last 10 minutes.</p></div>
      </Panel>
    </div>
  );
};

const Funnels = () => (
  <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
    <Panel>
      <div className="mb-4 flex items-center justify-between"><p className="font-bold text-ink">Conversion funnel</p><Sample /></div>
      <div className="space-y-3">
        {FUNNEL.map((f, i) => (
          <div key={f.stage} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-[12.5px] font-semibold text-ink-2">{f.stage}</span>
            <div className="h-9 flex-1 overflow-hidden rounded-xl bg-slate-100"><motion.div initial={{ width: 0 }} animate={{ width: `${f.pct}%` }} transition={{ delay: i * 0.12, duration: 0.8 }} className="flex h-full items-center justify-end rounded-xl bg-gradient-to-r from-coral to-amber-brand px-3 text-[12px] font-bold text-white" style={{ minWidth: 56 }}>{f.pct}%</motion.div></div>
            <span className="w-14 text-right font-mono text-[12px] text-muted">{f.users.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Panel>
    <div className="grid gap-3">
      {NOTES.map((n, i) => (
        <motion.div key={n.title} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${n.color}1f`, color: n.color }}><n.icon className="h-4 w-4" /></span>
          <span><span className="block text-[13.5px] font-bold text-ink">{n.title}</span><span className="block text-[12.5px] leading-6 text-muted">{n.text}</span></span>
        </motion.div>
      ))}
    </div>
  </div>
);

const Sdk = () => {
  const [platform, setPlatform] = useState(SDK_PLATFORMS[0]?.id || "html");
  const [tab, setTab] = useState("script");
  const label = SDK_PLATFORMS.find((p) => p.id === platform)?.label || "your";
  const code = useMemo(() => { try { return getSdkGuide({ platform, apiKey: "YOUR_API_KEY", projectId: "YOUR_PROJECT_ID", endpoint: "https://your-backend.onrender.com" }).code; } catch { return "// Select a platform"; } }, [platform]);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {SDK_PLATFORMS.map((p) => <button key={p.id} onClick={() => setPlatform(p.id)} className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition ${platform === p.id ? "bg-ink text-white" : "border border-line bg-white text-ink-2 hover:border-coral hover:text-coral"}`}>{p.label}</button>)}
      </div>
      <div className="mb-3 inline-flex rounded-full bg-slate-100 p-1">
        {[["script", "Script"], ["prompt", "AI prompt"]].map(([id, t]) => <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-1.5 text-[12.5px] font-bold ${tab === id ? "bg-white text-ink shadow" : "text-muted"}`}>{t}</button>)}
      </div>
      <CodeBlock maxH="max-h-[300px]" label={`${label} · ${tab === "script" ? "snippet" : "prompt for your AI assistant"}`} code={tab === "script" ? code : buildPrompt(label, code)} />
      <p className="mt-3 flex items-center gap-2 text-[12.5px] text-muted"><Key className="h-4 w-4 text-coral" />Your real key appears once after you create a project, and is stored only as a hash.</p>
    </div>
  );
};

const Predict = () => {
  const P = 87, R = 52, C = 2 * Math.PI * R;
  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel className="flex flex-col items-center text-center">
        <div className="flex w-full items-center justify-between"><p className="font-bold text-ink">7-day return probability</p><Sample /></div>
        <div className="relative my-4 h-36 w-36">
          <svg viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r={R} stroke="#ececf3" strokeWidth="11" fill="none" />
            <motion.circle cx="60" cy="60" r={R} stroke="url(#pg)" strokeWidth="11" fill="none" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - P / 100) }} transition={{ duration: 1.4, ease: "easeOut" }} />
            <defs><linearGradient id="pg"><stop offset="0" stopColor={CORAL} /><stop offset="1" stopColor={AMBER} /></linearGradient></defs></svg>
          <span className="absolute inset-0 grid place-items-center text-[32px] font-extrabold text-ink">{P}%</span>
        </div>
        <p className="text-[13px] text-muted">Visitor <span className="font-mono font-bold text-ink-2">anon_a3f1</span> is likely to return.</p>
      </Panel>
      <div className="grid gap-4">
        <Panel>
          <p className="font-bold text-ink">Models compared</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[["XGBoost", "primary", true], ["Random Forest", "comparison"], ["Logistic Regression", "comparison"]].map(([n, r, p]) => <span key={n} className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold ${p ? "bg-coral text-white" : "bg-slate-100 text-ink-2"}`}>{n}<i className="ml-1.5 text-[10px] font-semibold not-italic opacity-70">{r}</i></span>)}
          </div>
          <p className="mt-3 text-[13px] leading-6 text-muted">Judged on precision, recall, F1 and ROC-AUC. The final model is chosen from experiments.</p>
          <div className="mt-3 flex flex-wrap gap-2">{["page_views_7d", "sessions_7d", "visit_frequency", "days_since_last_visit"].map((f) => <code key={f} className="rounded-lg bg-slate-100 px-2 py-1 text-[11.5px] text-ink-2">{f}</code>)}</div>
        </Panel>
        <Panel className="bg-gradient-to-br from-coral-soft to-white">
          <p className="flex items-center gap-2 text-[12px] font-bold text-coral-dark"><Sparkles className="h-4 w-4" />AI explanation</p>
          <p className="mt-2 text-[14px] leading-7 text-ink-2">Visitors who view pricing twice and return within 3 days are most likely to come back. Send a reminder to those who have not visited in 4 days.</p>
        </Panel>
      </div>
    </div>
  );
};


const RoleIcons = { USER: UserCircle, ORGANIZER: Building2, SUPER_ADMIN: ShieldCheck };
const Roles = ({ tick }) => {
  const step = Math.min(INVITE_FLOW.length - 1, Math.floor((tick / 100) * INVITE_FLOW.length));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-3">
        {ROLES.map((r, i) => { const I = RoleIcons[r.id]; return (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="relative overflow-hidden rounded-2xl border border-line bg-white p-4">
            <span className="absolute inset-x-0 top-0 h-1" style={{ background: r.color }} />
            <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${r.color}1a`, color: r.color }}><I className="h-5 w-5" /></span><code className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] text-slate-500">{r.dashboard || "restricted"}</code></div>
            <p className="mt-3 text-[16px] font-extrabold text-ink">{r.label}</p><p className="text-[12px] font-semibold" style={{ color: r.color }}>Signup: {r.signup}</p>
            <ul className="mt-2 space-y-1.5">{r.can.slice(0, 3).map((c) => <li key={c} className="flex gap-2 text-[12px] leading-5 text-muted"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2bb89a]" />{c}</li>)}</ul>
          </motion.div>); })}
      </div>
      <Panel>
        <div className="mb-3 flex items-center justify-between"><p className="font-bold text-ink">Inviting a teammate</p><span className="flex gap-1.5">{WORKSPACE_ROLES.map((w) => <span key={w.name} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-ink-2">{w.name}</span>)}</span></div>
        <div className="grid gap-2 sm:grid-cols-5">
          {INVITE_FLOW.map((s, i) => (
            <motion.div key={s.title} animate={{ y: step === i ? -5 : 0 }} className={`rounded-xl border p-3 transition-colors ${step === i ? "border-coral/50 bg-coral-soft" : i < step ? "border-line bg-mint/20" : "border-line bg-slate-50"}`}>
              <span className={`grid h-6 w-6 place-items-center rounded-lg text-[11px] font-extrabold ${step === i ? "bg-coral text-white" : i < step ? "bg-[#2bb89a] text-white" : "bg-white text-slate-400"}`}>{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>
              <p className="mt-2 text-[12.5px] font-bold text-ink">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

/* ───────── page ───────── */
const PATHS = { overview: "/organizer-dashboard", workflow: "/organizer-dashboard/projects", analytics: "/organizer-dashboard/analytics", live: "/organizer-dashboard/analytics", funnels: "/organizer-dashboard/analytics", sdk: "/organizer-dashboard/projects", predict: "/organizer-dashboard/analytics", roles: "/organizer-dashboard/members" };
const VIEWS = { overview: Overview, workflow: Workflow, analytics: Analytics, live: Live, funnels: Funnels, sdk: Sdk, predict: Predict, roles: Roles };

const Cursor = ({ x, y, k }) => (
  <motion.div className="pointer-events-none absolute left-0 top-0 z-40 hidden md:block" animate={{ x, y }} transition={{ type: "spring", stiffness: 70, damping: 15, mass: 0.9 }}>
    <motion.span key={k} initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ delay: 0.75, duration: 0.7 }} className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-coral/50" />
    <svg width="26" height="26" viewBox="0 0 24 24" className="drop-shadow-[0_6px_10px_rgba(0,0,0,.35)]"><path d="M4 2l15 9-6.5 1.6L9 19z" fill="#fff" stroke="#16132e" strokeWidth="1.6" strokeLinejoin="round" /></svg>
  </motion.div>
);

const Demo = () => {
  const [i, setI] = useState(0);
  const [prog, setProg] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [cur, setCur] = useState({ x: 60, y: 120, k: 0 });
  const winRef = useRef(null), itemRefs = useRef([]), timer = useRef(null);

  useEffect(() => { if (!playing) return; const t = setInterval(() => setProg((p) => Math.min(p + 100 / (DURATION / 60), 100)), 60); return () => clearInterval(t); }, [playing]);
  const point = (n) => {
    const w = winRef.current, b = itemRefs.current[n];
    if (!w || !b || window.innerWidth < 768) return;
    const wr = w.getBoundingClientRect(), br = b.getBoundingClientRect();
    setCur((c) => ({ x: br.left - wr.left + br.width * 0.7, y: br.top - wr.top + br.height * 0.55, k: c.k + 1 }));
  };
  const go = (n) => { clearTimeout(timer.current); const m = (n + SCENES.length) % SCENES.length; point(m); setI(m); setProg(0); };
  useEffect(() => {
    if (prog < 100) return;
    const n = (i + 1) % SCENES.length;
    point(n); setProg(0);
    timer.current = setTimeout(() => setI(n), 900);
    return () => clearTimeout(timer.current);
  }, [prog]); // eslint-disable-line
  useEffect(() => { const t = setTimeout(() => point(0), 600); return () => clearTimeout(t); }, []); // eslint-disable-line

  const S = SCENES[i], View = VIEWS[S.id];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-cream via-white to-white">
      <Navbar />
      <header className="container-x relative pb-10 pt-10 text-center">
        <span className="if-blob absolute left-1/2 top-0 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-coral/25" />
        <div className="relative mx-auto max-w-3xl">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-ink-2 shadow-sm backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-coral" />Interactive product tour</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 text-[40px] font-extrabold leading-[1.04] text-ink sm:text-[60px]">See InsightFlow <span className="text-coral-grad">in action</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted">Watch the product tour play on its own, or click any section. Everything below is sample data.</motion.p>
        </div>
      </header>

      <main className="container-x pb-20">
        <motion.div initial={{ opacity: 0, y: 50, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative"
          onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(true)}>
          <span className="absolute -inset-3 rounded-[40px] bg-gradient-to-r from-coral/40 via-[#f5a25d]/30 to-[#8f86ff]/40 blur-2xl" />
          <div ref={winRef} className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_50px_120px_-40px_rgba(22,19,46,.55)]">
            {/* browser bar */}
            <div className="flex items-center gap-3 border-b border-line bg-slate-50 px-4 py-3">
              <span className="flex gap-1.5"><i className="h-3 w-3 rounded-full bg-[#ff5f57]" /><i className="h-3 w-3 rounded-full bg-[#febc2e]" /><i className="h-3 w-3 rounded-full bg-[#28c840]" /></span>
              <span className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-white px-4 py-1.5 font-mono text-[12px] text-slate-500 ring-1 ring-line"><Lock className="h-3 w-3 text-[#2bb89a]" /><AnimatePresence mode="wait"><motion.span key={S.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{PATHS[S.id]}</motion.span></AnimatePresence></span>
              <button onClick={() => setPlaying((p) => !p)} aria-label="Play or pause" className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white">{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button>
            </div>

            <div className="grid md:grid-cols-[220px_1fr]">
              {/* sidebar */}
              <aside className="bg-ink p-4 md:min-h-[600px]">
                <div className="hidden items-center gap-2.5 px-2 pb-5 pt-1 md:flex"><img src="/logo-mark.png" alt="" className="h-7 w-auto" /><span className="text-[17px] font-extrabold text-white">Insight<span className="bg-gradient-to-r from-[#4aa8ff] to-[#b07bff] bg-clip-text text-transparent">Flow</span></span></div>
                <div className="hidden rounded-xl bg-white/[0.06] p-3 md:block"><p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Workspace</p><p className="mt-0.5 text-[13px] font-bold text-white">Acme Learning</p><p className="text-[11px] text-white/50">Organizer</p></div>
                <nav className="mt-4 flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
                  {SCENES.map((s, k) => (
                    <button key={s.id} ref={(el) => (itemRefs.current[k] = el)} onClick={() => go(k)} className={`relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-colors ${k === i ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>
                      {k === i && <motion.span layoutId="demo-active" className="absolute inset-y-2 left-0 w-1 rounded-full bg-coral" />}
                      <s.icon className={`h-4 w-4 ${k === i ? "text-coral" : ""}`} /><span className="whitespace-nowrap text-[13.5px] font-semibold">{s.label}</span>
                      {k === i && <span className="absolute bottom-0 left-0 h-[2px] bg-coral" style={{ width: `${prog}%` }} />}
                    </button>
                  ))}
                </nav>
                <div className="mt-5 hidden items-center gap-2 md:flex">
                  <button onClick={() => go(i - 1)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><SkipBack className="h-4 w-4" /></button>
                  <button onClick={() => go(i + 1)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><SkipForward className="h-4 w-4" /></button>
                  <span className="ml-auto text-[11px] font-semibold text-white/40">{i + 1} / {SCENES.length}</span>
                </div>
              </aside>

              {/* content */}
              <section className="min-w-0 bg-slate-50 p-4 sm:p-7">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-coral-dark">{S.label}</p>
                    <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-ink sm:text-[30px]">{S.title}</h2>
                    <p className="mt-1 text-[14.5px] text-muted">{S.sub}</p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-bold text-ink-2 ring-1 ring-line"><span className="h-2 w-2 animate-pulse rounded-full bg-[#2bb89a]" />Live</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={S.id} initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                    <View tick={prog} />
                  </motion.div>
                </AnimatePresence>
              </section>
            </div>
            <Cursor x={cur.x} y={cur.y} k={cur.k} />
          </div>
        </motion.div>

        <section className="relative mt-16 overflow-hidden rounded-[32px] bg-ink px-8 py-14 text-center sm:px-16">
          <span className="if-blob absolute -right-10 -top-20 h-72 w-72 rounded-full bg-coral/40" />
          <span className="if-blob absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[#5a4fc4]/50" style={{ animationDelay: "-4s" }} />
          <h2 className="relative text-[30px] font-extrabold text-white sm:text-[44px]">Ready to track your own product?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/70">Register your organization, create a workspace, add a project and get your tracking script in minutes.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn btn-primary">Start free <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/help" className="btn !border !border-white/20 !bg-white/10 text-white hover:!bg-white/20">Read the help guide</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Demo;
