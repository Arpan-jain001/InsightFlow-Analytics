import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, ShoppingCart, Briefcase, Users, Globe, Mail, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHead } from "./Features";
import { Logo } from "./Navbar";
import TiltCard from "./ui/TiltCard";
import { ButtonSpinner } from "./ui/InsightLoader";

const Linkedin = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9.75h4v11.5H3zM9.75 9.75h3.83v1.57h.06c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.78 2.66 4.78 6.12v5.88h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4z" /></svg>
);

/* ───────── Use cases ───────── */
const TARGETS = [
  { icon: GraduationCap, name: "Coaching and Exam Platforms", desc: "Track section difficulty, question-level drop-offs, time-on-task and reattempt behavior.", tint: "bg-coral-soft text-coral" },
  { icon: Building2, name: "EdTech and Learning Apps", desc: "Measure lesson completion, cohort retention and engagement across learning journeys.", tint: "bg-violet-50 text-violet-600" },
  { icon: ShoppingCart, name: "E-commerce Stores", desc: "Spot cart abandonment, checkout friction and product-page engagement opportunities.", tint: "bg-mint/60 text-[#0b6b58]" },
  { icon: Briefcase, name: "SaaS Products", desc: "Monitor feature adoption, onboarding efficiency, churn risk and conversion.", tint: "bg-amber-100 text-amber-600" },
  { icon: Users, name: "HR and Job Portals", desc: "Analyze candidate journeys, application funnels and weak points in hiring workflows.", tint: "bg-slate-100 text-slate-700" },
  { icon: Globe, name: "Digital Businesses", desc: "Deploy a flexible analytics layer across websites, portals and customer apps.", tint: "bg-coral-soft text-coral" },
];

