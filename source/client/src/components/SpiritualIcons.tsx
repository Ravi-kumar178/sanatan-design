// SpiritualIcons — High-quality inline SVG icon set
// Design: Saffron/gold palette, detailed spiritual motifs, consistent 40x40 viewBox
// All icons are inline SVG — zero CDN dependency, never breaks, renders instantly
import React from 'react';

const D = '#F97316'; // default saffron

interface IconProps { size?: number; color?: string; }

export function OmIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Om symbol — detailed Devanagari ॐ with decorative ring */}
      <circle cx="20" cy="20" r="17" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.3"/>
      <circle cx="20" cy="20" r="13" stroke={color} strokeWidth="0.8" opacity="0.15" fill={color} fillOpacity="0.05"/>
      <text x="20" y="26" textAnchor="middle" fontSize="20" fontFamily="serif" fill={color} fontWeight="700" opacity="0.95">ॐ</text>
    </svg>
  );
}

export function LotusIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center petal */}
      <ellipse cx="20" cy="22" rx="4" ry="9" fill={color} opacity="0.9"/>
      {/* Left petals */}
      <ellipse cx="20" cy="22" rx="4" ry="9" transform="rotate(-35 20 22)" fill={color} opacity="0.65"/>
      <ellipse cx="20" cy="22" rx="4" ry="9" transform="rotate(-65 20 22)" fill={color} opacity="0.4"/>
      {/* Right petals */}
      <ellipse cx="20" cy="22" rx="4" ry="9" transform="rotate(35 20 22)" fill={color} opacity="0.65"/>
      <ellipse cx="20" cy="22" rx="4" ry="9" transform="rotate(65 20 22)" fill={color} opacity="0.4"/>
      {/* Stem */}
      <path d="M20 31 Q18 34 16 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M20 31 Q22 34 24 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      {/* Water line */}
      <path d="M10 31 Q15 29 20 31 Q25 33 30 31" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

export function GurukuIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Banyan tree canopy */}
      <path d="M20 6 Q12 8 10 14 Q8 20 14 22 Q11 22 10 26 L14 26" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.4"/>
      <path d="M20 6 Q28 8 30 14 Q32 20 26 22 Q29 22 30 26 L26 26" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.4"/>
      <path d="M20 6 Q20 4 20 6 Q16 10 16 16 Q20 14 24 16 Q24 10 20 6Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2"/>
      {/* Teacher figure */}
      <circle cx="20" cy="28" r="2.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.4"/>
      <path d="M20 30.5 L20 36" strokeWidth="1.8"/>
      <path d="M16 33 L20 31.5 L24 33" strokeWidth="1.6"/>
      {/* Roots */}
      <path d="M14 26 Q12 30 10 32" strokeWidth="1.2" opacity="0.5"/>
      <path d="M26 26 Q28 30 30 32" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );
}

export function AyurvedaIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Mortar bowl */}
      <path d="M10 24 Q10 32 20 32 Q30 32 30 24 L28 16 H12 Z" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.6"/>
      {/* Pestle */}
      <line x1="20" y1="8" x2="20" y2="22" strokeWidth="2.5"/>
      <ellipse cx="20" cy="8" rx="3.5" ry="2" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.4"/>
      {/* Herb leaf */}
      <path d="M25 14 Q33 9 31 18 Q27 17 25 14Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1.2"/>
      <path d="M25 14 Q28 16 31 18" strokeWidth="1" opacity="0.6"/>
      {/* Dots for herbs */}
      <circle cx="14" cy="26" r="1.5" fill={color} fillOpacity="0.5"/>
      <circle cx="18" cy="28" r="1.5" fill={color} fillOpacity="0.5"/>
      <circle cx="22" cy="27" r="1.5" fill={color} fillOpacity="0.5"/>
    </svg>
  );
}

export function ScrollIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Scroll body */}
      <rect x="9" y="9" width="22" height="26" rx="2" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.6"/>
      {/* Top roll */}
      <ellipse cx="20" cy="9" rx="11" ry="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.4"/>
      {/* Bottom roll */}
      <ellipse cx="20" cy="35" rx="11" ry="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.4"/>
      {/* Text lines */}
      <line x1="14" y1="16" x2="26" y2="16" strokeWidth="1.4"/>
      <line x1="14" y1="20" x2="26" y2="20" strokeWidth="1.4"/>
      <line x1="14" y1="24" x2="22" y2="24" strokeWidth="1.4"/>
      {/* Devanagari dot decoration */}
      <circle cx="24" cy="28" r="1.5" fill={color} fillOpacity="0.6"/>
    </svg>
  );
}

