"use client";

import { useEffect, useRef, useState } from "react";

export function IteronLogoAnimation() {
  const ref = useRef<SVGSVGElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played) {
          setPlayed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [played]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Iteron logo mark"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Dot — drops in from above */}
      <circle
        cx="257"
        cy="150.5"
        r="26"
        fill="#0F1F2E"
        style={
          played
            ? {
                animation: "logoDotDrop 0.55s cubic-bezier(.34,1.56,.64,1) forwards",
              }
            : { opacity: 0 }
        }
      />

      {/* Body — clip-revealed downward */}
      <clipPath id="logoBodyReveal">
        <rect
          x="170"
          y="195"
          width="115"
          height="0"
          style={
            played
              ? {
                  animation:
                    "logoBodyGrow 0.72s cubic-bezier(.4,0,.2,1) 0.3s forwards",
                }
              : {}
          }
        />
      </clipPath>

      <path
        d="M240 199 L279 199 L279 329 L236 371 L235 262 L176 262 Z"
        fill="#1D9E75"
        clipPath="url(#logoBodyReveal)"
      />

      <style>{`
        @keyframes logoDotDrop {
          0%   { opacity: 0; transform: translateY(-28px); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoBodyGrow {
          0%   { height: 0; }
          100% { height: 185px; }
        }
      `}</style>
    </svg>
  );
}