export const UseCases = () => (
  <section id="use-cases" className="py-24 bg-white scroll-mt-24">
    <div className="container-x">
      <SectionHead eyebrow="Use cases" title="Built for products that live on user behaviour" />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TARGETS.map((t, i) => (
          <TiltCard key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="card-soft p-6 flex gap-4 transition-all hover:-translate-y-1">
            <span className={`shrink-0 grid place-items-center w-11 h-11 rounded-xl ${t.tint}`}><t.icon className="w-5 h-5" /></span>
            <div>
              <h3 className="text-[16.5px] font-bold text-ink">{t.name}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{t.desc}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);

/* ───────── Team ───────── */
const TEAM = [
  { name: "Arpan Jain", role: "Project Lead and Architect", linkedin: "https://linkedin.com/in/arpan-jain-42386b2a7", email: "arpanjain00123@gmail.com", phone: "+91-6399003541", lead: true },
  { name: "Pavan Patel", role: "Core Engineer", linkedin: "https://www.linkedin.com/in/pavan-patel-304334337/", email: "patelpavan7757@gmail.com", phone: "+91-6307477396" },
  { name: "Shyam Ji Patel", role: "Core Engineer", linkedin: "https://www.linkedin.com/in/shyamji-patel-32153228a/", email: "shyamjipatel2006@gmail.com", phone: "+91-9170266531" },
  { name: "Aaradhya Rathore", role: "Core Engineer", linkedin: "https://www.linkedin.com/in/aaradhya-rathore-626057332/", email: "itsaaradhyapr13@gmail.com", phone: "+91-7668302569" },
  { name: "Radhika Gupta", role: "Core Engineer", linkedin: "https://linkedin.com/in/radhika-gupta-45a954300/", email: "radhikagupta18112000@gmail.com", phone: "+91-6386541259" },
];
const TONES = ["from-[#f67963] to-[#f5a25d]", "from-[#3b2fa8] to-[#7b72d4]", "from-[#2bb89a] to-[#a1f4e6]", "from-[#f5a25d] to-[#f67963]", "from-[#5a4fc4] to-[#f67963]"];

export const TeamSection = () => (
  <section id="team" className="py-24 bg-cream/60 scroll-mt-24">
    <div className="container-x">
      <SectionHead eyebrow="Team G51" title="The people behind InsightFlow"
        sub="B.Tech (CSE) final year project, GLA University Mathura, under the guidance of Dr. Monica Dutta." />
      {/* row 1 = 3 members, row 2 = 2 members, centered */}
      <div className="mt-14 flex flex-wrap justify-center gap-6">
        {TEAM.map((m, i) => (
          <TiltCard key={m.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] glass rounded-[28px] p-7 text-center transition-shadow hover:shadow-[0_30px_70px_-30px_rgba(22,19,46,.45)]">
            <div className="relative mx-auto w-20 h-20">
              <span className={`absolute -inset-1.5 rounded-[26px] bg-gradient-to-br ${TONES[i]} opacity-30 blur-md transition-opacity group-hover:opacity-70`} />
              <span className={`relative grid place-items-center w-20 h-20 rounded-[22px] bg-gradient-to-br ${TONES[i]} text-white text-2xl font-extrabold shadow-lg ring-4 ring-white`}>
                {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
            </div>
            <h3 className="mt-5 text-[19px] font-extrabold text-ink">{m.name}</h3>
            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-bold ${m.lead ? "bg-coral text-white" : "bg-coral-soft text-coral-dark"}`}>{m.role}</span>
            <div className="mt-6 flex justify-center gap-2.5">
              <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className="grid place-items-center w-10 h-10 rounded-full bg-white border border-line text-ink-2 hover:bg-[#0a66c2] hover:text-white hover:border-transparent hover:-translate-y-0.5 transition"><Linkedin className="w-4 h-4" /></a>
              <a href={`mailto:${m.email.trim()}`} aria-label={`Email ${m.name}`} className="grid place-items-center w-10 h-10 rounded-full bg-white border border-line text-ink-2 hover:bg-coral hover:text-white hover:border-transparent hover:-translate-y-0.5 transition"><Mail className="w-4 h-4" /></a>
              <a href={`tel:${m.phone}`} aria-label={`Call ${m.name}`} className="grid place-items-center w-10 h-10 rounded-full bg-white border border-line text-ink-2 hover:bg-ink hover:text-white hover:border-transparent hover:-translate-y-0.5 transition"><Phone className="w-4 h-4" /></a>
            </div>
          </TiltCard>
        ))}
      </div>
      <p className="mt-10 text-center text-sm font-semibold text-muted">Project Supervisor: <span className="text-ink">Dr. Monica Dutta</span> · Department of Computer Engineering and Applications, GLA University Mathura</p>
    </div>
  </section>
);

/* ───────── CTA / contact (web3forms logic unchanged) ───────── */
export const CTASection = () => {
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 4000); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.target);
    formData.append("access_key", "7204ba5c-6385-4e57-bdc7-d4bf451f23c7");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await response.json();
      if (data.success) { setStatus("done"); event.target.reset(); showToast("success", "Request submitted successfully."); return; }
      setStatus(""); showToast("error", "We could not submit your request. Please try again.");
    } catch { setStatus(""); showToast("error", "Network error. Please try again in a moment."); }
  };
  const disabled = status === "loading" || status === "done";
  const field = "w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 text-sm disabled:opacity-50 transition";

  return (
    <section id="contact" className="py-24 bg-white">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`fixed top-24 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-bold shadow-xl ${toast.type === "success" ? "bg-mint text-[#0b6b58]" : "bg-coral-soft text-coral-dark"}`}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-14 md:px-16 md:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-coral/30 blur-3xl" />
          <span className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-[#5a4fc4]/40 blur-3xl" />
          <div className="relative">
            <h2 className="text-[36px] sm:text-[48px] leading-[1.1] font-extrabold text-white">Ready to see the <span className="text-coral">why</span> behind every click?</h2>
            <p className="mt-4 text-white/70 max-w-md">Tell us about your website or app and we’ll set you up with InsightFlow.</p>
            <Link to="/signup" className="mt-7 btn btn-primary">Create free account <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <form onSubmit={handleSubmit} className="relative glass !bg-white/10 !border-white/15 rounded-3xl p-6 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input name="name" required placeholder="Your name" disabled={disabled} className={field} />
              <input name="email" type="email" required placeholder="Work email" disabled={disabled} className={field} />
            </div>
            <textarea name="message" required rows={4} placeholder="Tell us about your website, app, or analytics use case." disabled={disabled} className={`${field} resize-none`} />
            <button type="submit" disabled={disabled} className="btn btn-primary w-full disabled:opacity-70">
              {status === "loading" ? <><ButtonSpinner /> Sending…</> : status === "done" ? <><CheckCircle2 className="w-4 h-4" /> Sent</> : <>Request access <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

/* ───────── Footer ───────── */
const FOOTER_COLS = [
  { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "How It Works", href: "#how-it-works" }, { label: "Use Cases", href: "#use-cases" }, { label: "Private Demo", to: "/demo" }] },
  { title: "Company", links: [{ label: "Team", href: "#team" }, { label: "Help Center", to: "/help" }, { label: "Login", to: "/login" }, { label: "Sign Up", to: "/signup" }] },
  { title: "Platform", links: [{ label: "Multi-Tenant SaaS" }, { label: "AI Insights Engine" }, { label: "Retention Prediction" }, { label: "Role-Based Access" }] },
];

export const Footer = () => (
  <footer className="bg-white border-t border-line">
    <div className="container-x py-14 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
      <div>
        <Logo />
        <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">An intelligent user behaviour analytics and predictive intelligence platform.</p>
      </div>
      {FOOTER_COLS.map((c) => (
        <div key={c.title}>
          <h4 className="text-[13px] font-extrabold text-ink uppercase tracking-wider">{c.title}</h4>
          <ul className="mt-4 space-y-2.5">
            {c.links.map((l) => (
              <li key={l.label} className="text-sm text-muted">
                {l.to ? <Link to={l.to} className="hover:text-coral">{l.label}</Link> : l.href ? <a href={l.href} className="hover:text-coral">{l.label}</a> : l.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-line">
      <div className="container-x py-5 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-muted">
        <span>© 2026 InsightFlow · Group G51, GLA University Mathura</span>
        <span>Supervisor: Dr. Monica Dutta</span>
      </div>
    </div>
  </footer>
);
