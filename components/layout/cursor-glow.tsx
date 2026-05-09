"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    // Target position (raw pointer coords)
    let tx = -200;
    let ty = -200;
    // Current interpolated position
    let cx = -200;
    let cy = -200;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      // Lerp for smooth lag (factor ~0.12 ≈ spring feel without re-renders)
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate(${cx - 160}px, ${cy - 160}px)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-80 w-80 rounded-full bg-brand-500/20 blur-3xl md:block"
      style={{ transform: "translate(-200px, -200px)", willChange: "transform" }}
    />
  );
}
