"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const LINE_1 = "ARCHITECTURE";
const LINE_2 = "AS ATMOSPHERE.";
const CAPTION = "Every material is a conversation between light and intention.";

export default function CloudTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const foreRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const line1Refs = useRef<(HTMLSpanElement | null)[]>([]);
  const line2Refs = useRef<(HTMLSpanElement | null)[]>([]);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (foreRef.current) {
        gsap.fromTo(foreRef.current, { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      }
      if (midRef.current) {
        gsap.fromTo(midRef.current, { yPercent: 18 }, { yPercent: -18, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }
      if (farRef.current) {
        gsap.fromTo(farRef.current, { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.8 } });
      }

      if (prefersReducedMotion()) return;

      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 1.0, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 65%", toggleActions: "play none none none" } });
      }

      const chars1 = line1Refs.current.filter(Boolean) as HTMLSpanElement[];
      if (chars1.length) {
        gsap.set(chars1, { opacity: 0, y: 120, rotationX: 90, filter: "blur(16px)" });
        gsap.to(chars1, { opacity: 1, y: 0, rotationX: 0, filter: "blur(0px)", duration: 0.95, stagger: { each: 0.03, from: "start" }, ease: "power4.out", scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none none" } });
      }

      const chars2 = line2Refs.current.filter(Boolean) as HTMLSpanElement[];
      if (chars2.length) {
        gsap.set(chars2, { opacity: 0, y: 90, x: 18, rotationX: 70, filter: "blur(10px)" });
        gsap.to(chars2, { opacity: 1, y: 0, x: 0, rotationX: 0, filter: "blur(0px)", duration: 0.8, stagger: { each: 0.024, from: "start" }, ease: "power3.out", delay: 0.38, scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none none" } });
      }

      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.6, delay: 0.62, ease: "power4.inOut", scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none none" } });
      }

      if (captionRef.current) {
        gsap.fromTo(captionRef.current, { opacity: 0, y: 22, letterSpacing: "0.5em" }, { opacity: 1, y: 0, letterSpacing: "0.14em", duration: 1.4, delay: 0.85, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 60%", toggleActions: "play none none none" } });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh", marginTop: "220vh", zIndex: 20, mixBlendMode: "screen", background: "#000000" }} aria-label="Architecture as Atmosphere">
      <div ref={farRef} className="absolute will-change-transform pointer-events-none" style={{ inset: "-25% -10%", mixBlendMode: "screen", filter: "blur(12px)", opacity: 0.5 }}>
        <img src="/images/cloud-overlay.png" alt="" className="w-full h-full object-cover" style={{ transform: "scaleX(-1)", objectPosition: "center bottom" }} aria-hidden="true" />
      </div>
      <div ref={midRef} className="absolute will-change-transform pointer-events-none" style={{ inset: "-18% -16%", mixBlendMode: "screen", filter: "blur(3px)", opacity: 0.7 }}>
        <img src="/images/cloud-overlay.png" alt="" className="w-full h-full object-cover" style={{ objectPosition: "center bottom" }} aria-hidden="true" />
      </div>
      <div ref={foreRef} className="absolute will-change-transform pointer-events-none" style={{ inset: "-12% -22%", mixBlendMode: "screen", opacity: 0.88 }}>
        <img src="/images/cloud-overlay.png" alt="" className="w-full h-full object-cover" style={{ transform: "scaleX(-1) scaleY(1.05)", objectPosition: "center bottom" }} aria-hidden="true" />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(200,169,106,0.09) 0%, transparent 65%)" }} aria-hidden="true" />
      <div ref={labelRef} className="absolute top-10 right-10 z-10 opacity-0" aria-hidden="true">
        <span className="font-display" style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,169,106,0.42)" }}>&mdash; 02 / Atmosphere</span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ perspective: "1400px" }} aria-label={`${LINE_1} ${LINE_2}. ${CAPTION}`}>
        <div className="text-center px-6 md:px-14" style={{ transformStyle: "preserve-3d" }}>
          <div style={{ lineHeight: 0.82, marginBottom: "0.08em" }}>
            <p className="font-display select-none" style={{ fontSize: "clamp(3rem, 10.5vw, 10.5rem)", fontWeight: 800, letterSpacing: "-0.055em", color: "rgba(255,255,255,0.96)", textShadow: "0 0 80px rgba(200,169,106,0.14), 0 4px 40px rgba(0,0,0,0.65)" }} aria-hidden="true">
              {LINE_1.split("").map((char, i) => (
                <span key={i} ref={(el) => { line1Refs.current[i] = el; }} style={{ display: "inline-block", willChange: "transform, opacity, filter", backfaceVisibility: "hidden", whiteSpace: char === " " ? "pre" : undefined }}>{char}</span>
              ))}
            </p>
          </div>
          <div style={{ lineHeight: 0.9, marginBottom: "2.8rem" }}>
            <p className="font-editorial select-none" style={{ fontSize: "clamp(2rem, 7.2vw, 7.2rem)", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.025em", color: "var(--champagne)", textShadow: "0 0 60px rgba(200,169,106,0.22), 0 2px 30px rgba(0,0,0,0.55)" }} aria-hidden="true">
              {LINE_2.split("").map((char, i) => (
                <span key={i} ref={(el) => { line2Refs.current[i] = el; }} style={{ display: "inline-block", willChange: "transform, opacity, filter", backfaceVisibility: "hidden", whiteSpace: char === " " ? "pre" : undefined }}>{char}</span>
              ))}
            </p>
          </div>
          <div ref={dividerRef} className="mx-auto mb-7" style={{ width: "54px", height: "1px", backgroundColor: "rgba(200,169,106,0.36)", transformOrigin: "left center", transform: "scaleX(0)" }} aria-hidden="true" />
          <p ref={captionRef} className="font-display select-none mx-auto" style={{ fontSize: "clamp(0.56rem, 0.95vw, 0.76rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", maxWidth: "40ch" }} aria-hidden="true">{CAPTION}</p>
        </div>
      </div>
    </div>
  );
}