export function TechLotusIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Central lotus */}
      <circle cx="20" cy="20" r="5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.6"/>
      <circle cx="20" cy="20" r="2.5" fill={color} fillOpacity="0.6"/>
      {/* 8 circuit spokes */}
      <line x1="20" y1="9" x2="20" y2="15"/>
      <line x1="20" y1="25" x2="20" y2="31"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="25" y1="20" x2="31" y2="20"/>
      <line x1="12.2" y1="12.2" x2="16.5" y2="16.5"/>
      <line x1="23.5" y1="23.5" x2="27.8" y2="27.8"/>
      <line x1="27.8" y1="12.2" x2="23.5" y2="16.5"/>
      <line x1="16.5" y1="23.5" x2="12.2" y2="27.8"/>
      {/* Endpoint nodes */}
      <circle cx="20" cy="8" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="20" cy="32" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="8" cy="20" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="32" cy="20" r="2" fill={color} fillOpacity="0.7"/>
    </svg>
  );
}

export function GivingHandsIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Cupped hands */}
      <path d="M8 28 Q8 20 12 18 L16 17 Q18 16 18 18 L18 22" strokeWidth="1.6"/>
      <path d="M32 28 Q32 20 28 18 L24 17 Q22 16 22 18 L22 22" strokeWidth="1.6"/>
      <path d="M8 28 Q8 34 20 34 Q32 34 32 28" fill={color} fillOpacity="0.1" strokeWidth="1.6"/>
      {/* Lotus flower being offered */}
      <ellipse cx="20" cy="22" rx="3" ry="5.5" fill={color} fillOpacity="0.8"/>
      <ellipse cx="20" cy="22" rx="3" ry="5.5" transform="rotate(35 20 22)" fill={color} fillOpacity="0.5"/>
      <ellipse cx="20" cy="22" rx="3" ry="5.5" transform="rotate(-35 20 22)" fill={color} fillOpacity="0.5"/>
      {/* Light rays */}
      <line x1="20" y1="12" x2="20" y2="9" strokeWidth="1.2" opacity="0.5"/>
      <line x1="24" y1="13" x2="26" y2="11" strokeWidth="1.2" opacity="0.4"/>
      <line x1="16" y1="13" x2="14" y2="11" strokeWidth="1.2" opacity="0.4"/>
    </svg>
  );
}

export function CommunityIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Center person */}
      <circle cx="20" cy="13" r="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
      <path d="M14 26 Q14 20 20 20 Q26 20 26 26" fill={color} fillOpacity="0.1" strokeWidth="1.5"/>
      {/* Left person */}
      <circle cx="9" cy="18" r="3.5" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.4"/>
      <path d="M5 30 Q5 25 9 25 Q13 25 13 30" strokeWidth="1.3" opacity="0.7"/>
      {/* Right person */}
      <circle cx="31" cy="18" r="3.5" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.4"/>
      <path d="M27 30 Q27 25 31 25 Q35 25 35 30" strokeWidth="1.3" opacity="0.7"/>
      {/* Connection lines */}
      <line x1="13" y1="17" x2="16" y2="15" strokeWidth="1.2" opacity="0.5"/>
      <line x1="27" y1="17" x2="24" y2="15" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );
}

export function CalendarIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar body */}
      <rect x="6" y="10" width="28" height="25" rx="3.5" fill={color} fillOpacity="0.07" stroke={color} strokeWidth="1.6"/>
      {/* Header band */}
      <rect x="6" y="10" width="28" height="8" rx="3.5" fill={color} fillOpacity="0.18" stroke="none"/>
      <line x1="6" y1="18" x2="34" y2="18" strokeWidth="1.4"/>
      {/* Binding posts */}
      <line x1="14" y1="6" x2="14" y2="13" strokeWidth="2.5"/>
      <line x1="26" y1="6" x2="26" y2="13" strokeWidth="2.5"/>
      {/* Date dots */}
      <circle cx="13" cy="24" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="20" cy="24" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="27" cy="24" r="2" fill={color} fillOpacity="0.7"/>
      <circle cx="13" cy="30" r="2" fill={color} fillOpacity="0.5"/>
      <circle cx="20" cy="30" r="2" fill={color} fillOpacity="0.5"/>
    </svg>
  );
}

export function ResearchIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying glass */}
      <circle cx="17" cy="17" r="10" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.8"/>
      <circle cx="17" cy="17" r="6" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.4"/>
      {/* Handle */}
      <line x1="24.5" y1="24.5" x2="34" y2="34" strokeWidth="3" strokeLinecap="round"/>
      {/* Plus/cross inside lens */}
      <line x1="13" y1="17" x2="21" y2="17" strokeWidth="1.4"/>
      <line x1="17" y1="13" x2="17" y2="21" strokeWidth="1.4"/>
    </svg>
  );
}

export function YogaIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="20" cy="9" r="3.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
      {/* Body */}
      <line x1="20" y1="12.5" x2="20" y2="22" strokeWidth="2"/>
      {/* Arms in Namaste/meditation pose */}
      <path d="M9 17 Q14 15 20 17 Q26 15 31 17" strokeWidth="1.8"/>
      {/* Legs in lotus */}
      <path d="M20 22 Q14 26 9 28" strokeWidth="1.8"/>
      <path d="M20 22 Q26 26 31 28"/>
      <path d="M9 28 Q14 32 20 30 Q26 32 31 28" strokeWidth="1.4" opacity="0.6"/>
      {/* Halo/aura */}
      <circle cx="20" cy="9" r="6.5" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4"/>
    </svg>
  );
}

