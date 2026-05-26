"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

interface SplitTextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  trigger?: string;
  delay?: number;
  stagger?: number;
  scrub?: boolean | number;
}

export default function SplitTextReveal({
  children,
  className,
  as: Tag = "p",
  trigger,
  delay = 0,
  stagger = 0.04,
  scrub = false,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || hasAnimated.current) return;

    const container = containerRef.current;
    if (!container) return;

    const text = container.textContent || "";
    const words = text.split(" ");
    container.innerHTML = "";

    words.forEach((word, i) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.overflow = "hidden";
      wordSpan.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.textContent = word;
      inner.style.display = "inline-block";
      inner.style.transform = "translateY(100%)";
      inner.style.opacity = "0";
      inner.className = "split-word";

      wordSpan.appendChild(inner);
      container.appendChild(wordSpan);

      if (i < words.length - 1) {
        const space = document.createTextNode("\u00A0");
        container.appendChild(space);
      }
    });

    const wordEls = container.querySelectorAll(".split-word");

    const scrollConfig: ScrollTrigger.Vars = {
      trigger: trigger || container,
      start: "top 85%",
      end: "top 30%",
    };

    if (scrub) {
      scrollConfig.scrub = typeof scrub === "number" ? scrub : 1;
    } else {
      scrollConfig.toggleActions = "play none none none";
    }

    gsap.to(wordEls, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger,
      delay,
      ease: "power3.out",
      scrollTrigger: scrollConfig,
    });

    hasAnimated.current = true;

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === (trigger || container)) {
          st.kill();
        }
      });
    };
  }, [children, trigger, delay, stagger, scrub]);

  return (
    <Tag ref={containerRef as any} className={cn("overflow-hidden", className)}>
      {children}
    </Tag>
  );
}
