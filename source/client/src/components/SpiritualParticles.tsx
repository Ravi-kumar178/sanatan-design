// SpiritualParticles — minimal floating lotus petals + rudraksha beads
// Inspired by Sanatan tradition. Intentionally subtle — opacity max 0.5.
import { useEffect, useRef } from 'react';
import Image from "@/components/Image";

// Lotus petal SVG path (simplified 5-petal lotus)
const LOTUS_PETAL = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" fill="none">
  <path d="M12 30 C6 22 2 14 6 6 C8 2 12 0 12 0 C12 0 16 2 18 6 C22 14 18 22 12 30Z"
    fill="rgba(249,115,22,0.55)" />
</svg>`;

// Rudraksha bead SVG (small circle with ridges)
const RUDRAKSHA = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
  <circle cx="10" cy="10" r="8" fill="rgba(120,53,15,0.45)" />
  <circle cx="10" cy="10" r="5" fill="none" stroke="rgba(249,115,22,0.4)" stroke-width="1"/>
  <circle cx="10" cy="4"  r="1.2" fill="rgba(249,115,22,0.85)"/>
  <circle cx="16" cy="7"  r="1.2" fill="rgba(249,115,22,0.85)"/>
  <circle cx="16" cy="13" r="1.2" fill="rgba(249,115,22,0.85)"/>
  <circle cx="10" cy="16" r="1.2" fill="rgba(249,115,22,0.85)"/>
  <circle cx="4"  cy="13" r="1.2" fill="rgba(249,115,22,0.85)"/>
  <circle cx="4"  cy="7"  r="1.2" fill="rgba(249,115,22,0.85)"/>
</svg>`;

// Haldi dot — tiny golden circle
const HALDI_DOT = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <circle cx="5" cy="5" r="4" fill="rgba(251,191,36,0.5)" />
</svg>`;

interface Particle {
  id: number;
  type: 'petal' | 'rudraksha' | 'haldi';
  x: number;       // % from left
  size: number;    // px
  duration: number; // seconds
  delay: number;   // seconds
  drift: number;   // px horizontal drift
  spin: number;    // deg rotation
}

function makeSvgUrl(svg: string) {
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

const PETAL_URL     = makeSvgUrl(LOTUS_PETAL);
const RUDRAKSHA_URL = makeSvgUrl(RUDRAKSHA);
const HALDI_URL     = makeSvgUrl(HALDI_DOT);

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const roll = Math.random();
    const type: Particle['type'] = roll < 0.45 ? 'petal' : roll < 0.75 ? 'rudraksha' : 'haldi';
    return {
      id: i,
      type,
      x: randomBetween(2, 98),
      size: type === 'petal' ? randomBetween(10, 20) : type === 'rudraksha' ? randomBetween(8, 14) : randomBetween(4, 8),
      duration: randomBetween(14, 28),
      delay: randomBetween(0, 20),
      drift: randomBetween(-60, 60),
      spin: randomBetween(90, 360),
    };
  });
}

const PARTICLES = generateParticles(22);

export default function SpiritualParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (prefersReduced) return null;

  return (
    <div ref={containerRef} className="particle-container" aria-hidden="true">
      {PARTICLES.map((p) => {
        const src = p.type === 'petal' ? PETAL_URL : p.type === 'rudraksha' ? RUDRAKSHA_URL : HALDI_URL;
        const animName = p.type === 'petal' ? 'floatPetal' : 'floatRudraksha';
        return (
          <Image
            key={p.id}
            src={src}
            alt=""
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `${animName} ${p.duration}s linear ${p.delay}s infinite`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`,
              willChange: 'transform, opacity',
              pointerEvents: 'none',
              userSelect: 'none',
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
