import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* Scroll-reveal wrapper */
export const Reveal = ({ children, delay = 0, y = 24, className = "", as = "div" }) => {
  const M = motion[as] || motion.div;
  return <M initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</M>;
};

/* Count-up that starts when visible */
export const CountUp = ({ to, duration = 1400, prefix = "", suffix = "", decimals = 0 }) => {
  const ref = useRef(null), inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf, start;
    const step = (t) => { start ??= t; const p = Math.min((t - start) / duration, 1); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{v.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>;
};