export function FinancialIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Temple/institution columns */}
      <rect x="6" y="28" width="28" height="4" rx="1" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="32" width="32" height="3" rx="1" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.4"/>
      {/* Columns */}
      <rect x="10" y="18" width="4" height="10" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.3"/>
      <rect x="18" y="18" width="4" height="10" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.3"/>
      <rect x="26" y="18" width="4" height="10" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.3"/>
      {/* Pediment / roof */}
      <path d="M6 18 L20 8 L34 18 Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      <line x1="6" y1="18" x2="34" y2="18" strokeWidth="1.5"/>
    </svg>
  );
}

export function CollabIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Two interlocking circles (Venn) */}
      <circle cx="15" cy="20" r="9" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.6"/>
      <circle cx="25" cy="20" r="9" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.6"/>
      {/* Intersection highlight */}
      <path d="M20 12.5 Q24 16 24 20 Q24 24 20 27.5 Q16 24 16 20 Q16 16 20 12.5Z" fill={color} fillOpacity="0.25" stroke="none"/>
      {/* Handshake hint */}
      <line x1="20" y1="18" x2="20" y2="22" strokeWidth="2.5" stroke={color} opacity="0.7"/>
    </svg>
  );
}

export function NewsIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Newspaper */}
      <rect x="6" y="8" width="24" height="28" rx="2.5" fill={color} fillOpacity="0.07" stroke={color} strokeWidth="1.6"/>
      {/* Fold/tab */}
      <rect x="28" y="14" width="6" height="22" rx="1.5" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.3"/>
      {/* Headline */}
      <rect x="10" y="13" width="16" height="5" rx="1" fill={color} fillOpacity="0.2" stroke="none"/>
      {/* Text lines */}
      <line x1="10" y1="22" x2="26" y2="22" strokeWidth="1.3"/>
      <line x1="10" y1="26" x2="26" y2="26" strokeWidth="1.3"/>
      <line x1="10" y1="30" x2="20" y2="30" strokeWidth="1.3"/>
    </svg>
  );
}

export function ImpactIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Star/spark */}
      <path d="M20 6 L22.5 15 L32 15 L24.5 21 L27 30 L20 24.5 L13 30 L15.5 21 L8 15 L17.5 15 Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
      {/* Inner star */}
      <path d="M20 12 L21.5 17 L27 17 L22.5 20.5 L24 25.5 L20 22.5 L16 25.5 L17.5 20.5 L13 17 L18.5 17 Z" fill={color} fillOpacity="0.4" stroke="none"/>
    </svg>
  );
}

export function VolunteerIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Heart */}
      <path d="M20 32 Q8 24 8 16 Q8 10 14 10 Q17 10 20 14 Q23 10 26 10 Q32 10 32 16 Q32 24 20 32Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.6"/>
      {/* Hands reaching up */}
      <path d="M14 22 Q12 20 11 17" strokeWidth="1.4" opacity="0.6"/>
      <path d="M26 22 Q28 20 29 17" strokeWidth="1.4" opacity="0.6"/>
    </svg>
  );
}

export function DonateIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Coin */}
      <circle cx="20" cy="18" r="10" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.6"/>
      <circle cx="20" cy="18" r="7" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.2"/>
      {/* Rupee/currency symbol */}
      <text x="20" y="22" textAnchor="middle" fontSize="10" fontFamily="serif" fill={color} fontWeight="700">₹</text>
      {/* Rays */}
      <line x1="20" y1="5" x2="20" y2="7" strokeWidth="1.5" opacity="0.5"/>
      <line x1="30.6" y1="8" x2="29.2" y2="9.2" strokeWidth="1.5" opacity="0.4"/>
      <line x1="34" y1="18" x2="32" y2="18" strokeWidth="1.5" opacity="0.4"/>
      <line x1="9.4" y1="8" x2="10.8" y2="9.2" strokeWidth="1.5" opacity="0.4"/>
      <line x1="6" y1="18" x2="8" y2="18" strokeWidth="1.5" opacity="0.4"/>
    </svg>
  );
}

export function AppIcon({ size = 24, color = D }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* Phone */}
      <rect x="11" y="4" width="18" height="32" rx="3.5" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.6"/>
      {/* Screen */}
      <rect x="14" y="8" width="12" height="20" rx="1.5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.2"/>
      {/* Om on screen */}
      <text x="20" y="21" textAnchor="middle" fontSize="9" fontFamily="serif" fill={color} fontWeight="700" opacity="0.8">ॐ</text>
      {/* Home button */}
      <circle cx="20" cy="32" r="2" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

// ── Icon wrapper with consistent styling ──────────────────────────────────────
export function IconBox({ children, size = 40, bg = 'rgba(249,115,22,0.08)', hoverBg = 'rgba(249,115,22,0.16)' }: { children: React.ReactNode; size?: number; bg?: string; hoverBg?: string }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{ width: size, height: size, borderRadius: '10px', background: hovered ? hoverBg : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 250ms ease', transform: hovered ? 'scale(1.08) rotate(3deg)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}
