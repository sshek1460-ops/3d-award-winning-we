"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function ConciergeSection() {
  const containerRef = useRef<HTMLElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const fill = btn.querySelector('.btn-fill');
    gsap.to(fill, { y: '0%', duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const fill = btn.querySelector('.btn-fill');
    gsap.to(fill, { y: '100%', duration: 0.4, ease: "power2.in" });
  };

  return (
    <section ref={containerRef} className="w-full py-48 bg-[var(--background)] flex items-center justify-center border-t border-[var(--stone)]/20">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-[1px] bg-[var(--bronze)]" />
          <span className="font-display text-xs tracking-[0.3em] uppercase text-[var(--bronze)]">Off-Market Portfolio</span>
          <div className="w-12 h-[1px] bg-[var(--bronze)]" />
        </div>
        <h2 className="font-editorial italic text-[clamp(3rem,6vw,6rem)] leading-[1.1] text-[var(--ink)] mb-8">The most extraordinary estates <br className="hidden md:block"/> never reach the open market.</h2>
        <p className="font-sans text-xl text-[var(--ink)]/60 max-w-2xl mb-16 font-light">They are whispered about, traded quietly, and reserved for the few. Enter your credentials to request an audience with our private concierge.</p>
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-lg">
          <input type="email" placeholder="Enter your email address" className="w-full bg-transparent border-b border-[var(--stone)]/40 pb-4 text-center md:text-left text-xl text-[var(--ink)] placeholder:text-[var(--stone)] focus:outline-none focus:border-[var(--bronze)] transition-colors" />
          <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative px-8 py-4 overflow-hidden rounded-full border border-[var(--ink)] text-[var(--ink)] font-display text-sm tracking-widest uppercase transition-colors hover:text-white">
            <span className="relative z-10 flex items-center gap-3">Request Key</span>
            <div className="btn-fill absolute inset-0 bg-[var(--ink)] translate-y-[100%] rounded-full z-0" />
          </button>
        </div>
      </div>
    </section>
  );
}
