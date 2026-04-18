"use client";

import { useEffect, useRef, useState } from "react";

const BRAND = {
  navy: "#0D2432",
  green: "#1D9476",
  cream: "#F8F8F6",
};

const STAGE_W = 3840;
const STAGE_H = 2400;
const STAGE_CX = STAGE_W / 2;
const STAGE_CY = STAGE_H / 2;

const ICON_PATH_D = "M240 199 L279 199 L279 329 L236 371 L235 262 L176 262 Z";
const ICON_DOT = { cx: 257, cy: 150.5, r: 26 };
const ICON_CX = 229.5;
const ICON_CY = 248;

const DURATION = 5.2;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const outQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const outExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function IconMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      shapeRendering="geometricPrecision"
      style={{ display: "block" }}
    >
      <path d={ICON_PATH_D} fill={BRAND.green} />
      <circle
        cx={ICON_DOT.cx}
        cy={ICON_DOT.cy}
        r={ICON_DOT.r}
        fill={BRAND.navy}
      />
    </svg>
  );
}

export function IteronLogoAnimation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const lastTsRef = useRef<number | null>(null);
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setScale(w / STAGE_W);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const step = (ts: number) => {
        if (lastTsRef.current == null) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        setTime((t) => {
          const next = t + dt;
          if (next >= DURATION) return DURATION;
          return next;
        });
        if (lastTsRef.current != null) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Stop the RAF loop once duration is reached so we don't keep scheduling.
  useEffect(() => {
    if (time >= DURATION && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [time]);

  const T = {
    iconIn: 0.0,
    iconInEnd: 0.9,
    iconHoldEnd: 1.2,
    iconMove: 1.2,
    iconMoveEnd: 1.75,
    reveal: 1.7,
    revealEnd: 2.8,
    tag: 2.85,
    tagEnd: 3.75,
  };

  const WM_W = 1400;
  const wmScale = WM_W / 500;
  const wmContentH = 87 * wmScale;
  const GAP = 120;
  const tagInkH = 100;
  const groupH = wmContentH + GAP + tagInkH;
  const groupTop = STAGE_CY - groupH / 2;
  const WM_CONTENT_CY = groupTop + wmContentH / 2;
  const WM_LEFT = STAGE_CX - 250 * wmScale;
  const WM_TOP = WM_CONTENT_CY - 249.5 * wmScale;

  const wmIconLeftDisp = WM_LEFT + 88 * wmScale;
  const wmIconRightDisp = WM_LEFT + 126 * wmScale;
  const wmIconTopDisp = WM_TOP + 206 * wmScale;
  const wmIconBottomDisp = WM_TOP + 293 * wmScale;
  const wmIconCxDisp = (wmIconLeftDisp + wmIconRightDisp) / 2;
  const wmIconCyDisp = (wmIconTopDisp + wmIconBottomDisp) / 2;
  const wmIconHDisp = wmIconBottomDisp - wmIconTopDisp;

  const iEndScale = wmIconHDisp / 250;
  const ICON_END_SIZE = 500 * iEndScale;
  const iEndLeft = wmIconCxDisp - ICON_CX * iEndScale;
  const iEndTop = wmIconCyDisp - ICON_CY * iEndScale;

  const ICON_START_SIZE = 500 * 3.84;
  const iStartScale = ICON_START_SIZE / 500;
  const iStartLeft = STAGE_CX - ICON_CX * iStartScale;
  const iStartTop = STAGE_CY - ICON_CY * iStartScale;

  let iconOpacity = 0;
  let iconSize = ICON_START_SIZE;
  let iconLeft = iStartLeft;
  let iconTop = iStartTop;

  const t = time;
  if (t < T.iconInEnd) {
    const p = outCubic(clamp((t - T.iconIn) / (T.iconInEnd - T.iconIn), 0, 1));
    iconOpacity = p;
    const s = 0.78 + 0.22 * p;
    iconSize = ICON_START_SIZE * s;
    iconLeft = STAGE_CX - ICON_CX * (iconSize / 500);
    iconTop = STAGE_CY - ICON_CY * (iconSize / 500);
  } else if (t < T.iconMove) {
    iconOpacity = 1;
  } else if (t < T.iconMoveEnd) {
    const p = inOutCubic(
      clamp((t - T.iconMove) / (T.iconMoveEnd - T.iconMove), 0, 1)
    );
    iconOpacity = 1;
    iconSize = ICON_START_SIZE + (ICON_END_SIZE - ICON_START_SIZE) * p;
    iconLeft = iStartLeft + (iEndLeft - iStartLeft) * p;
    iconTop = iStartTop + (iEndTop - iStartTop) * p;
  } else {
    iconOpacity = 1;
    iconSize = ICON_END_SIZE;
    iconLeft = iEndLeft;
    iconTop = iEndTop;
  }

  const revealStartX = WM_LEFT + 131 * wmScale;
  const revealEndX = WM_LEFT + 412 * wmScale;
  const revealP = clamp((t - T.reveal) / (T.revealEnd - T.reveal), 0, 1);
  const revealEased = outQuart(revealP);
  const revealCur = revealStartX + (revealEndX - revealStartX) * revealEased;
  const clipInsetLeft = Math.max(0, revealStartX - WM_LEFT);
  const clipInsetRight = Math.max(0, WM_W - (revealCur - WM_LEFT));
  const wordmarkVisible = t >= T.reveal;

  const tagP = clamp((t - T.tag) / (T.tagEnd - T.tag), 0, 1);
  const tagEased = outExpo(tagP);
  const tagOpacity = tagEased;
  const tagTy = (1 - tagEased) * 54;

  const holdStart = T.tagEnd + 0.15;
  const breathP = clamp((t - holdStart) / 1.2, 0, 1);
  const breath = 1 + 0.005 * Math.sin(breathP * Math.PI);

  const TAG_TOP = WM_TOP + 293 * wmScale + GAP - 30;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${STAGE_W} / ${STAGE_H}`,
        overflow: "hidden",
      }}
      aria-label="Iteron logo animation"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${breath})`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {wordmarkVisible && (
            <div
              style={{
                position: "absolute",
                left: WM_LEFT,
                top: WM_TOP,
                width: WM_W,
                height: WM_W,
                clipPath: `inset(0px ${clipInsetRight}px 0px ${clipInsetLeft}px)`,
                WebkitClipPath: `inset(0px ${clipInsetRight}px 0px ${clipInsetLeft}px)`,
              }}
            >
              <img
                src="/iteron-logo-full.png"
                alt=""
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  userSelect: "none",
                }}
              />
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: iconLeft,
              top: iconTop,
              width: iconSize,
              height: iconSize,
              opacity: iconOpacity,
              willChange: "transform, opacity, left, top, width, height",
            }}
          >
            <IconMark size={iconSize} />
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: TAG_TOP,
              textAlign: "center",
              opacity: tagOpacity,
              transform: `translateY(${tagTy}px)`,
              willChange: "transform, opacity",
              fontFamily:
                'var(--font-cormorant), "Cormorant Garamond", "Times New Roman", serif',
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 140,
              letterSpacing: "-0.005em",
              color: BRAND.navy,
              lineHeight: 1,
            }}
          >
            Every click{" "}
            <span style={{ color: BRAND.green, fontWeight: 600 }}>
              optimized
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
