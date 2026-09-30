import { useState, useEffect } from 'react';

export default function TestFilter() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-20 relative overflow-hidden">
      <h1 className="text-6xl font-bold mb-4">Liquid Distortion Test</h1>
      <p className="text-2xl">Move your mouse around to see the effect.</p>
      <button className="mt-8 px-6 py-3 bg-blue-500 rounded-lg">Click Me</button>
      
      <svg className="hidden">
        <filter id="liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div 
        className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${pos.x - 150}px, ${pos.y - 150}px)`,
          width: 300,
          height: 300,
          backdropFilter: 'url(#liquid)',
          WebkitBackdropFilter: 'url(#liquid)',
          borderRadius: '50%',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)'
        }}
      />
    </div>
  );
}
