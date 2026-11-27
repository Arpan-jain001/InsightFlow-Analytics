import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle, Info, X, Eye, EyeOff, ShieldCheck, Sparkles, Activity, TrendingUp, Brain } from "lucide-react";
import { Logo } from "../Navbar";
import { OrbitSpinner } from "../ui/InsightLoader";

/* ───────── Toast ───────── */
export const Toast = ({ type = "info", message, onClose }) => {
  const M = { success: [CheckCircle2, "#2bb89a", "bg-mint/50"], error: [AlertCircle, "#e5604a", "bg-coral-soft"], info: [Info, "#3b2fa8", "bg-violet-50"] }[type] || [Info, "#3b2fa8", "bg-violet-50"];
  const Icon = M[0];
  return (
    <motion.div className="fixed bottom-6 right-6 z-[10000] w-[92%] max-w-sm" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <div className="flex items-start gap-3 overflow-hidden rounded-2xl border border-white bg-white/90 p-4 shadow-[0_24px_60px_-20px_rgba(22,19,46,.45)] backdrop-blur-xl">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${M[2]}`}><Icon className="h-5 w-5" style={{ color: M[1] }} /></span>
        <div className="min-w-0 flex-1"><p className="text-[13px] font-extrabold text-ink">InsightFlow</p><p className="mt-0.5 text-[13.5px] leading-snug text-muted">{message}</p></div>
        <button onClick={onClose} aria-label="Dismiss" className="text-slate-300 hover:text-ink"><X className="h-4 w-4" /></button>
        <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: M[1] }} />
      </div>
    </motion.div>
  );
};

/* ───────── Full-screen glass overlays ───────── */
export const LoaderOverlay = ({ text = "Please wait…", timeoutSec = 30, onTimeout }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((p) => { if (p + 1 >= timeoutSec) { clearInterval(id); onTimeout?.(); } return p + 1; }), 1000);
    return () => clearInterval(id);
  }, [timeoutSec, onTimeout]);
  return (
    <motion.div className="fixed inset-0 z-[9998] grid place-items-center bg-ink/40 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ y: 24, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 10, opacity: 0 }} className="if-glass flex w-[92%] max-w-xs flex-col items-center rounded-[28px] p-8">
        <OrbitSpinner size={84} />
        <p className="mt-6 text-center text-[15px] font-extrabold text-ink">{text}</p>
        <p className="mt-1 text-center text-xs text-muted">{elapsed < timeoutSec - 5 ? "Please wait a moment…" : "Taking longer than usual…"}</p>
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-coral transition-all duration-1000 ease-linear" style={{ width: `${Math.min((elapsed / timeoutSec) * 100, 100)}%` }} /></div>
      </motion.div>
    </motion.div>
  );
};

export const SuccessOverlay = ({ title = "Welcome back!", text = "Redirecting to your dashboard…" }) => (
  <motion.div className="fixed inset-0 z-[9999] grid place-items-center bg-ink/40 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div initial={{ y: 24, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} className="if-glass w-[92%] max-w-xs rounded-[28px] p-8 text-center">
      <motion.div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-mint/60" animate={{ scale: [0.7, 1.15, 1] }} transition={{ duration: 0.5 }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><motion.path d="M20 6L9 17l-5-5" stroke="#0b6b58" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} /></svg>
      </motion.div>
      <h3 className="text-lg font-extrabold text-ink">{title}</h3><p className="mt-1 text-sm text-muted">{text}</p>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink/10"><motion.div className="h-full rounded-full bg-coral" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} /></div>
    </motion.div>
  </motion.div>
);

/* ───────── Form pieces ───────── */
export const ErrorBanner = ({ error }) => (
  <AnimatePresence>
    {error && (
      <motion.div role="alert" initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }} className="mb-5 flex items-start gap-2.5 overflow-hidden rounded-2xl border border-coral/30 bg-coral-soft px-4 py-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" /><span className="text-[13.5px] font-semibold text-coral-dark">{error}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Field = ({ label, icon: Icon, hint, right, type = "text", reveal = false, ...props }) => {
  const [show, setShow] = useState(false);
  const isPass = type === "password" && reveal;
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-bold text-ink-2">{label}{hint && <span className="text-[11.5px] font-medium text-slate-400">{hint}</span>}</span>
      <span className="group relative flex items-center">
        {Icon && <Icon className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-slate-400 transition-colors group-focus-within:text-coral" />}
        <input {...props} type={isPass && show ? "text" : type}
          className={`w-full rounded-2xl border border-line bg-white py-3.5 text-[15px] font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-slate-300 hover:border-slate-300 focus:border-coral focus:ring-4 focus:ring-coral/15 disabled:opacity-60 ${Icon ? "pl-12" : "pl-4"} ${isPass || right ? "pr-12" : "pr-4"}`} />
        {isPass && <button type="button" tabIndex={-1} onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-ink">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
      </span>
    </label>
  );
};

export const PasswordStrength = ({ password }) => {
  const checks = [["8+ chars", password.length >= 8], ["Uppercase", /[A-Z]/.test(password)], ["Number", /\d/.test(password)], ["Special", /[^A-Za-z0-9]/.test(password)]];
  const score = checks.filter((c) => c[1]).length;
  const colors = ["#e5604a", "#f5a25d", "#f5c04d", "#2bb89a"];
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5">
      <div className="flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><motion.span className="block h-full rounded-full" style={{ background: colors[Math.max(score - 1, 0)] }} animate={{ width: i < score ? "100%" : "0%" }} /></span>)}</div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">{checks.map(([l, ok]) => <span key={l} className={`text-[11px] font-semibold ${ok ? "text-[#0b6b58]" : "text-slate-300"}`}>{ok ? "✓" : "·"} {l}</span>)}</div>
    </motion.div>
  );
};

export const GoogleButton = ({ onClick, disabled, label = "Continue with Google" }) => (
  <button type="button" onClick={onClick} disabled={disabled} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-white py-3.5 text-[14.5px] font-bold text-ink transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_-18px_rgba(22,19,46,.4)] disabled:opacity-60">
    <svg className="h-5 w-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" /></svg>{label}
  </button>
);

export const Divider = ({ children = "or continue with email" }) => (
  <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-line" /><span className="text-[12px] font-semibold text-slate-400">{children}</span><span className="h-px flex-1 bg-line" /></div>
);

/* ───────── Split-screen shell ───────── */
const SLIDES = [
  { icon: Activity, title: "Real-time behaviour", text: "Every click, view and form submit, as it happens." },
  { icon: Brain, title: "AI that explains", text: "Plain-language findings, not just charts." },
  { icon: TrendingUp, title: "Predict retention", text: "Know who will come back before they leave." },
];

const Side = ({ headline, sub }) => {
  const [k, setK] = useState(0);
  useEffect(() => { const t = setInterval(() => setK((v) => (v + 1) % SLIDES.length), 3200); return () => clearInterval(t); }, []);
  return (
    <aside className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12">
      <span className="if-blob absolute -left-20 -top-16 h-96 w-96 rounded-full bg-coral/40" />
      <span className="if-blob absolute -bottom-24 -right-16 h-[26rem] w-[26rem] rounded-full bg-[#5a4fc4]/55" style={{ animationDelay: "-4s" }} />
      <span className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)", backgroundSize: "52px 52px", maskImage: "radial-gradient(ellipse at center,#000 30%,transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center,#000 30%,transparent 80%)" }} />
      <div className="relative"><Logo dark /></div>

      <div className="relative">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-[42px] font-extrabold leading-[1.05] text-white">{headline}</motion.h2>
        <p className="mt-4 max-w-sm text-[15.5px] leading-relaxed text-white/60">{sub}</p>

        <div className="relative mt-10 h-[210px]">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute left-0 top-0 w-[300px] rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,.6)]">
            <div className="flex items-center justify-between"><p className="text-[12px] font-semibold text-white/60">Retained visitors</p><span className="rounded-md bg-mint px-1.5 py-0.5 text-[10px] font-bold text-[#0b6b58]">▲ 12.4%</span></div>
            <p className="mt-1 text-[30px] font-extrabold text-white">140,948</p>
            <svg viewBox="0 0 240 60" className="mt-1 w-full"><defs><linearGradient id="as" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f67963" stopOpacity=".45" /><stop offset="1" stopColor="#f67963" stopOpacity="0" /></linearGradient></defs>
              <path d="M0 48 C25 42 35 30 55 34 S90 8 115 10 S150 38 175 30 S215 14 240 20 V60 H0Z" fill="url(#as)" />
              <motion.path d="M0 48 C25 42 35 30 55 34 S90 8 115 10 S150 38 175 30 S215 14 240 20" fill="none" stroke="#f67963" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut" }} /></svg>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-0 right-0 w-[250px] rounded-3xl border border-white/15 bg-white/[0.12] p-4 backdrop-blur-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,.6)]">
            <p className="flex items-center gap-2 text-[11px] font-bold text-coral"><Sparkles className="h-3.5 w-3.5" />AI insight</p>
            <p className="mt-1.5 text-[12.5px] leading-5 text-white/80">Checkout drop-off rises on mobile after the shipping step. Shorten the form.</p>
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-4">
            {(() => { const I = SLIDES[k].icon; return <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-coral"><I className="h-5 w-5" /></span>; })()}
            <div><p className="font-extrabold text-white">{SLIDES[k].title}</p><p className="text-[13.5px] text-white/55">{SLIDES[k].text}</p></div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex gap-1.5">{SLIDES.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === k ? "w-8 bg-coral" : "w-2 bg-white/20"}`} />)}</div>
      </div>
    </aside>
  );
};

export const AuthShell = ({ children, headline, sub }) => (
  <div className="grid min-h-screen bg-white lg:grid-cols-[1.02fr_1fr]">
    <Side headline={headline} sub={sub} />
    <div className="relative flex flex-col bg-gradient-to-b from-cream/70 via-white to-white">
      <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
        <div className="lg:hidden"><Logo /></div>
        <Link to="/" className="ml-auto inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-2 transition hover:border-coral hover:text-coral"><ArrowLeft className="h-4 w-4" />Back to home</Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[460px]">{children}</motion.div>
      </div>
      <p className="flex items-center justify-center gap-2 pb-6 text-[12px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-[#2bb89a]" />Encrypted connection · Your data stays isolated per workspace</p>
    </div>
  </div>
);
