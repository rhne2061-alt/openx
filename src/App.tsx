import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StaggeredMenu } from './components/StaggeredMenu';

const MAX_RIPPLES = 80;

const socialItems = [
  { label: 'Instagram', link: '#' },
  { label: 'Facebook', link: '#' },
  { label: 'Twitter', link: '#' }
];

const fleetVideos = [
  {
    src: "https://app-uploads.krea.ai/wan-videos/08006647-1c55-4823-b35d-e40d57c66bf8.mp4",
    title: "OCEAN\nECLIPSE",
    specs: [
      { label: "LENGTH", value: "28 M (92 FT)" },
      { label: "CRUISING SPEED", value: "22 KNOTS" },
      { label: "GUESTS", value: "UP TO 12 GUESTS" },
      { label: "CABINS", value: "4 EN-SUITE CABINS" },
      { label: "SPECIAL FEATURE", value: "ADVANCED GYRO STABILIZATION" }
    ]
  },
  {
    src: "https://app-uploads.krea.ai/wan-videos/91fd9932-6194-4d58-ada0-955692853019.mp4",
    title: "BLACK\nSOVEREIGN",
    specs: [
      { label: "LENGTH", value: "24 M (78 FT)" },
      { label: "TOP SPEED", value: "45 KNOTS" },
      { label: "HULL", value: "CARBON FIBER & KEVLAR" },
      { label: "ENGINES", value: "TWIN V12 2000 HP" },
      { label: "SPECIAL FEATURE", value: "BESPOKE DESIGN WITH GOLD DETAILING" }
    ]
  },
  {
    src: "https://app-uploads.krea.ai/wan-videos/95fb3282-d7cf-448e-9202-ef0662541c83.mp4",
    title: "AZURE\nHORIZON",
    specs: [
      { label: "LENGTH", value: "32 M (105 FT)" },
      { label: "RANGE", value: "1,500 NAUTICAL MILES" },
      { label: "GUESTS", value: "14 GUESTS + 5 CREW" },
      { label: "DECK", value: "SPACIOUS SUN DECK WITH JACUZZI" },
      { label: "SPECIAL FEATURE", value: "FULL WATER TOYS GARAGE" }
    ]
  }
];

const textVariants = {
  hidden: { opacity: 0, y: 40, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.96, ease: [0.22, 1, 0.36, 1] } }
};

