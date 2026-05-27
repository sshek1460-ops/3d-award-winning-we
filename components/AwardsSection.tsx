"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import { isMobile } from "@/lib/utils";

const AWARDS = [
  {
    id: 1,
    year: "2026",
    title: "AIA Excellence in Design",
    project: "The Obsidian Villa",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    year: "2025",
    title: "Pritzker Architecture Prize (Nominee)",
    project: "AUREON Core Portfolio",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    year: "2025",
    title: "Global Luxury Real Estate Award",
    project: "Sky Canopy Residence",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    year: "2024",
    title: "ArchDaily Building of the Year",
    project: "The Glass Monolith",
    img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800"
  }
];

export default function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (isMobile()) return;
    if (!cursorRef.current || !containerRef.current) return;

    const xSet = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySet = gsap.quickSetter(cursorRef.current, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      xSet(e.clientX - 150);
      ySet(e.clientY - 200);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    if (!cursorRef.current || isMobile()) return;

    if (activeImage) {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(cursorRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [activeImage]);

  return (
    <section ref={sectionRef} className="relative w-full py-32 px-6 md:px-12 bg-[#050505] text-[var(--cloud)] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3">
          <h2 className="font-editorial italic text-5xl md:text-7xl text-[var(--cloud)] opacity-90">Recognition</h2>
          <p className="mt-6 font-display text-xs uppercase tracking-[0.2em] text-[var(--muted-ink)] opacity-60">A testament to obsession</p>
        </div>
        <div ref={containerRef} className="md:w-2/3 flex flex-col">
          {AWARDS.map((award) => (
            <div key={award.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between py-10 border-b border-white/10 cursor-pointer transition-colors hover:border-white/40" onMouseEnter={() => setActiveImage(award.img)} onMouseLeave={() => setActiveImage(null)}>
              <div className="flex items-baseline gap-6">
                <span className="font-display text-sm tracking-widest text-[var(--bronze)]">{award.year}</span>
                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">{award.title}</h3>
              </div>
              <span className="mt-4 sm:mt-0 font-editorial italic text-lg text-white/50 group-hover:text-white/80 transition-colors duration-500">{award.project}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={cursorRef} className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 overflow-hidden rounded-sm" style={{ opacity: 0, scale: 0.8 }}>
        {activeImage && <Image src={activeImage} alt="Award Winning Project" fill className="object-cover" />}
      </div>
    </section>
  );
}
