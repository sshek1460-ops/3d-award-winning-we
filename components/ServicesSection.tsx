"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn, isMobile } from "@/lib/utils";

const SERVICES = [
  {
    id: "rent",
    title: "Rent",
    italic: false,
    label: "Curated temporary estates for the modern nomad.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "sell",
    title: "Sell",
    italic: true,
    label: "Pass the torch of your legacy to the next visionary.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "buy",
    title: "Buy",
    italic: false,
    label: "Acquire your impossible world and shape reality.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800",
  }
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (mobile) {
    return (
      <section className="w-full flex flex-col bg-[var(--background)]" style={{ borderTop: "1px solid rgba(180,170,155,0.2)", borderBottom: "1px solid rgba(180,170,155,0.2)" }}>
        {SERVICES.map((service, index) => (
          <div key={service.id} className="relative w-full h-[60vh] overflow-hidden" style={{ borderBottom: index < 2 ? "1px solid rgba(180,170,155,0.2)" : "none" }}>
            <Image src={service.image} alt={service.title} fill quality={60} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-8 text-center">
              <h2 className={cn(service.italic ? "font-editorial italic" : "font-display font-bold uppercase")} style={{ fontSize: "clamp(4rem, 15vw, 10rem)", color: "var(--cloud)", letterSpacing: "-0.04em", lineHeight: 0.85 }}>
                {service.title}
              </h2>
              <div className="flex items-center gap-3 mt-6 mb-3">
                <div style={{ width: "1.5rem", height: "1px", backgroundColor: "var(--bronze)" }} />
                <span className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--bronze)" }}>Explore</span>
                <div style={{ width: "1.5rem", height: "1px", backgroundColor: "var(--bronze)" }} />
              </div>
              <p className="font-editorial" style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.85)", maxWidth: "20rem" }}>{service.label}</p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="w-full flex flex-row overflow-hidden" style={{ height: "100vh", backgroundColor: "var(--background)", borderTop: "1px solid rgba(180,170,155,0.2)", borderBottom: "1px solid rgba(180,170,155,0.2)" }}>
      {SERVICES.map((service, index) => {
        const isHovered = hoveredIndex === index;
        const isOthersHovered = hoveredIndex !== null && hoveredIndex !== index;

        return (
          <div
            key={service.id}
            onClick={() => console.log(`Clicked ${service.title}`)}
            className="relative cursor-pointer overflow-hidden group"
            style={{
              flex: isHovered ? "2.5 1 0%" : isOthersHovered ? "0.5 1 0%" : "1 1 0%",
              transition: "flex 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              borderRight: index < 2 ? "1px solid rgba(180,170,155,0.2)" : "none",
              height: "100%",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="absolute inset-0 z-0" style={{ transform: isHovered ? "scale(1)" : "scale(1.1)", transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <Image src={service.image} alt={service.title} fill quality={60} sizes="50vw" style={{ objectFit: "cover", opacity: isHovered ? 1 : 0, transition: "opacity 0.8s ease" }} />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)", opacity: isHovered ? 1 : 0, transition: "opacity 0.8s ease" }} />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center" style={{ padding: "2rem" }}>
              <h2
                className={cn(service.italic ? "font-editorial italic" : "font-display font-bold uppercase")}
                style={{
                  fontSize: isHovered ? "clamp(6rem, 12vw, 15rem)" : isOthersHovered ? "clamp(2rem, 4vw, 5rem)" : "clamp(4rem, 8vw, 10rem)",
                  color: isHovered ? "var(--cloud)" : isOthersHovered ? "var(--stone)" : "var(--ink)",
                  letterSpacing: service.italic ? "normal" : "-0.04em",
                  lineHeight: 0.8,
                  whiteSpace: "nowrap",
                  transform: isHovered ? "translateY(-3rem)" : "translateY(0)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {service.title}
              </h2>

              <div
                className="absolute flex flex-col items-center text-center"
                style={{
                  bottom: "4rem",
                  left: "2rem",
                  right: "2rem",
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0)" : "translateY(2.5rem)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: isHovered ? "0.1s" : "0s",
                  pointerEvents: isHovered ? "auto" : "none",
                }}
              >
                <div className="flex items-center gap-4" style={{ marginBottom: "1rem" }}>
                  <div style={{ width: "2rem", height: "1px", backgroundColor: "var(--bronze)" }} />
                  <span className="font-display" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--bronze)" }}>Explore</span>
                  <div style={{ width: "2rem", height: "1px", backgroundColor: "var(--bronze)" }} />
                </div>
                <p className="font-editorial" style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)", color: "rgba(255,255,255,0.9)", maxWidth: "24rem" }}>{service.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
