import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, ArrowUpRight, RotateCcw } from "lucide-react";

import { answer, CHIPS } from "../data/chatKnowledge";

/* tiny markdown: **bold**, *italic*, `code`, • bullets */
const Rich = ({ text }) => (
  <>
    {text.split("\n").map((line, i) => (
      <p key={i} className={line.startsWith("•") ? "pl-1 mt-1" : i ? "mt-2" : ""}>
        {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((p, j) =>
          p.startsWith("**") ? <strong key={j} className="font-bold text-ink">{p.slice(2, -2)}</strong>
          : p.startsWith("`") ? <code key={j} className="px-1 py-0.5 rounded bg-ink/5 font-mono text-[12px]">{p.slice(1, -1)}</code>
          : p.startsWith("*") && p.length > 2 ? <em key={j}>{p.slice(1, -1)}</em> : p)}
      </p>
    ))}
  </>
);

export const RobotFace = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <line x1="32" y1="6" x2="32" y2="13" stroke="#16132e" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="5" r="3.2" fill="#f67963" />
    <rect x="9" y="13" width="46" height="38" rx="15" fill="#fff" stroke="#16132e" strokeWidth="2.5" />
    <rect x="15" y="21" width="34" height="22" rx="9" fill="#16132e" />
    <g className="if-blink" style={{ transformOrigin: "32px 31px" }}><ellipse cx="25" cy="31" rx="3.2" ry="4.2" fill="#f67963" /><ellipse cx="39" cy="31" rx="3.2" ry="4.2" fill="#f67963" /></g>
    <path d="M28 37.5 Q32 40.5 36 37.5" stroke="#7be3cb" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <rect x="4" y="27" width="5" height="9" rx="2.5" fill="#f67963" /><rect x="55" y="27" width="5" height="9" rx="2.5" fill="#f67963" />
  </svg>
);

const GREETING = { role: "bot", text: "Hi, I’m **Flo**, your InsightFlow assistant. Ask me what InsightFlow does, which **role** to register as (User or Organizer), how setup works, or how retention is predicted.", links: [] };

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [nudge, setNudge] = useState(false);
  const end = useRef(null);

  useEffect(() => { const t = setTimeout(() => setNudge(true), 4000); return () => clearTimeout(t); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, open]);

  const send = (text) => {
    const q = (text ?? input).trim(); if (!q || typing) return;
    setInput(""); setMsgs((m) => [...m, { role: "user", text: q }]); setTyping(true);
    const r = answer(q);
    setTimeout(() => { setMsgs((m) => [...m, { role: "bot", text: r.a, links: r.links || [], follow: r.follow || [] }]); setTyping(false); }, 550 + Math.min(r.a.length * 4, 900));
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }} style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-[76px] right-0 w-[min(400px,calc(100vw-2rem))] h-[min(620px,calc(100vh-8rem))] flex flex-col overflow-hidden rounded-[28px] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_40px_90px_-24px_rgba(22,19,46,.55)]">
            <div className="relative flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-ink to-[#2b2850] text-white">
              <span className="absolute -top-10 -right-6 w-32 h-32 rounded-full bg-coral/40 blur-2xl" />
              <span className="relative grid place-items-center w-11 h-11 rounded-2xl bg-white p-1.5"><RobotFace className="w-full h-full" /></span>
              <div className="relative">
                <p className="font-extrabold leading-tight">Flo · InsightFlow assistant</p>
                <p className="flex items-center gap-1.5 text-[12px] text-white/70"><span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />Online</p>
              </div>
              <button onClick={() => setMsgs([GREETING])} aria-label="Restart" className="relative ml-auto p-2 rounded-full hover:bg-white/10"><RotateCcw className="w-4 h-4" /></button>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="relative p-2 rounded-full hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[86%] px-4 py-3 text-[13.5px] leading-relaxed ${m.role === "user" ? "rounded-2xl rounded-br-md bg-coral text-white font-medium" : "rounded-2xl rounded-bl-md bg-white border border-line text-ink-2 shadow-sm"}`}>
                    {m.role === "user" ? m.text : <Rich text={m.text} />}
                    {m.links?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.links.map((l) => (
                          <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="inline-flex items-center gap-1 rounded-full bg-coral-soft px-3 py-1.5 text-[12px] font-bold text-coral-dark hover:bg-coral hover:text-white transition">
                            {l.label}<ArrowUpRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {!typing && msgs.length > 1 && msgs[msgs.length - 1].role === "bot" && msgs[msgs.length - 1].follow?.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-1">
                  {msgs[msgs.length - 1].follow.map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border border-coral/30 bg-coral-soft px-3 py-1.5 text-[12px] font-semibold text-coral-dark hover:bg-coral hover:text-white transition">{c}</button>)}
                </div>
              )}
              {typing && (
                <div className="flex"><div className="flex gap-1 rounded-2xl rounded-bl-md bg-white border border-line px-4 py-3.5">
                  {[0, 1, 2].map((d) => <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />)}
                </div></div>
              )}
              {msgs.length === 1 && !typing && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink-2 hover:border-coral hover:text-coral transition">{c}</button>)}
                </div>
              )}
              <div ref={end} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-line bg-white/70">
              <div className="flex items-center gap-2 rounded-full bg-white border border-line pl-4 pr-1.5 py-1.5 focus-within:border-coral/60 focus-within:ring-4 focus-within:ring-coral/15 transition">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about InsightFlow…" aria-label="Message" className="flex-1 min-w-0 bg-transparent text-[14px] text-ink placeholder:text-slate-400 outline-none" />
                <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="grid place-items-center w-10 h-10 rounded-full bg-ink text-white disabled:opacity-40 hover:bg-coral transition"><Send className="w-4 h-4" /></button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {nudge && !open && (
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onClick={() => setOpen(true)}
            className="hidden sm:block absolute bottom-3 right-[76px] cursor-pointer whitespace-nowrap rounded-2xl rounded-br-sm bg-white/90 backdrop-blur-xl border border-white px-4 py-2.5 text-[13px] font-semibold text-ink-2 shadow-[0_18px_44px_-16px_rgba(22,19,46,.45)]">
            Ask me anything about InsightFlow
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={() => { setOpen((o) => !o); setNudge(false); }} whileHover={{ scale: 1.08, rotate: open ? 0 : -4 }} whileTap={{ scale: 0.94 }} aria-label={open ? "Close chat" : "Open chat"}
        className={`relative w-16 h-16 rounded-full bg-white/85 backdrop-blur-xl border border-white shadow-[0_18px_44px_-12px_rgba(22,19,46,.5)] p-2.5 ${open ? "" : "if-float"}`}>
        {!open && <span className="absolute inset-0 rounded-full border-2 border-coral/40 animate-ping" />}
        {open ? <X className="w-full h-full p-3 text-ink" /> : <RobotFace className="w-full h-full" />}
        {!open && nudge && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-coral border-2 border-white" />}
      </motion.button>
    </div>
  );
};
export default ChatBot;
