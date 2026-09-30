import { useState, useEffect, useRef } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function TestTrail() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newRipple = {
        id: rippleId.current++,
        x: e.clientX,
        y: e.clientY,
        size: 50,
        opacity: 1,
      };
      setRipples(prev => [...prev, newRipple]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setRipples(prev => 
        prev
          .map(r => ({
            ...r,
            size: r.size + 2,
            opacity: r.opacity - 0.02,
          }))
          .filter(r => r.opacity > 0)
      );
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://pikaso.cdnpk.net/private/production/3822101633/802e6e4b-2153-4936-95ba-399380192202-0.mp4?token=exp=1775520000~hmac=4f96eccd6cbb48c06e27b5136096f4ab7708b3780ce5e55a845a605c79afc4ff" type="video/mp4" />
      </video>

      <div className="relative z-10 p-20">
        <h1 className="text-6xl font-bold">Ripple Trail Test</h1>
        <p className="text-2xl mt-4">Move mouse to see trail</p>
      </div>

      <svg className="hidden">
        <filter id="ripple-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {ripples.map(r => (
        <div
          key={r.id}
          className="fixed pointer-events-none z-50 rounded-full"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
            opacity: r.opacity,
            backdropFilter: 'url(#ripple-filter)',
            WebkitBackdropFilter: 'url(#ripple-filter)',
            // Add a slight border/shadow to make the ripple edge visible like water
            boxShadow: `inset 0 0 ${r.size/4}px rgba(255,255,255,${r.opacity * 0.2})`,
          }}
        />
      ))}
    </div>
  );
}
