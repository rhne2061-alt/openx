import { useEffect, useRef } from 'react';
import fluid from 'webgl-fluid';

export default function TestFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      fluid(canvasRef.current, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 512,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 2,
        VELOCITY_DISSIPATION: 0.5,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 0,
        SPLAT_RADIUS: 0.1,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: false,
        COLOR_UPDATE_SPEED: 0,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: true,
        BLOOM: false,
        SUNRAYS: false,
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-blue-500">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://pikaso.cdnpk.net/private/production/3822101633/802e6e4b-2153-4936-95ba-399380192202-0.mp4?token=exp=1775520000~hmac=4f96eccd6cbb48c06e27b5136096f4ab7708b3780ce5e55a845a605c79afc4ff" type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 mix-blend-overlay opacity-50"
      />
      <div className="relative z-20 pointer-events-none p-20 text-white text-6xl font-bold">
        Water Trail Test
      </div>
    </div>
  );
}
