import { useId } from 'react';

export default function BeeLogo({ size = 34, className = '' }) {
  const uid = useId();
  const clipId = `bee-clip-${uid.replace(/[:]/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="24" cy="28" rx="13" ry="17" />
        </clipPath>
      </defs>
      <ellipse cx="14" cy="13" rx="10" ry="6" fill="#00BFA5" opacity="0.8" />
      <ellipse cx="34" cy="13" rx="10" ry="6" fill="#00BFA5" opacity="0.8" />
      <ellipse cx="24" cy="28" rx="13" ry="17" fill="#FFB300" />
      <g clipPath={`url(#${clipId})`}>
        <rect x="8" y="22" width="32" height="4" fill="#004D40" />
        <rect x="8" y="30" width="32" height="4" fill="#004D40" />
      </g>
    </svg>
  );
}