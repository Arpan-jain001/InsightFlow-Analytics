import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

const TypedText = ({ text, delay = 0, speed = 22 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0); let i = 0, iv;
    const t = setTimeout(() => { iv = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(iv); }, speed); }, delay * 1000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay, speed]);
  return <>{text.slice(0, n)}</>;
};

export const PriorityChip = ({ p }) => {
  const c = { priority_high: "bg-[#f67963]/20 text-[#ff9d8b]", priority_medium: "bg-[#f5a25d]/20 text-[#ffc48c]", priority_low: "bg-[#2bb89a]/20 text-[#7be3cb]" }[p];
  return <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${c || "bg-white/10 text-white/70"}`}>{p}</span>;
};

/* Line types: cmd | comment | ok | text | script | insight */
const Line = ({ l, delay }) => {
  if (l.type === "cmd")
    return <div><span className="text-[#4ade80] select-none">$ </span><span className="text-[#f4f3ff]"><TypedText text={l.text} delay={delay} /></span></div>;
  const renderBody = () => {
    switch (l.type) {
      case "comment":
        return <span className="text-[#7c7aa3]"># {l.text}</span>;
      case "ok":
        return <><span className="text-[#4ade80] font-bold">OK </span><span className="text-[#f4f3ff] font-semibold">{l.text}</span></>;
      case "script":
        return (
          <span className="text-[#c9c7ee]">
            {(l.parts || []).map((p, i) => <span key={i} className={{ tag: "text-[#b79cff]", attr: "text-[#7dd3fc] font-bold", str: "text-[#4ade80]" }[p[0]]}>{p[1]}</span>)}
          </span>
        );
      case "insight":
        return (
          <div className="mt-1 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(l.tags || []).map((t) => t.startsWith("priority") ? <PriorityChip key={t} p={t} /> : <span key={t} className="px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-semibold text-white/75">{t}</span>)}
            </div>
            <p className="text-[12.5px] leading-6 text-[#d9d7f5] whitespace-normal">{l.text}</p>
          </div>
        );
      default:
        return <span className="text-[#c9c7ee]">{l.text}</span>;
    }
  };
  const body = renderBody();
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.35 }}
      className={l.indent ? "pl-8" : ""}>{body}</motion.div>
  );
};

const Terminal = ({ filename = "setup.sh", lines, copyText, className = "" }) => {
  const [copied, setCopied] = useState(false);
  const base = (lines[0]?.type === "cmd" ? lines[0].text.length * 0.022 : 0) + 0.25;
  const copy = async () => { try { await navigator.clipboard.writeText(copyText || ""); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ } };
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`); e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`); };

  return (
    <div className={`rounded-[26px] p-px bg-gradient-to-br from-[#f67963]/70 via-white/10 to-[#5a4fc4]/70 shadow-[0_40px_80px_-30px_rgba(22,19,46,.55)] ${className}`}>
      <div onMouseMove={onMove} className="spot-dark relative overflow-hidden rounded-[25px] bg-[#0f0d24]">
        <span className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 rounded-full bg-[#f67963]/20 blur-3xl" />
        <div className="relative flex items-center gap-2 px-5 py-4 border-b border-white/10 bg-white/[0.03]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[12.5px] text-white/50">{filename}</span>
          <button onClick={copy} className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-white/60 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition">
            {copied ? <><Check className="w-3.5 h-3.5 text-[#4ade80]" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
          </button>
        </div>
        <div key={filename + lines.length + (lines[0]?.text || "")} className="relative px-6 py-6 font-mono text-[13px] leading-[1.85] min-h-[300px] space-y-1.5">
          {lines.map((l, i) => <Line key={i} l={l} delay={i === 0 ? 0 : base + (i - 1) * 0.42} />)}
          <div className="text-[#4ade80]">$ <span className="inline-block w-2 h-4 -mb-0.5 bg-[#4ade80] animate-pulse" /></div>
        </div>
      </div>
    </div>
  );
};
export default Terminal;
