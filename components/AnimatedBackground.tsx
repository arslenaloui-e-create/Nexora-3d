'use client';

export default function AnimatedBackground() {
  return (
    <div
      className="animated-background"
      aria-hidden="true"
    >
      <div className="animated-grid" />
      <div className="animated-glow animated-glow-1" />
      <div className="animated-glow animated-glow-2" />

      <div className="animated-particles">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}