function FleetVideo({ data }: { data: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="w-full h-full relative group cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) {
          playPromiseRef.current = videoRef.current.play();
          playPromiseRef.current?.catch((error) => {
            // Ignore auto-play interruptions
          });
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          if (playPromiseRef.current !== null) {
            playPromiseRef.current.then(() => {
              videoRef.current?.pause();
            }).catch(() => {
              // Ignore error
            });
          } else {
            videoRef.current.pause();
          }
        }
      }}
    >
      <video 
        ref={videoRef}
        src={data.src}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <AnimatePresence>
        {isHovered && data.title && (
          <motion.div 
            className="absolute inset-0 p-8 md:p-12 flex flex-col justify-start items-start text-white pointer-events-none"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
          >
            <h2 className="text-5xl md:text-7xl font-normal leading-none tracking-tight mb-12 text-left">
              {data.title.split('\n').map((line: string, i: number) => (
                <div key={i} className="overflow-hidden">
                  <motion.div variants={textVariants}>{line}</motion.div>
                </div>
              ))}
            </h2>
            
            <div className="flex flex-col gap-6">
              {data.specs.map((spec: any, i: number) => (
                <div key={i} className="flex flex-col gap-1 text-left">
                  <div className="overflow-hidden">
                    <motion.div variants={textVariants} className="text-xs md:text-sm text-white/70 tracking-widest uppercase">{spec.label}</motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div variants={textVariants} className="text-sm md:text-base tracking-wider uppercase">{spec.value}</motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 overflow-hidden pointer-events-auto">
              <motion.button 
                variants={textVariants}
                className="px-6 py-3 text-[13px] md:px-12 md:py-5 md:text-[18px] bg-white/5 backdrop-blur-[120px] text-[#e9e9ef] font-normal leading-none tracking-[0.15em] uppercase italic transition-colors hover:bg-white/10"
              >
                VIEW
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFleetOpen, setIsFleetOpen] = useState(false);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '#', onClick: () => setIsFleetOpen(false) },
    { label: 'Our Fleet', ariaLabel: 'Explore our fleet', link: '#', onClick: () => setIsFleetOpen(true) },
    { label: 'Membership', ariaLabel: 'Join the club', link: '#' },
    { label: 'Regattas & Events', ariaLabel: 'View events', link: '#' },
    { label: 'Academy', ariaLabel: 'Learn to sail', link: '#' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#' }
  ];
  const ripplesRef = useRef<HTMLDivElement[]>([]);
  const rippleData = useRef<{ x: number; y: number; age: number; active: boolean }[]>(
    Array(MAX_RIPPLES).fill({ x: 0, y: 0, age: 0, active: false })
  );
  const currentIndex = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Initialize ripple data array properly
    rippleData.current = Array.from({ length: MAX_RIPPLES }, () => ({
      x: 0, y: 0, age: 0, active: false
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Only spawn a new ripple if mouse moved enough
      if (dist > 25) {
        const idx = currentIndex.current;
        rippleData.current[idx] = {
          x: e.clientX,
          y: e.clientY,
          age: 0,
          active: true
        };
        
        currentIndex.current = (idx + 1) % MAX_RIPPLES;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      rippleData.current.forEach((data, i) => {
        const el = ripplesRef.current[i];
        if (!el) return;

        if (data.active) {
          data.age += 0.012; // Speed of ripple expansion/fade (slower = longer lasting)
          
          if (data.age >= 1) {
            data.active = false;
            el.style.opacity = '0';
            el.style.transform = 'scale(0)';
          } else {
            // Calculate size and opacity based on age
            const size = 20 + (data.age * 280); // Expands from 20px to 300px
            const opacity = 1 - Math.pow(data.age, 1.2); // Fades out smoothly
            
            el.style.opacity = opacity.toString();
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.left = `${data.x - size / 2}px`;
            el.style.top = `${data.y - size / 2}px`;
            el.style.transform = 'scale(1)';
          }
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-white overflow-hidden font-sans">
      
      {/* SVG Filter Definition */}
      <svg className="hidden">
        <filter id="liquid-trail">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.02" 
            numOctaves="2" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="30" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </svg>

      {/* Ripple Pool */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        {Array.from({ length: MAX_RIPPLES }).map((_, i) => (
          <div
            key={i}
            ref={el => { if (el) ripplesRef.current[i] = el; }}
            className="absolute rounded-full pointer-events-none opacity-0"
            style={{
              backdropFilter: 'url(#liquid-trail) blur(1px)',
              WebkitBackdropFilter: 'url(#liquid-trail) blur(1px)',
              boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1), 0 0 15px rgba(147,197,253,0.15)',
              willChange: 'transform, opacity, width, height, left, top',
            }}
          />
        ))}
      </div>

      {/* Background Video */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        initial={{ filter: 'blur(0px)' }}
        animate={{ filter: isFleetOpen ? 'blur(100px)' : 'blur(0px)' }}
        transition={{ duration: isFleetOpen ? 1.56 : 1.3, ease: [0.19, 1, 0.22, 1] }}
      >
        <iframe
          src="https://player.vimeo.com/video/1184061018?background=1&autoplay=1&loop=1&byline=0&title=0"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ border: 'none' }}
        ></iframe>
      </motion.div>

      {/* Main Content */}
      <main className="relative z-20 w-full h-screen pointer-events-none font-serif uppercase">
        <AnimatePresence>
          {isFleetOpen && (
            <motion.div 
              className="fixed inset-0 z-[110] flex flex-col md:flex-row pointer-events-auto overflow-y-auto overflow-x-hidden md:overflow-hidden"
            >
              {fleetVideos.map((data, i) => (
                <motion.div 
                  key={i}
                  className="relative w-full h-[85vh] shrink-0 md:w-auto md:h-full md:flex-1 border-b-2 md:border-b-0 md:border-r-2 border-white last:border-b-0 md:last:border-r-0 overflow-hidden bg-black"
                  initial={{ x: '100vw' }}
                  animate={{ x: 0, transition: { duration: 1.56, ease: [0.19, 1, 0.22, 1], delay: i * 0.1 } }}
                  exit={{ x: '100vw', transition: { duration: 1.3, ease: [0.19, 1, 0.22, 1], delay: (2 - i) * 0.1 } }}
                >
                  <FleetVideo data={data} />
                </motion.div>
              ))}
              
              <motion.button 
                onClick={() => setIsFleetOpen(false)} 
                className="fixed top-8 right-8 z-[120] text-white text-xl uppercase tracking-widest mix-blend-difference hover:opacity-70 transition-opacity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ delay: 0.5 }}
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <StaggeredMenu
          className="font-serif uppercase"
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#ffffff"
          openMenuButtonColor="#000000"
          changeMenuColorOnOpen={true}
          colors={['#1a1a1a', '#93c5fd']}
          accentColor="#93c5fd"
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
        >
          <div className="md:hidden pt-8">
            <button 
              className="w-full px-6 py-4 text-[13px] font-normal tracking-[0.15em] transition-colors duration-500 bg-[#93c5fd] text-black hover:bg-black hover:text-white uppercase"
            >
              JOIN THE <span className="italic">CLUB</span>
            </button>
          </div>
        </StaggeredMenu>
        <AnimatePresence>
          {!isFleetOpen && (
            <motion.div 
              className="absolute top-[96px] left-[20px] md:left-[96px] flex flex-col items-start z-10"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
                hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } }
              }}
            >
              <h1 className="text-[64px] md:text-[140px] font-normal leading-none drop-shadow-2xl text-left tracking-normal uppercase">
                <div className="overflow-hidden"><motion.div variants={textVariants}>MASTER THE</motion.div></div>
                <div className="overflow-hidden italic"><motion.div variants={textVariants}>ELEMENTS.</motion.div></div>
                <div className="overflow-hidden"><motion.div variants={textVariants}>EMBRACE THE</motion.div></div>
                <div className="overflow-hidden italic"><motion.div variants={textVariants}>OCEAN</motion.div></div>
              </h1>
              
              <div className="overflow-hidden mt-8 ml-0 md:ml-[35%] translate-x-0 md:translate-x-[100px]">
                <motion.p variants={textVariants} className="text-[10px] md:text-xs font-normal w-[260px] text-left md:text-justify leading-relaxed drop-shadow-md tracking-widest">
                  JOIN AN EXCLUSIVE COMMUNITY OF SAILORS. WHETHER YOU CRAVE THE THRILL OF THE OPEN SEA OR THE SERENITY OF A SUNSET CRUISE, YOUR NEXT GREAT ADVENTURE STARTS HERE.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isFleetOpen && (
            <motion.div 
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textVariants}
              className="absolute bottom-8 right-8 z-50 pointer-events-none"
            >
              <div
                className={isMenuOpen ? "hidden md:block" : "block"}
                style={{
                  transform: isMenuOpen ? 'translateX(calc(-1 * clamp(260px, 38vw, 420px)))' : 'translateX(0)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <button 
                  className={`px-6 py-3 text-[13px] md:px-12 md:py-5 md:text-[18px] font-normal tracking-[0.15em] transition-colors duration-500 backdrop-blur-md pointer-events-auto ${
                    isMenuOpen 
                      ? 'bg-[#93c5fd] text-black hover:bg-white' 
                      : 'bg-white text-black hover:bg-[#93c5fd]'
                  }`}
                >
                  JOIN THE <span className="italic">CLUB</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
