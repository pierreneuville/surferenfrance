interface LogoProps {
  size?: number;
  className?: string;
}

/** Yosurf logo — gradient sunset square, bold Y letterform, sun + wave */
export function Logo({ size = 36, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="yosurf-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#yosurf-bg)" />
      <circle cx="50" cy="13" r="3" fill="white" opacity="0.92" />
      <path
        d="M19 17 L32 33 L45 17"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M32 33 L32 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path
        d="M13 54 Q 22 47 31 54 T 51 54"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.82"
      />
    </svg>
  );
}

/** Wordmark "yosurf" — lowercase, modern, bold */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${className ?? ""}`}>
      <span className="text-white">yo</span>
      <span className="text-gradient-sunset">surf</span>
    </span>
  );
}
