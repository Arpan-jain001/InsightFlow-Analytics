import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const TIPS = [
  "Hi, I’m Flo, your analytics buddy.",
  "Curious why visitors leave? Ask the AI analyst.",
  "Watch setup.sh run, step by step.",
  "Predict who will come back, before they leave.",
];

const Face = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <line x1="32" y1="6" x2="32" y2="13" stroke="#16132e" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="5" r="3.2" fill="#f67963" className="if-core" style={{ transformOrigin: "32px 5px" }} />
    <rect x="9" y="13" width="46" height="38" rx="15" fill="#fff" stroke="#16132e" strokeWidth="2.5" />
    <rect x="15" y="21" width="34" height="22" rx="9" fill="#16132e" />
    <g className="if-blink" style={{ transformOrigin: "32px 31px" }}><ellipse cx="25" cy="31" rx="3.2" ry="4.2" fill="#f67963" /><ellipse cx="39" cy="31" rx="3.2" ry="4.2" fill="#f67963" /></g>
    <path d="M28 37.5 Q32 40.5 36 37.5" stroke="#7be3cb" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <rect x="4" y="27" width="5" height="9" rx="2.5" fill="#f67963" /><rect x="55" y="27" width="5" height="9" rx="2.5" fill="#f67963" />
  </svg>
);

const FloatingAssistant = () => {
  const [tip, setTip] = useState(0);
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => { const t = setTimeout(() => setShow(true), 3500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!show || closed) return;
    const id = setInterval(() => setTip((v) => (v + 1) % TIPS.length), 4500);
    return () => clearInterval(id);
  }, [show, closed]);

  const go = () => document.getElementById("ai-insights")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3">
      <AnimatePresence>
        {show && !closed && (
          <motion.div initial={{ opacity: 0, x: 16, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 16, scale: 0.9 }}
            className="relative hidden sm:block max-w-[230px] rounded-2xl rounded-br-sm bg-white/85 backdrop-blur-xl border border-white shadow-[0_18px_44px_-16px_rgba(22,19,46,.45)] px-4 py-3 pr-8">
            <button onClick={() => setClosed(true)} aria-label="Dismiss" className="absolute top-2 right-2 text-slate-400 hover:text-ink"><X className="w-3.5 h-3.5" /></button>
            <AnimatePresence mode="wait">
              <motion.p key={tip} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
                className="text-[13px] font-semibold leading-snug text-ink-2">{TIPS[tip]}</motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={go} whileHover={{ scale: 1.08, rotate: -4 }} whileTap={{ scale: 0.94 }} aria-label="Meet the AI analyst"
        className="relative w-16 h-16 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-[0_18px_44px_-12px_rgba(22,19,46,.5)] p-2.5 if-float">
        <span className="absolute inset-0 rounded-full border-2 border-coral/40 animate-ping" />
        <Face />
      </motion.button>
    </div>
  );
};
export default FloatingAssistant;
