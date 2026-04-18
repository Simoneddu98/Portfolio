"use client";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className = "", size = 32 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Simone Sanna"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 2×2 grid: top-left, top-right, bottom-left — ink */}
      <rect x="1" y="1" width="13" height="13" fill="currentColor" />
      <rect x="18" y="1" width="13" height="13" fill="currentColor" />
      <rect x="1" y="18" width="13" height="13" fill="currentColor" />
      {/* bottom-right — accent (il keycap acceso) */}
      <rect x="18" y="18" width="13" height="13" fill="var(--color-accent)" />
    </svg>
  );
}
