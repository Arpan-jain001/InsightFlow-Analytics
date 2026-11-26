import { motion } from "framer-motion";
import TiltCard from "./ui/TiltCard";
import { Shield, BarChart3, Brain, MessageSquare, Settings, GraduationCap, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: TrendingUp, title: "Predictive Visitor Retention", desc: "Logistic Regression, Random Forest and XGBoost are compared to predict which visitors will return.", tint: "bg-coral-soft text-coral" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Monitor DAU, MAU, page activity, funnels and retention from one live dashboard.", tint: "bg-violet-50 text-violet-600" },
  { icon: Brain, title: "AI Insights Engine", desc: "Gemini turns raw event streams into recommendations and plain-language summaries.", tint: "bg-mint/60 text-[#0b6b58]" },
  { icon: MessageSquare, title: "Analytics Chat Assistant", desc: "Ask questions about drop-offs and engagement without writing a single query.", tint: "bg-amber-100 text-amber-600" },
  { icon: Shield, title: "Authentication and Access", desc: "JWT, Google OAuth, role-based access and multi-tenant data isolation for every organization.", tint: "bg-slate-100 text-slate-700" },
  { icon: Settings, title: "Workspace Control", desc: "Manage projects, API keys, members and alerts across each tracked product.", tint: "bg-coral-soft text-coral" },
  { icon: GraduationCap, title: "Exam and Coaching Analytics", desc: "Question difficulty, student exits and time-per-question for academic platforms.", tint: "bg-violet-50 text-violet-600" },
];

const SectionHead = ({ eyebrow, title, sub }) => (
  <div className="max-w-2xl mx-auto text-center">
    <span className="eyebrow">{eyebrow}</span>
    <h2 className="mt-4 text-[36px] sm:text-[48px] leading-[1.1] font-extrabold text-ink">{title}</h2>
    {sub && <p className="mt-4 text-muted text-[16px] leading-relaxed">{sub}</p>}
  </div>
);
export { SectionHead };

const Features = () => (
  <section id="features" className="py-24 bg-white scroll-mt-24">
    <div className="container-x">
      <SectionHead eyebrow="Features" title="Everything you need to grow with confidence" sub="Descriptive analytics, machine-learning predictions and AI explanations in a single dashboard." />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <TiltCard key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className={`card-soft p-7 transition-all hover:-translate-y-1 ${i === 0 ? "lg:col-span-2 bg-gradient-to-br from-cream to-white" : ""}`}>
            <span className={`grid place-items-center w-12 h-12 rounded-2xl ${f.tint}`}><f.icon className="w-6 h-6" /></span>
            <h3 className="mt-5 text-[19px] font-bold text-ink">{f.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{f.desc}</p>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);
export default Features;
