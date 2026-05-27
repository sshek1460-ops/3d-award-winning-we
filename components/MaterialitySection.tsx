"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, isMobile } from "@/lib/utils";

const MATERIALS = [
  {
    id: "travertine",
    name: "Roman Travertine",
    desc: "Cut like silence. A porous, ancient stone that breathes with the landscape.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
    bgColor: "#e8e5df",
    textColor: "#161412"
  },
  {
    id: "bronze",
    name: "Brushed Bronze",
    desc: "Tuned to hold the sun. A living metal that records the passage of time.",
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800",
    bgColor: "#2a241f",
    textColor: "#e8e5df"
  },
  {
    id: "oak",
    name: "Smoked Oak",
    desc: "Warmth forged in shadow. Deep, resilient timber that anchors the space.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
    bgColor: "#161412",
    textColor: "#d0c3ab"
  }
];

export default function MaterialitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const section = sectionRef.current;
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: !mobile,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      if (mobile) {
        // Simple fade-in on scroll for mobile
        gsap.set(imgRefs.current[0], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(imgRefs.current[1], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(imgRefs.current[2], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(textRefs.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(imgRefs.current[0], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
      gsap.set(imgRefs.current[1], { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
      gsap.set(imgRefs.current[2], { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
      gsap.set(textRefs.current[0], { opacity: 1, y: 0 });
      gsap.set(textRefs.current[1], { opacity: 0, y: 40 });
      gsap.set(textRefs.current[2], { opacity: 0, y: 40 });

      tl.addLabel("trans1");
      tl.to(imgRefs.current[1], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "power2.inOut" }, "trans1");
      tl.to(bgRef.current, { backgroundColor: MATERIALS[1].bgColor, ease: "power2.inOut" }, "trans1");
      tl.to(textRefs.current[0], { opacity: 0, y: -40, ease: "power2.inOut" }, "trans1");
      tl.to(textRefs.current[1], { opacity: 1, y: 0, ease: "power2.inOut" }, "trans1");
      tl.to({}, { duration: 0.2 });

      tl.addLabel("trans2");
      tl.to(imgRefs.current[2], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "power2.inOut" }, "trans2");
      tl.to(bgRef.current, { backgroundColor: MATERIALS[2].bgColor, ease: "power2.inOut" }, "trans2");
      tl.to(textRefs.current[1], { opacity: 0, y: -40, ease: "power2.inOut" }, "trans2");
      tl.to(textRefs.current[2], { opacity: 1, y: 0, ease: "power2.inOut" }, "trans2");
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="materiality" className="relative w-full md:h-screen overflow-hidden" aria-label="Materiality \u2014 The Anatomy of Luxury">
      <div ref={bgRef} className="absolute inset-0 z-0 transition-colors duration-300" style={{ backgroundColor: MATERIALS[0].bgColor }} />
      <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-5/12 h-1/2 md:h-full flex flex-col justify-center relative pt-20 md:pt-0">
          <div className="mb-8">
            <span className="uppercase font-medium block" style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: "var(--bronze)" }}>The Anatomy of Luxury</span>
            <div className="w-12 h-[1px] mt-4" style={{ backgroundColor: "var(--bronze)", opacity: 0.5 }} />
          </div>
          <div className="relative h-[250px] md:h-[400px] w-full">
            {MATERIALS.map((mat, i) => (
              <div key={mat.id} ref={(el) => { textRefs.current[i] = el; }} className="absolute top-0 left-0 w-full flex flex-col" style={{ color: mat.textColor }}>
                <h2 className="font-display uppercase mb-6" style={{ fontSize: "clamp(3rem, 6vw, 6rem)", lineHeight: 0.9, letterSpacing: "-0.02em", fontWeight: 500 }}>{mat.name}</h2>
                <p className="font-editorial italic max-w-sm" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", lineHeight: 1.3, opacity: 0.8 }}>{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-6/12 h-1/2 md:h-full flex items-center justify-center md:justify-end pb-10 md:pb-0">
          <div className="relative w-full md:w-[90%] aspect-[4/5] md:aspect-[3/4] overflow-hidden" style={{ borderRadius: "2px" }}>
            {MATERIALS.map((mat, i) => (
              <div key={mat.id} ref={(el) => { imgRefs.current[i] = el; }} className="absolute inset-0 w-full h-full will-change-transform" style={{ zIndex: i + 1 }}>
                <Image src={mat.image} alt={mat.name} fill quality={85} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
