import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Gathering visitor events…",
  "Mapping behaviour patterns…",
  "Running retention model…",
  "Asking Gemini for insights…",
];

/* Orbit spinner: 3 counter-rotating rings + breathing coral core */
export const OrbitSpinner = ({ size = 96 }) => (
  <div className="relative" style={{ width: size, height: size }} role="status" aria-label="Loading">
    <span className="absolute inset-[-14%] rounded-full bg-[#f67963]/20 blur-xl if-core" />
    <span className="if-ring if-ring-1" />
    <span className="if-ring if-ring-2" />
    <span className="if-ring if-ring-3" />
    <div className="absolute inset-[24%] rounded-full if-core grid place-items-center bg-white/80 shadow-[0_8px_24px_-6px_rgba(59,47,168,.45)] backdrop-blur">
      <img src="/logo-mark.png" alt="" className="w-[70%] h-auto" draggable="false" />
    </div>
  </div>
);

/* Small spinner for buttons — use instead of <Loader2 className="animate-spin" /> */
export const ButtonSpinner = ({ className = "" }) => (
  <span className={`inline-block w-4 h-4 rounded-full border-2 border-current/25 border-t-current animate-spin ${className}`} />
);

/**
 * <InsightLoader />                     full-screen glass loader
 * <InsightLoader variant="card" />      inline glass card
 * <InsightLoader messages={["Signing you in…"]} />
 */
const InsightLoader = ({ variant = "fullscreen", messages = MESSAGES, title = "InsightFlow" }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 1800);
    return () => clearInterval(t);
  }, [messages]);

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="if-glass relative w-[min(88vw,340px)] rounded-[28px] px-8 py-9 flex flex-col items-center gap-6"
    >
      <OrbitSpinner />
      <div className="text-center">
        <p className="text-[13px] font-extrabold tracking-tight text-ink">
          Insight<span className="bg-gradient-to-r from-[#0a84ff] to-[#8b3dff] bg-clip-text text-transparent">Flow</span>
        </p>
        <div className="h-6 mt-2 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }} className="text-sm text-muted font-medium">
              {messages[i]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="relative h-[4px] w-full overflow-hidden rounded-full bg-ink/10">
        <span className="if-shimmer absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-[#f67963] to-transparent" />
      </div>
    </motion.div>
  );

  if (variant === "card") return <div className="flex justify-center py-16">{card}</div>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-cream">
      <span className="if-blob absolute -top-28 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#f67963]/30" />
      <span className="if-blob absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-[#5a4fc4]/25" style={{ animationDelay: "-3s" }} />
      <span className="if-blob absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-[#a1f4e6]/60" style={{ animationDelay: "-6s" }} />
      {card}
    </div>
  );
};

export default InsightLoader;
