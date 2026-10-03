export default function PawIkon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="5.2" cy="9.2" rx="2.1" ry="2.9" />
      <ellipse cx="18.8" cy="9.2" rx="2.1" ry="2.9" />
      <ellipse cx="9.3" cy="6.2" rx="2.2" ry="3" />
      <ellipse cx="14.7" cy="6.2" rx="2.2" ry="3" />
      <path d="M12 11.6c-3.9 0-7 3.2-7 6.4 0 2.2 1.7 3.8 3.9 3.8 1.1 0 2-.5 3.1-.5s2 .5 3.1.5c2.2 0 3.9-1.6 3.9-3.8 0-3.2-3.1-6.4-7-6.4z" />
    </svg>
  );
}
