import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Code2, Zap, BarChart3, Cpu, Lightbulb } from "lucide-react";
import { SectionHead } from "./Features";
import Terminal from "./ui/Terminal";

const INSIGHT = { type: "insight", tags: ["insight", "exam_workspace", "priority_high"],
  text: "Math completion is running 28% below the platform average. Question 8 shows a repeated hesitation pattern with a 42% reattempt rate. Recommended action: add a contextual hint and simplify the question prompt." };

const STEPS = [
  { icon: Building2, title: "Create a Workspace", desc: "Register your organization and launch a secure multi-tenant environment.", file: "setup.sh",
    lines: [{ type: "cmd", text: "insightflow init --project storefront" }, { type: "comment", text: "Creating workspace and project keys..." }, { type: "ok", text: "Workspace ready (RBAC enabled)" }, { type: "ok", text: "Project key: insightflow_live_xK9m...abc" }] },
  { icon: Code2, title: "Generate an API Key", desc: "Provision a unique project key to identify and secure every tracking request.", file: "keys.sh",
    lines: [{ type: "cmd", text: "insightflow keys create --scope tracking" }, { type: "comment", text: "Key is hashed and tied to this project only" }, { type: "ok", text: "Project key: insightflow_live_xK9m...abc" }] },
  { icon: Zap, title: "Install the Tracking Script", desc: "Add one lightweight script to capture page views, clicks, forms and custom events.", file: "index.html",
    copy: '<script src="cdn.insightflow.ai/v2.js"\n      data-key="insightflow_live_xK9m"></script>',
    lines: [{ type: "script", parts: [["tag", "<script "], ["attr", "src"], ["text", "="], ["str", '"cdn.insightflow.ai/v2.js"']] },
            { type: "script", indent: true, parts: [["attr", "data-key"], ["text", "="], ["str", '"insightflow_live_xK9m"'], ["tag", "></script>"]] },
            { type: "ok", text: "Tracking active. Insights incoming." }] },
  { icon: BarChart3, title: "Visualize Live Analytics", desc: "Watch traffic trends, funnels and retention metrics fill your dashboard.", file: "live.log",
    lines: [{ type: "cmd", text: "insightflow events --live" }, { type: "text", text: "page_view    /pricing        mobile   12ms" }, { type: "text", text: "click        #start-trial    desktop   8ms" }, { type: "text", text: "form_submit  /signup         desktop  21ms" }, { type: "ok", text: "3 events/sec · 128 active visitors" }] },
  { icon: Cpu, title: "Run AI Interpretation", desc: "Detect anomalies, score project health and get practical recommendations.", file: "insights.ai",
    lines: [{ type: "cmd", text: "insightflow insights --run" }, { type: "comment", text: "XGBoost retention model + Gemini explanation" }, INSIGHT] },
  { icon: Lightbulb, title: "Take Action Faster", desc: "Share reports and optimize the experience with clear evidence behind each decision.", file: "report.sh",
    lines: [{ type: "cmd", text: "insightflow report --weekly --share team" }, { type: "ok", text: "Report generated · 4 members notified" }, { type: "comment", text: "Next: A/B test the simplified Q8 prompt" }] },
];
const DURATION = 7000;

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
    <section id="how-it-works" className="py-24 bg-cream/60 scroll-mt-24 overflow-hidden">
      <div className="container-x">
        <SectionHead eyebrow="How it works" title="From first command to AI insight in six steps" sub="Click a step, or let it play. The terminal shows what really happens." />
        <div className="mt-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="space-y-3">
            {STEPS.map((st, i) => {
              const on = i === active;
              return (
                <motion.button key={st.title} onClick={() => pick(i)} whileHover={{ x: 6 }} whileTap={{ scale: 0.98 }}
                  className={`group relative w-full text-left rounded-2xl p-4 pr-5 flex gap-4 items-start overflow-hidden transition-all ${on ? "glass shadow-xl" : "bg-white/50 border border-transparent hover:bg-white hover:border-line"}`}>
                  <span className={`shrink-0 grid place-items-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110 ${on ? "bg-coral text-white shadow-[0_10px_22px_-8px_#f67963]" : "bg-white text-ink-2 border border-line"}`}>
                    <st.icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-coral-dark">STEP 0{i + 1}</span>
                    <span className="block text-[16.5px] font-bold text-ink">{st.title}</span>
                    {on && <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="block mt-1 text-[14px] leading-relaxed text-muted">{st.desc}</motion.span>}
                  </span>
                  {on && <span className="absolute left-0 bottom-0 h-[3px] bg-coral rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />}
                </motion.button>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-28">
            <Terminal filename={s.file} lines={s.lines} copyText={s.copy || s.lines.filter((l) => l.type === "cmd").map((l) => l.text).join("\n")} />
            <p className="mt-3 text-center text-xs text-muted">Sample output for illustration</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
