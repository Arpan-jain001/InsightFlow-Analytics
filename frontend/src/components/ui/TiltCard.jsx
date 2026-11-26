import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* 3D tilt + mouse-follow spotlight. Drop-in replacement for <motion.div>. */
const TiltCard = ({ children, className = "", max = 7, style, ...rest }) => {
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 220, damping: 18 }), sy = useSpring(ry, { stiffness: 220, damping: 18 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2); rx.set((0.5 - py) * max * 2);
    e.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    e.currentTarget.style.setProperty("--my", `${py * 100}%`);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div {...rest} onMouseMove={move} onMouseLeave={leave}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900, ...style }}
      className={`spot relative ${className}`}>
      {children}
    </motion.div>
  );
};
export default TiltCard;
