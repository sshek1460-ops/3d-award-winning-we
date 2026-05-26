"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export default function BespokeCraftSection() {
  const containerRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!rightRef.current) return;
      const images = rightRef.current.querySelectorAll('.img-card');

      images.forEach((img, index) => {
        gsap.fromTo(img, { y: 100 * (index + 1) }, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-32 bg-[var(--background)] overflow-hidden border-t border-[var(--stone)]/20">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-16 md:gap-8">
        <div className="w-full md:w-5/12 h-full flex flex-col items-start justify-center">
          <div ref={leftRef} className="sticky top-1/3 w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-[var(--bronze)]" />
              <span className="font-display text-xs tracking-[0.2em] uppercase text-[var(--bronze)]">The Anatomy of Space</span>
            </div>

            <h2 className="font-display font-bold uppercase text-[clamp(4rem,8vw,8rem)] leading-[0.85] tracking-tighter text-[var(--ink)] mb-6">
              Crafted <br/>
              <span className="font-editorial italic font-light lowercase text-[var(--stone)] text-[clamp(4.5rem,9vw,9rem)]">for eternity.</span>
            </h2>

            <p className="font-sans text-xl text-[var(--ink)]/70 max-w-sm font-light leading-relaxed">
              We do not build houses. We construct monolithic sanctuaries that bathe in natural light, utilizing ancient stone and cutting-edge glass to shape the ultimate living experience.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="w-full md:w-7/12 flex flex-col items-end gap-16 md:gap-32 pt-16 md:pt-48">
          <div className="img-card relative w-full md:w-[85%] aspect-[4/5] bg-[var(--stone)]/10 overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800" alt="Light-filled travertine staircase" fill className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <div className="absolute inset-0 border border-[var(--ink)]/5 pointer-events-none" />
          </div>

          <div className="img-card relative w-[90%] md:w-[75%] aspect-[3/4] bg-[var(--stone)]/10 overflow-hidden group mr-auto md:mr-0 md:-ml-32">
            <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" alt="Panoramic sunlit living space" fill className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <div className="absolute inset-0 border border-[var(--ink)]/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
