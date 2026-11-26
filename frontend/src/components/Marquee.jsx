const ITEMS = ["Real-Time Analytics", "AI Insights", "Funnel Analysis", "RBAC Security", "Event Tracking", "Session Analytics", "Retention Curves", "NL Queries", "EdTech Analytics", "Multi-Tenant SaaS"];

const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative bg-ink py-4 overflow-hidden group [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="if-marquee flex w-max whitespace-nowrap group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-[13px] font-bold uppercase tracking-[0.16em] text-white/70 hover:text-coral transition-colors cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />{t}
          </span>
        ))}
      </div>
    </div>
  );
};
export default Marquee;
