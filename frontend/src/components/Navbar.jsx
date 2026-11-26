import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "AI Insights", href: "#ai-insights" },
  { label: "Team", href: "#team" },
  { label: "Help", to: "/help" },
];

export const Logo = ({ dark = false }) => (
  <Link to="/" className="flex items-center gap-2.5 select-none group" aria-label="InsightFlow home">
    <img src="/logo-mark.png" alt="" className="h-8 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" draggable="false" />
    <span className="text-[21px] font-extrabold tracking-tight leading-none">
      <span className={dark ? "text-white" : "text-[#0b1630]"}>Insight</span>
      <span className="bg-gradient-to-r from-[#0a84ff] to-[#8b3dff] bg-clip-text text-transparent">Flow</span>
    </span>
  </Link>
);

const dashboardFor = (role) => ({ SUPER_ADMIN: "/admin-dashboard", ORGANIZER: "/organizer-dashboard", USER: "/dashboard" }[role] || "/dashboard");

/* overlay = true on the landing page (hero already reserves space); other pages get a spacer */
const Navbar = ({ overlay = false }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(null);
  const [active, setActive] = useState(null);
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* highlight the link of the section currently in view */
  useEffect(() => {
    const ids = LINKS.filter((l) => l.href).map((l) => l.href.slice(1));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);

  const item = "relative px-4 py-2 text-[13.5px] font-semibold rounded-full transition-colors";
  const Pill = ({ l }) => {
    const on = hover === l.label || (!hover && active === l.href);
    const inner = (
      <>
        {on && <motion.span layoutId="nav-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-ink/[0.07]" />}
        <span className="relative">{l.label}</span>
      </>
    );
    const cls = `${item} ${on ? "text-ink" : "text-ink-2"}`;
    const props = { onMouseEnter: () => setHover(l.label), onMouseLeave: () => setHover(null), className: cls };
    return l.to ? <Link to={l.to} {...props}>{inner}</Link> : <a href={l.href} {...props}>{inner}</a>;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
          className={`pointer-events-auto relative mx-auto max-w-[1120px] rounded-full border backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 overflow-hidden
            ${scrolled ? "bg-white/70 border-white/80 shadow-[0_18px_50px_-18px_rgba(22,19,46,.35)]" : "bg-white/40 border-white/60 shadow-[0_8px_30px_-16px_rgba(22,19,46,.2)]"}`}>
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="h-14 sm:h-[62px] pl-4 sm:pl-5 pr-2 lg:grid lg:grid-cols-[1fr_auto_1fr] flex items-center justify-between gap-4">
            <Logo />
            <nav className="hidden lg:flex items-center gap-0.5">{LINKS.map((l) => <Pill key={l.label} l={l} />)}</nav>
            <div className="hidden lg:flex items-center justify-end gap-2">
              {user ? (
                <>
                  <Link to={dashboardFor(user.role)} className="flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full bg-white/80 border border-white hover:border-coral/40 transition">
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-coral text-white text-xs font-bold">{initials}</span>
                    <span className="text-[13.5px] font-semibold text-ink">{user.name?.split(" ")[0]}</span>
                  </Link>
                  <button onClick={() => setConfirm(true)} className="grid place-items-center w-10 h-10 rounded-full hover:bg-ink/5 transition" aria-label="Log out"><LogOut className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-[13.5px] font-semibold text-ink hover:text-coral transition-colors">Sign in</Link>
                  <Link to="/signup" className="btn btn-dark !rounded-full !py-2.5 !px-5 !text-[13.5px]">Get early access</Link>
                </>
              )}
            </div>
            <button className="lg:hidden grid place-items-center w-10 h-10 rounded-full hover:bg-ink/5" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
              className="pointer-events-auto lg:hidden mx-auto max-w-[1120px] mt-2 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white shadow-2xl p-3">
              {LINKS.map((l) => {
                const c = "block px-4 py-3 rounded-2xl text-[15px] font-semibold text-ink-2 hover:bg-ink/5";
                return l.to ? <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className={c}>{l.label}</Link> : <a key={l.label} href={l.href} onClick={() => setOpen(false)} className={c}>{l.label}</a>;
              })}
              <div className="flex gap-2 p-1 pt-3">
                {user ? <Link to={dashboardFor(user.role)} className="btn btn-dark !rounded-full flex-1">Dashboard <ChevronRight className="w-4 h-4" /></Link> : (
                  <>
                    <Link to="/login" className="btn btn-ghost !rounded-full flex-1">Sign in</Link>
                    <Link to="/signup" className="btn btn-dark !rounded-full flex-1">Get early access</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {!overlay && <div aria-hidden className="h-[76px] sm:h-[84px]" />}

      <AnimatePresence>
        {confirm && (
          <motion.div className="fixed inset-0 z-[9999] grid place-items-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setConfirm(false)} />
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} className="if-glass relative w-full max-w-sm rounded-3xl p-7 text-center">
              <div className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-2xl bg-coral-soft"><LogOut className="w-6 h-6 text-coral" /></div>
              <h3 className="text-xl font-extrabold text-ink">Log out?</h3>
              <p className="mt-1.5 text-sm text-muted">You’ll need to sign in again to reach your dashboard.</p>
              <div className="mt-6 flex gap-3">
                <button className="btn btn-ghost flex-1" onClick={() => setConfirm(false)}>Stay</button>
                <button className="btn btn-primary flex-1" onClick={() => { setConfirm(false); logout(); }}>Log out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
