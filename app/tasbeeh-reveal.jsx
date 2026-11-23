"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";

const mark = "/identity/tasbeeh-mark.webp";

// The strokes follow the original beads. The image supplies the final bead edges and highlights.
const traces = [
  {
    path: "M 125 84 C 150 82 174 66 182 51 C 194 28 177 11 153 10 C 126 7 103 16 88 29 C 68 46 56 64 59 85 C 60 109 75 123 94 130 C 111 137 132 133 133 122 C 134 109 113 104 91 110 C 62 118 43 132 28 150 C 6 178 7 207 28 228 C 49 250 91 263 126 251 C 162 241 184 220 202 198",
    width: 23,
  },
  {
    path: "M 201 201 C 223 178 236 151 254 129 C 264 115 276 107 282 112 C 300 117 294 150 295 176 C 295 197 300 211 312 200 C 329 184 336 157 354 137 C 365 124 376 107 387 110 C 398 113 398 133 398 153 C 398 170 400 187 412 195 C 421 200 431 200 437 202",
    width: 23,
  },
  {
    path: "M 420 201 C 450 204 478 208 494 221 C 513 238 535 256 557 270",
    width: 49,
  },
];

export function TasbeehReveal() {
  const maskId = useId();
  const stage = useRef(null);
  const artwork = useRef(null);
  const fill = useRef(null);
  const strokes = useRef([]);
  const replay = useRef(null);
  const [canReplay, setCanReplay] = useState(false);

  useEffect(() => {
    const container = stage.current;
    const image = artwork.current;
    const maskFill = fill.current;
    const paths = [...strokes.current];
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    let timeline;

    function draw() {
      if (media.matches) return;
      observer?.disconnect();
      timeline?.kill();
      gsap.set(paths, { attr: { "stroke-dashoffset": 1 } });
      gsap.set(maskFill, { opacity: 0 });
      image.dataset.trace = "playing";

      timeline = gsap.timeline({
        defaults: { ease: "none" },
        onComplete: () => { image.dataset.trace = "complete"; },
      });
      timeline
        .to(paths[0], { attr: { "stroke-dashoffset": 0 }, duration: 0.92, ease: "power1.in" })
        .to(paths[1], { attr: { "stroke-dashoffset": 0 }, duration: 0.85 })
        .to(paths[2], { attr: { "stroke-dashoffset": 0 }, duration: 0.36, ease: "power1.out" }, "-=0.12")
        .to(maskFill, { opacity: 1, duration: 0.12 }, "-=0.1");
    }

    function showFinished() {
      observer?.disconnect();
      timeline?.kill();
      gsap.set(maskFill, { opacity: 1 });
      image.dataset.trace = "complete";
    }

    function syncMotionPreference() {
      setCanReplay(!media.matches);
      if (media.matches) showFinished();
    }

    replay.current = draw;
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    if (!media.matches) {
      if ("IntersectionObserver" in window) {
        image.dataset.trace = "waiting";
        observer = new IntersectionObserver(([entry]) => {
          if (entry.intersectionRatio >= 0.18) draw();
        }, { threshold: 0.18 });
        observer.observe(container);
      } else {
        draw();
      }
    }

    return () => {
      showFinished();
      media.removeEventListener("change", syncMotionPreference);
      replay.current = null;
    };
  }, []);

  return (
    <div className="mark-stage grid place-items-center" data-visual ref={stage}>
      <div className="mark-composition relative">
        <img
          className="mark-impression"
          src={mark}
          alt=""
          width="576"
          height="298"
          fetchPriority="high"
        />
        <svg
          className="mark-drawing"
          viewBox="0 0 576 298"
          role="img"
          aria-label="Everyday Muslims tasbeeh emblem"
          ref={artwork}
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="576" height="298">
              {traces.map(({ path, width }, index) => (
                <path
                  key={path}
                  d={path}
                  pathLength="1"
                  fill="none"
                  stroke="white"
                  strokeWidth={width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1 1"
                  ref={(node) => { strokes.current[index] = node; }}
                />
              ))}
              <rect ref={fill} width="576" height="298" fill="white" />
            </mask>
          </defs>
          <image href={mark} width="576" height="298" mask={`url(#${maskId})`} />
        </svg>
      </div>
      {canReplay && (
        <button type="button" className="replay-drawing inline-flex items-center" onClick={() => replay.current?.()}>
          <span aria-hidden="true">↻</span> Replay drawing
        </button>
      )}
    </div>
  );
}
