'use client';

import { useEffect, useState } from 'react';

export function AnimatedFlame() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <style>{`
      @keyframes flicker {
        0%, 100% { opacity: 1; transform: scale(1); }
        25% { opacity: 0.9; transform: scale(1.05); }
        50% { opacity: 1; transform: scale(1); }
        75% { opacity: 0.95; transform: scale(1.02); }
      }

      @keyframes rise {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-2px); }
        100% { transform: translateY(0px); }
      }

      .animated-flame {
        animation: flicker 1.5s ease-in-out infinite,
                   rise 2s ease-in-out infinite;
        display: inline-block;
        color: #ff6b35;
      }
    `}
    <svg
      className="animated-flame"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M12 2c3 0 5 2 5 5 0 3-2 8-5 11-3-3-5-8-5-11 0-3 2-5 5-5z" />
      <ellipse cx="12" cy="20" rx="3" ry="2" fill="currentColor" />
    </svg>
    </style>
  );
}
