import { useState } from "react";
import { Check, Copy } from "lucide-react";

export const buildPrompt = (label, code, endpoint = "https://your-backend.onrender.com") => [
  `I want to add InsightFlow (user behavior analytics) to my ${label} project.`, "",
  "Please do the following:",
  `1. Put the tracking code below in the correct place for ${label} (global layout, index.html, theme header, etc.).`,
  "2. Replace YOUR_API_KEY and YOUR_PROJECT_ID using environment variables. Do not hard-code the key in a public repository.",
  "3. Make sure a page_view event is sent on every route change, including single-page navigation.",
  `4. Events are sent to ${endpoint}/api/ingest/event with the x-api-key header.`,
  "5. Tell me which files you changed and how to test that events arrive.", "", "Code:", "```", code, "```",
].join("\n");

const CodeBlock = ({ code, label, maxH = "max-h-[420px]" }) => {
  const [done, setDone] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1600); } catch { /* noop */ } };
  return (
    <div className="overflow-hidden rounded-2xl bg-[#0f0d24] shadow-[0_30px_60px_-30px_rgba(22,19,46,.6)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[12px] text-white/50">{label}</span>
        <button onClick={copy} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-semibold text-white/70 hover:bg-white/10 hover:text-white">
          {done ? <><Check className="h-3.5 w-3.5 text-[#4ade80]" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
        </button>
      </div>
      <pre className={`${maxH} overflow-auto px-5 py-5 font-mono text-[12px] leading-6 text-[#d9d7f5]`}>{code}</pre>
    </div>
  );
};
export default CodeBlock;
