import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, PlayCircle, Mail, Sparkles } from "lucide-react";

/* ───────── Isometric dashboard (right side) ───────── */
const Chip = ({ children, tone = "mint" }) => (
  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${tone === "mint" ? "bg-mint text-[#0b6b58]" : "bg-coral-soft text-coral-dark"}`}>{children}</span>
);

const IsoCard = ({ className = "", delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.7, ease: "easeOut" }}
    className={`absolute bg-white rounded-2xl p-4 shadow-[0_18px_40px_-14px_rgba(22,19,46,.35)] border border-line/70 ${className}`}
  >
    {children}
  </motion.div>
);

const FloatChip = ({ children, className = "", delay = 0 }) => (
  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    className={`hidden sm:flex absolute z-20 items-center gap-2 rounded-full bg-white/75 backdrop-blur-xl border border-white px-3.5 py-2 text-[12px] font-bold text-ink shadow-[0_14px_34px_-14px_rgba(22,19,46,.45)] ${className}`}>
    {children}
  </motion.div>
);

const IsoDashboard = () => (
  <div className="relative h-[460px] sm:h-[520px] w-full" style={{ perspective: 1600 }}>
    <FloatChip className="top-2 left-2 sm:left-6" delay={0}><span className="w-2 h-2 rounded-full bg-[#2bb89a] animate-pulse" />128 live visitors</FloatChip>
    <FloatChip className="top-24 right-0 sm:right-2" delay={0.8}><Sparkles className="w-3.5 h-3.5 text-coral" />AI insight ready</FloatChip>
    <FloatChip className="bottom-6 left-4 sm:left-12" delay={1.6}><span className="text-[#2bb89a]">▲ 12.4%</span> retention</FloatChip>

    <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] -ml-[200px] -mt-[200px] scale-[.78] sm:scale-100"
         style={{ transform: "rotateX(58deg) rotateZ(-38deg)", transformStyle: "preserve-3d" }}>

      <IsoCard className="left-0 top-4 w-[150px]" delay={0.1}>
        <p className="text-[10px] font-semibold text-muted">Visitors</p>
        <p className="text-2xl font-extrabold text-ink mt-1">9,350</p>
        <div className="mt-3 h-2 rounded-full bg-line overflow-hidden"><div className="h-full w-3/5 rounded-full bg-amber-brand" /></div>
        <div className="mt-2 flex gap-1 items-end h-8">
          {[40, 70, 50, 90, 60, 80].map((h, i) => <span key={i} className="flex-1 rounded-sm bg-cream-2" style={{ height: `${h}%` }} />)}
        </div>
      </IsoCard>

      <IsoCard className="left-[170px] top-0 w-[210px]" delay={0.25}>
        <div className="flex items-center justify-between"><p className="text-[10px] font-semibold text-muted">Retained visitors</p><Chip>▲ 12.4%</Chip></div>
        <p className="text-2xl font-extrabold text-ink mt-1">140,948</p>
        <div className="mt-3 h-2 rounded-full bg-line overflow-hidden"><div className="h-full w-4/5 rounded-full bg-indigo-brand" /></div>
        <p className="mt-2 text-[9px] text-muted">Predicted by XGBoost · 30 day</p>
      </IsoCard>

      <IsoCard className="left-[40px] top-[150px] w-[260px]" delay={0.4}>
        <div className="flex items-center justify-between"><p className="text-[11px] font-bold text-ink">Recent Sessions</p><Chip tone="coral">Live</Chip></div>
        <svg viewBox="0 0 220 90" className="mt-2 w-full">
          <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3b2fa8" stopOpacity=".28" /><stop offset="1" stopColor="#3b2fa8" stopOpacity="0" /></linearGradient></defs>
          <path d="M0 78 C20 70 30 60 48 64 S75 20 95 18 S120 60 140 52 S175 28 220 40 V90 H0Z" fill="url(#g)" />
          <path d="M0 78 C20 70 30 60 48 64 S75 20 95 18 S120 60 140 52 S175 28 220 40" fill="none" stroke="#3b2fa8" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="95" cy="18" r="4" fill="#fff" stroke="#3b2fa8" strokeWidth="2" />
        </svg>
      </IsoCard>

      <IsoCard className="left-[250px] top-[140px] w-[140px]" delay={0.55}>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200" /><span className="w-6 h-6 rounded-full bg-slate-300 -ml-3" />
        </div>
        <p className="mt-2 text-[9px] text-muted">Gemini insight</p>
        <p className="text-[11px] font-semibold text-ink leading-snug">Mobile users drop off at step 3.</p>
      </IsoCard>

      <IsoCard className="left-[10px] top-[300px] w-[160px]" delay={0.7}>
        <p className="text-[10px] font-semibold text-muted">Total events</p>
        <p className="text-2xl font-extrabold text-ink">122,637</p>
        <Chip>▲ 8.1%</Chip>
      </IsoCard>

      <IsoCard className="left-[200px] top-[290px] w-[170px]" delay={0.85}>
        <p className="text-[10px] font-semibold text-muted">Predicted to return</p>
        <p className="text-2xl font-extrabold text-coral">87.3%</p>
        <div className="mt-2 grid grid-cols-6 gap-1">{Array.from({ length: 12 }).map((_, i) => <span key={i} className={`h-1.5 rounded-full ${i < 9 ? "bg-coral" : "bg-line"}`} />)}</div>
      </IsoCard>
    </div>
  </div>
);

/* ───────── Hero ───────── */
const Hero = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const submit = (e) => { e.preventDefault(); navigate("/signup", { state: { email } }); };

  return (
    <section className="relative overflow-hidden bg-white"
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`); }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(520px circle at var(--hx,70%) var(--hy,30%), rgba(246,121,99,.11), transparent 60%)" }} />
      <div className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full bg-cream" />
      <div className="absolute top-20 right-[-120px] w-[420px] h-[420px] rounded-full bg-coral-soft/70 blur-3xl" />

      <div className="container-x relative grid lg:grid-cols-[1.05fr_1fr] gap-6 items-center pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white/90 px-3.5 py-1.5 text-[12px] font-semibold text-ink-2 shadow-sm"><Sparkles className="w-3.5 h-3.5 text-coral" />Predictive analytics for EdTech and SaaS</span>
          <h1 className="mt-6 text-[44px] sm:text-[58px] lg:text-[68px] leading-[1.03] font-extrabold text-ink">
            Know which visitors will <span className="text-coral-grad">come back</span>, before they leave.
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-muted max-w-[520px]">
            InsightFlow tracks every interaction, predicts visitor retention with machine learning, and explains the results in plain language using Gemini AI.
          </p>

          <form onSubmit={submit} className="mt-9 flex items-center gap-2 max-w-[540px] rounded-full bg-white/90 backdrop-blur-xl border border-white p-2 pl-5 shadow-[0_24px_60px_-24px_rgba(22,19,46,.4)] focus-within:ring-4 focus-within:ring-coral/20 transition">
            <Mail className="w-[18px] h-[18px] shrink-0 text-slate-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Register using email address…" aria-label="Email address"
              className="flex-1 min-w-0 bg-transparent px-1 py-3 text-[15px] font-medium text-ink placeholder:text-slate-400 outline-none" />
            <button type="submit" className="btn btn-dark !rounded-full !py-3.5 !px-6 sm:!px-8 shrink-0">Submit <ArrowRight className="w-4 h-4" /></button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-semibold text-ink-2">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral" />Free to register</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral" />AI-powered insights</span>
            <Link to="/demo" className="inline-flex items-center gap-2 text-coral-dark hover:underline"><PlayCircle className="w-4 h-4" />View private demo</Link>
          </div>
        </motion.div>

        <IsoDashboard />
      </div>

    </section>
  );
};

export default Hero;
