import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ───────── Robot model (procedural, no external assets, no branding) ───────── */
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.15, ...o });
const glow = (color, i = 1) => std(color, { emissive: color, emissiveIntensity: i, roughness: 0.4 });

export function buildRobot() {
  const white = std("#ffffff", { roughness: 0.2 });
  const navy = std("#16132e", { roughness: 0.15, metalness: 0.4 });
  const coralSoft = std("#f67963", { roughness: 0.35 });
  const coral = glow("#f67963", 0.9);
  const mint = glow("#7be3cb", 0.8);
  const root = new THREE.Group();
  const parts = {};

  /* head */
  const head = new THREE.Group(); head.position.y = 1.6; root.add(head); parts.head = head;
  head.add(new THREE.Mesh(new RoundedBoxGeometry(2.1, 1.6, 1.7, 6, 0.6), white));
  const face = new THREE.Mesh(new RoundedBoxGeometry(1.75, 1.1, 0.2, 4, 0.3), navy); face.position.z = 0.78; head.add(face);
  parts.eyes = [-1, 1].map((s) => { const e = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 6, 12), coral); e.position.set(s * 0.42, 0.08, 0.93); head.add(e); return e; });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 24, Math.PI), mint); mouth.rotation.z = Math.PI; mouth.position.set(0, -0.2, 0.93); head.add(mouth);
  [-1, 1].forEach((s) => { const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 32), coralSoft); ear.rotation.z = Math.PI / 2; ear.position.set(s * 1.13, 0, 0); head.add(ear); });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), navy); stem.position.y = 1.0; head.add(stem);
  parts.bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), glow("#f67963", 1)); parts.bulb.position.y = 1.3; head.add(parts.bulb);

  /* neck + torso */
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.3, 24), navy); neck.position.y = 0.62; root.add(neck);
  const body = new THREE.Group(); body.position.y = -0.1; root.add(body); parts.body = body;
  body.add(new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.5, 1.2, 6, 0.55), white));
  const panel = new THREE.Mesh(new RoundedBoxGeometry(1.05, 0.7, 0.12, 3, 0.1), navy); panel.position.set(0, 0.05, 0.6); body.add(panel);
  parts.bars = [["#f67963", 0.4], ["#8f86ff", 0.5], ["#f5a25d", 0.32]].map(([c, h], i) => {
    const g = new THREE.BoxGeometry(0.15, h, 0.05); g.translate(0, h / 2, 0);
    const b = new THREE.Mesh(g, glow(c, 0.8)); b.position.set((i - 1) * 0.3, -0.2, 0.68); body.add(b); return b;
  });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 0.35, 32), navy); base.position.y = -0.95; body.add(base);

  /* arms */
  parts.arms = [-1, 1].map((s) => {
    const arm = new THREE.Group(); arm.position.set(s * 1.1, 0.3, 0); arm.rotation.z = s * 0.22; body.add(arm);
    const up = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.65, 8, 16), white); up.position.y = -0.4; arm.add(up);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), coralSoft); hand.position.y = -0.95; arm.add(hand);
    return arm;
  });

  /* floor ring + soft shadow + orbiting data */
  parts.ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.03, 8, 80), glow("#f67963", 0.7)); parts.ring.rotation.x = Math.PI / 2; parts.ring.position.y = -1.85; root.add(parts.ring);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), new THREE.MeshBasicMaterial({ color: "#16132e", transparent: true, opacity: 0.12 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.88; root.add(shadow);
  parts.orbit = ["#f67963", "#8f86ff", "#f5a25d", "#7be3cb", "#f67963", "#8f86ff"].map((c, i) => {
    const m = new THREE.Mesh(i % 2 ? new THREE.OctahedronGeometry(0.13) : new THREE.BoxGeometry(0.2, 0.2, 0.2), glow(c, 0.6)); root.add(m); return m;
  });
  return { root, parts };
}

export function animateRobot({ root, parts }, t, mx = 0, my = 0) {
  root.position.y = Math.sin(t * 1.4) * 0.12;
  root.rotation.y += (mx * 0.35 - root.rotation.y) * 0.05;
  parts.head.rotation.y += (mx * 0.5 - parts.head.rotation.y) * 0.08;
  parts.head.rotation.x += (-my * 0.25 - parts.head.rotation.x) * 0.08;
  const blink = t % 4 > 3.85 ? 0.1 : 1; parts.eyes.forEach((e) => (e.scale.y = blink));
  parts.bulb.material.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.4;
  parts.bars.forEach((b, i) => (b.scale.y = 0.6 + 0.5 * Math.abs(Math.sin(t * 1.8 + i * 1.3))));
  parts.arms.forEach((a, i) => (a.rotation.x = Math.sin(t * 1.6 + i * 1.6) * 0.14));
  parts.ring.rotation.z = t * 0.6; parts.ring.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
  parts.orbit.forEach((m, i) => {
    const a = t * 0.7 + (i / parts.orbit.length) * Math.PI * 2;
    m.position.set(Math.cos(a) * 2.5, 0.2 + Math.sin(t * 1.2 + i) * 0.9, Math.sin(a) * 1.6);
    m.rotation.x = t + i; m.rotation.y = t * 0.8;
  });
}

/* ───────── 2D fallback (if WebGL is unavailable) ───────── */
const Fallback = () => (
  <svg viewBox="0 0 240 280" className="w-full h-full if-float" aria-label="InsightFlow assistant">
    <rect x="52" y="48" width="136" height="104" rx="34" fill="#fff" stroke="#16132e" strokeWidth="3" />
    <rect x="68" y="68" width="104" height="64" rx="22" fill="#16132e" />
    <ellipse cx="96" cy="100" rx="9" ry="12" fill="#f67963" /><ellipse cx="144" cy="100" rx="9" ry="12" fill="#f67963" />
    <rect x="70" y="160" width="100" height="72" rx="26" fill="#fff" stroke="#16132e" strokeWidth="3" />
  </svg>
);

/* ───────── Component ───────── */
const Robot3D = ({ className = "" }) => {
  const wrap = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrap.current; if (!el) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const key = new THREE.DirectionalLight("#ffffff", 1.6); key.position.set(3, 5, 6); scene.add(key);
    const rim = new THREE.PointLight("#f67963", 30, 20); rim.position.set(-4, 2, -2); scene.add(rim);
    const back = new THREE.PointLight("#8f86ff", 25, 20); back.position.set(4, 1, -3); scene.add(back);

    const robot = buildRobot(); scene.add(robot.root);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      const a = w / h; camera.position.set(0, 0.5, a < 0.9 ? 9.4 * (0.9 / a) : 9.4); camera.lookAt(0, 0.2, 0); camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    let mx = 0, my = 0, raf = 0, running = false, last = 0, time = 0;
    const onMove = (e) => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", onMove);
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const loop = (now) => {
      if (!running) return;
      time += Math.min((now - last) / 1000, 0.05) * (still ? 0.3 : 1); last = now;
      animateRobot(robot, time, mx, my); renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);

    return () => {
      running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => { o.geometry?.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => x.dispose()); });
      pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss?.(); renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-6 rounded-full bg-gradient-to-br from-[#f67963]/30 to-[#5a4fc4]/25 blur-3xl" />
      <div ref={wrap} className="relative h-full w-full">{failed && <Fallback />}</div>
    </div>
  );
};
export default Robot3D;
