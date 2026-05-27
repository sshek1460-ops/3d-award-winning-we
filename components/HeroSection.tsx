"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, isMobile } from "@/lib/utils";

const TOTAL_FRAMES = 240;
const FRAME_PATH = "/hero-frames/ezgif-frame-";
const FRAME_EXT = ".jpg";

const pad = (n: number) => String(n).padStart(3, "0");
const frameUrl = (i: number) => `${FRAME_PATH}${pad(i)}${FRAME_EXT}`;

const COPY_SEQUENCE = [
  { text: "AUREON", type: "title" as const, start: 0, end: 15 },
  { text: "Some structures are built.", type: "line" as const, start: 12, end: 26 },
  { text: "Others are summoned.", type: "line" as const, start: 23, end: 36 },
  { text: "Private worlds.", type: "accent" as const, start: 33, end: 46 },
  { text: "Suspended beyond expectation.", type: "line" as const, start: 43, end: 58 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudForeRef = useRef<HTMLDivElement>(null);
  const cloudUltraRef = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const currentFrame = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = images.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      drawFrame(currentFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);

    let loadedCount = 0;
    let cancelled = false;
    let loadQueue: number[] = [];
    let loading = false;

    const loadImage = (index: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled || images.current[index]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[index] = img;
          loadedCount++;
          const currentProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(currentProgress);
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: currentProgress } }));
          if (index === currentFrame.current) drawFrame(index);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(index);
      });

    const processQueue = async () => {
      if (loading || cancelled) return;
      loading = true;
      while (loadQueue.length > 0 && !cancelled) {
        const batch = loadQueue.splice(0, 6);
        await Promise.all(batch.map(loadImage));
        await new Promise(r => setTimeout(r, 50));
      }
      loading = false;
    };

    const queueRange = (start: number, end: number, step = 1) => {
      for (let i = start; i <= end; i += step) {
        if (!images.current[i] && !loadQueue.includes(i)) loadQueue.push(i);
      }
      processQueue();
    };

    const preload = async () => {
      await loadImage(1);
      drawFrame(0);
      if (cancelled) return;

      queueRange(1, Math.min(60, TOTAL_FRAMES));
      await new Promise(r => setTimeout(r, 300));
      if (cancelled) return;

      queueRange(1, Math.min(120, TOTAL_FRAMES), 2);
      await new Promise(r => setTimeout(r, 300));
      if (cancelled) return;

      queueRange(1, TOTAL_FRAMES, 4);
      await new Promise(r => setTimeout(r, 500));
      if (cancelled) return;

      queueRange(1, TOTAL_FRAMES);
    };

    preload();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const mobile = isMobile();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const frameProgress = self.progress;
          const targetIndex = Math.min(
            Math.max(Math.floor(frameProgress * TOTAL_FRAMES), 1),
            TOTAL_FRAMES
          );

          let bestIndex = targetIndex;
          if (!images.current[targetIndex]) {
            bestIndex = 1;
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
              const lo = targetIndex - offset;
              const hi = targetIndex + offset;
              if (lo >= 1 && images.current[lo]) { bestIndex = lo; break; }
              if (hi <= TOTAL_FRAMES && images.current[hi]) { bestIndex = hi; break; }
            }
          }

          if (bestIndex !== currentFrame.current) {
            currentFrame.current = bestIndex;
            drawFrame(bestIndex);
          }
        },
      });

      if (bloomRef.current) {
        gsap.fromTo(
          bloomRef.current,
          { opacity: 0.05 },
          { opacity: 0.45, ease: "none", scrollTrigger: { trigger: wrapper, start: "top top", end: mobile ? "30% bottom" : "55% bottom", scrub: 1 } }
        );
      }

      if (cloudBackRef.current && cloudMidRef.current && cloudForeRef.current && cloudUltraRef.current && fogRef.current) {
        const cloudStart = mobile ? "25%" : "55%";
        const cloudEnd = mobile ? "60%" : "95%";
        const cloudTl = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: `${cloudStart} top`, end: `${cloudEnd} top`, scrub: true },
        });

        cloudTl.fromTo(cloudBackRef.current, { y: "100vh", opacity: 0 }, { y: "-150vh", opacity: 0.8, duration: 1.5, ease: "none" }, 0);
        cloudTl.fromTo(cloudMidRef.current, { y: "100vh", opacity: 0 }, { y: "-180vh", opacity: 0.9, duration: 1.5, ease: "none" }, 0.15);
        cloudTl.fromTo(cloudForeRef.current, { y: "110vh", opacity: 0 }, { y: "-220vh", opacity: 1, duration: 1.5, ease: "none" }, 0.3);
        cloudTl.fromTo(cloudUltraRef.current, { y: "120vh", opacity: 0 }, { y: "-260vh", opacity: 1, duration: 1.5, ease: "none" }, 0.45);
        cloudTl.fromTo(fogRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.in" }, 0.8);
      }

      if (finalTextRef.current) {
        gsap.fromTo(
          finalTextRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", scrollTrigger: { trigger: wrapper, start: mobile ? "45% top" : "75% top", end: mobile ? "65% top" : "95% top", scrub: true } }
        );
      }

      copyRefs.current.forEach((el, i) => {
        if (!el) return;

        const { start, end } = COPY_SEQUENCE[i];
        const adjustedStart = mobile ? Math.round(start * 0.5) : start;
        const adjustedEnd = mobile ? Math.round(end * 0.5) : end;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: `${adjustedStart}% top`, end: `${adjustedEnd}% top`, scrub: 1 },
        });

        const entries = [
          { rotationX: 10, rotationY: -5 },
          { rotationX: -5, rotationY: 5 },
          { rotationX: 5, rotationY: -10 },
          { rotationX: 0, rotationY: 10 },
          { rotationX: -10, rotationY: 0 },
        ];
        const entry = entries[i % entries.length];

        if (i === 4) {
          tl.fromTo(el, { opacity: 0, z: -1000, x: "20vw", scale: 0.8, ...entry }, { opacity: 1, z: 0, x: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" });
          tl.to(el, { opacity: 0, z: 800, x: "-100vw", scale: 1.5, rotationY: -30, duration: 0.6, ease: "power2.in" });
        } else {
          tl.fromTo(el, { opacity: 0, z: -1500, scale: 0.6, ...entry }, { opacity: 1, z: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" });
          tl.to(el, { opacity: 0, z: 1500, scale: 2.5, duration: 0.6, ease: "power2.in" });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({ delay: 2.0 });

    if (overlayRef.current) {
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    }

    if (copyRefs.current[0]) {
      tl.fromTo(copyRefs.current[0], { opacity: 0, y: 60, scale: 0.88 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }, 0.2);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
      aria-label="Hero \u2014 Scroll to explore"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg, rgba(23,19,15,0.3) 0%, rgba(23,19,15,0.0) 30%, rgba(23,19,15,0.0) 60%, rgba(23,19,15,0.45) 100%),
            linear-gradient(90deg, rgba(23,19,15,0.2) 0%, transparent 25%, transparent 75%, rgba(23,19,15,0.2) 100%)
          `,
        }}
        aria-hidden="true"
      />

      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: "radial-gradient(ellipse 65% 45% at 50% 25%, rgba(200,169,106,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div
        ref={fogRef}
        className="absolute inset-0 pointer-events-none z-[4] opacity-0"
        style={{ background: "#e8e5df" }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none z-[5] overflow-visible"
        style={{ mixBlendMode: "screen" }}
      >
        <div ref={cloudBackRef} className="absolute inset-0" style={{ mixBlendMode: "screen", filter: "blur(8px)" }}>
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover" style={{ transform: "scale(1.4)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)" }} />
        </div>
        <div ref={cloudMidRef} className="absolute inset-0" style={{ mixBlendMode: "screen", filter: "blur(4px)" }}>
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover" style={{ transform: "scaleX(-1) scaleY(1.2)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)" }} />
        </div>
        <div ref={cloudForeRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover" style={{ transform: "scale(1.1)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)" }} />
        </div>
        <div ref={cloudUltraRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover" style={{ transform: "scaleX(-1.3) scaleY(1.3)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)" }} />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-[5]" style={{ perspective: "1000px" }}>
        <div className="relative w-full max-w-[90vw] text-center" style={{ transformStyle: "preserve-3d" }}>
          {COPY_SEQUENCE.map((item, i) => (
            <div
              key={i}
              ref={(el) => { copyRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform"
              style={{ backfaceVisibility: "hidden" }}
            >
              {item.type === "title" ? (
                <h1 className="font-display select-none" style={{ fontSize: "clamp(4rem, 13vw, 13rem)", lineHeight: 0.85, letterSpacing: "-0.07em", fontWeight: 700, color: "var(--cloud)", textShadow: "0 4px 60px rgba(0,0,0,0.45), 0 0 120px rgba(200,169,106,0.12)" }}>
                  {item.text}
                </h1>
              ) : item.type === "accent" ? (
                <p className="font-editorial select-none" style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400, fontStyle: "italic", color: "var(--champagne)", textShadow: "0 4px 40px rgba(0,0,0,0.8), 0 0 80px rgba(200,169,106,0.4)" }}>
                  {item.text}
                </p>
              ) : (
                <p className="font-display select-none max-w-4xl mx-auto uppercase" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", lineHeight: 1.5, letterSpacing: "0.2em", fontWeight: 500, color: "var(--cloud)", textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 0 100px rgba(0,0,0,0.6)" }}>
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div ref={finalTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-[6] opacity-0 pointer-events-none" style={{ perspective: "1400px" }}>
        <div className="text-center px-6 md:px-14 flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
          <div className="relative z-10" style={{ lineHeight: 0.85 }}>
            <h2 className="font-display select-none uppercase" style={{ fontSize: "clamp(3.5rem, 11vw, 13rem)", fontWeight: 500, letterSpacing: "-0.03em", color: "#161412" }}>
              Architecture
            </h2>
          </div>
          <div className="relative z-20" style={{ lineHeight: 0.7, marginTop: "-0.25em", marginBottom: "3rem" }}>
            <p className="font-editorial select-none" style={{ fontSize: "clamp(2.5rem, 9.5vw, 11rem)", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.01em", color: "#9a8566" }}>
              as atmosphere.
            </p>
          </div>
          <div className="relative z-10 opacity-70">
            <p className="font-display select-none mx-auto" style={{ fontSize: "clamp(0.56rem, 0.9vw, 0.75rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#161412", maxWidth: "40ch", fontWeight: 500 }}>
              Every material is a conversation between light and intention.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-3 opacity-60">
        <span className="uppercase font-medium" style={{ fontSize: "0.5625rem", letterSpacing: "0.3em", color: "var(--cloud)" }}>
          Scroll to explore
        </span>
        <div className="w-[1px] h-10 relative overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full bg-white/40" style={{ animation: "heroScrollPulse 2.4s ease-in-out infinite" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes heroScrollPulse {
          0%, 100% { transform: scaleY(0.2); opacity: 0.2; transform-origin: top; }
          50% { transform: scaleY(1); opacity: 0.6; transform-origin: top; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes heroScrollPulse { 0%, 100% { opacity: 0.4; } }
        }
      `}</style>
    </section>
  );
}
