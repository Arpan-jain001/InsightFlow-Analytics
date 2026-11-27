import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Building2, FolderKanban, Key, Code2, BadgeCheck, LayoutDashboard, Users, Pause, Play } from "lucide-react";
import { SectionHead } from "./Features";
import Terminal from "./ui/Terminal";
import { EXAM_EXAMPLE } from "../data/knowledge";

const INSIGHT = { type: "insight", tags: ["insight", "exam_workspace", "priority_high"], text: EXAM_EXAMPLE };

const STEPS = [
  { icon: UserPlus, title: "Register your organization", desc: "Sign up with the Team / Org account type and your company name.", file: "signup.sh",
    lines: [{ type: "cmd", text: 'insightflow signup --type org --company "Acme Learning"' }, { type: "comment", text: "Verifying your email..." }, { type: "ok", text: "Organizer account created" }] },
  { icon: Building2, title: "Create a workspace", desc: "One workspace per company or team. Its data stays isolated.", file: "workspace.sh",
    lines: [{ type: "cmd", text: 'insightflow workspace create "Acme Learning"' }, { type: "comment", text: "Isolating tenant data..." }, { type: "ok", text: "Workspace ready (RBAC enabled)" }] },
  { icon: FolderKanban, title: "Add a project", desc: "A project is one website or app you want to track.", file: "project.sh",
    lines: [{ type: "cmd", text: "insightflow project add --name storefront" }, { type: "comment", text: "Creating project and keys..." }, { type: "ok", text: "Project created: storefront" }] },
  { icon: Key, title: "Get your API key", desc: "Stored only as a hash and shown one time. Copy it right away.", file: "api-key.sh",
    lines: [{ type: "cmd", text: "insightflow keys show --project storefront" }, { type: "ok", text: "Project key: insightflow_live_xK9m...abc" }, { type: "comment", text: "Shown once. We only keep a hash." }] },
  { icon: Code2, title: "Add the SDK", desc: "Pick your stack and paste the ready script, or hand the AI prompt to any assistant.", file: "index.html",
    copy: '<script src="cdn.insightflow.ai/v2.js"\n      data-key="insightflow_live_xK9m"></script>',
    lines: [{ type: "script", parts: [["tag", "<script "], ["attr", "src"], ["text", "="], ["str", '"cdn.insightflow.ai/v2.js"']] },
            { type: "script", indent: true, parts: [["attr", "data-key"], ["text", "="], ["str", '"insightflow_live_xK9m"'], ["tag", "></script>"]] },
            { type: "ok", text: "Tracking active. Insights incoming." }] },
  { icon: BadgeCheck, title: "Go live and verify", desc: "Deploy your site, then click Verify SDK. We check the key and incoming events.", file: "verify.sh",
    lines: [{ type: "cmd", text: "insightflow verify-sdk" }, { type: "comment", text: "Checking API key..." }, { type: "ok", text: "Key is valid" }, { type: "ok", text: "12 events received. SDK verified" }] },
  { icon: LayoutDashboard, title: "Open analytics and AI insights", desc: "Page views, DAU, MAU, funnels, retention, plus AI insights and ML predictions.", file: "insights.ai",
    lines: [{ type: "cmd", text: "insightflow insights --run" }, { type: "comment", text: "ML retention model + Gemini explanation" }, INSIGHT] },
  { icon: Users, title: "Invite your team", desc: "Add an email, pick a role. They accept the invitation and the role applies.", file: "invite.sh",
    lines: [{ type: "cmd", text: "insightflow invite dev@acme.com --role viewer" }, { type: "comment", text: "Checking if an account exists..." }, { type: "ok", text: "Collaboration invitation sent" }] },
];
const DURATION = 7500;

const HowItWorks = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setProgress((p) => p + 100 / (DURATION / 60)), 60);
    return () => clearInterval(id);
  }, [paused]);
  useEffect(() => { if (progress >= 100) { setActive((a) => (a + 1) % STEPS.length); setProgress(0); } }, [progress]);
  const pick = (i) => { setActive(i); setProgress(0); };
  const s = STEPS[active];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-white via-cream/70 to-white py-24 scroll-mt-24">
      <span className="if-blob absolute -left-32 top-24 h-80 w-80 rounded-full bg-coral/15" />
      <span className="if-blob absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#5a4fc4]/15" style={{ animationDelay: "-4s" }} />
      <div className="container-x relative">
        <SectionHead eyebrow="How it works" title="From signup to your first insight" sub="Eight steps. Click one, or let it play and watch what happens in the terminal." />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1fr_1.05fr]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* ── steps ── */}
          <ol className="relative">
            <span className="absolute bottom-6 left-[27px] top-6 w-[2px] bg-line" />
            <motion.span className="absolute left-[27px] top-6 w-[2px] rounded-full bg-gradient-to-b from-coral to-amber-brand" animate={{ height: `calc((100% - 48px) * ${active / (STEPS.length - 1)})` }} transition={{ duration: 0.6, ease: "easeOut" }} />
            {STEPS.map((st, i) => {
              const on = i === active, done = i < active;
              return (
                <li key={st.title}>
                  <button onClick={() => pick(i)} className="group relative flex w-full gap-5 rounded-2xl py-3 pr-3 text-left">
                    <span className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 transition-all duration-500 ${on ? "scale-110 border-coral bg-coral text-white shadow-[0_14px_30px_-10px_#f67963]" : done ? "border-coral/40 bg-white text-coral" : "border-line bg-white text-slate-400 group-hover:border-coral/40 group-hover:text-coral"}`}>
                      <st.icon className="h-6 w-6" />
                    </span>
                    <span className={`min-w-0 flex-1 rounded-2xl px-5 py-3 transition-all duration-500 ${on ? "border border-white bg-white/80 shadow-[0_22px_50px_-26px_rgba(22,19,46,.4)] backdrop-blur-xl" : "border border-transparent group-hover:bg-white/60"}`}>
                      <span className="flex items-center gap-3"><span className="text-[11px] font-bold tracking-widest text-coral-dark">STEP 0{i + 1}</span>{done && <span className="text-[11px] font-bold text-[#2bb89a]">Done</span>}</span>
                      <span className={`block text-[17px] font-extrabold leading-snug transition-colors ${on ? "text-ink" : "text-ink-2"}`}>{st.title}</span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="block overflow-hidden">
                            <span className="mt-1.5 block text-[14.5px] leading-7 text-muted">{st.desc}</span>
                            <span className="mt-3 block h-1 overflow-hidden rounded-full bg-ink/10"><span className="block h-full rounded-full bg-coral" style={{ width: `${Math.min(progress, 100)}%` }} /></span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* ── terminal stage ── */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-1 gap-1.5">{STEPS.map((_, i) => <button key={i} onClick={() => pick(i)} aria-label={`Step ${i + 1}`} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10"><span className="block h-full rounded-full bg-coral transition-all" style={{ width: i < active ? "100%" : i === active ? `${Math.min(progress, 100)}%` : "0%" }} /></button>)}</div>
              <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"} className="ml-4 grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-ink-2 hover:border-coral hover:text-coral">{paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}</button>
            </div>
            <Terminal filename={s.file} lines={s.lines} copyText={s.copy || s.lines.filter((l) => l.type === "cmd").map((l) => l.text).join("\n")} />
            <p className="mt-3 text-center text-xs text-muted">Sample output for illustration</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
