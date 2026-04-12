import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Music, 
  Mic2, 
  Video, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ChevronDown,
  Play,
  Pause,
  ArrowLeft,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

const SharedGradients = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <linearGradient id="instagram-gradient-global" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#f09433' }} />
        <stop offset="25%" style={{ stopColor: '#e6683c' }} />
        <stop offset="50%" style={{ stopColor: '#dc2743' }} />
        <stop offset="75%" style={{ stopColor: '#cc2366' }} />
        <stop offset="100%" style={{ stopColor: '#bc1888' }} />
      </linearGradient>
    </defs>
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fill="url(#instagram-gradient-global)" d="M16 3H8c-2.76 0-5 2.24-5 5v8c0 2.76 2.24 5 5 5h8c2.76 0 5-2.24 5-5V8c0-2.76-2.24-5-5-5zm3 13c0 1.66-1.34 3-3 3H8c-1.66 0-3-1.34-3-3V8c0-1.66 1.34-3 3-3h8c1.66 0 3 1.34 3 3v8z"/>
    <path fill="url(#instagram-gradient-global)" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    <circle fill="url(#instagram-gradient-global)" cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);

const FacebookIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path fill="white" d="M15.12 12.073h-2.087v8.385H9.563v-8.385H7.953v-2.953h1.61V7.123c0-1.597.758-4.093 4.093-4.093l3.003.013v2.868h-2.178c-.347 0-.834.173-.834.912v2.3h3.045l-.417 2.95z" />
  </svg>
);

const IMAGES = {
  singing: { webp: "/images/hero/singing.webp", jpg: "/images/hero/singing.JPG" },
  portrait: { webp: "/images/hero/portrait.webp", mobileWebp: "/images/hero/portrait-mobile.webp", jpg: "/images/hero/portrait.jpg" },
  trumpet: { webp: "/images/hero/trumpet.webp", jpg: "/images/hero/trumpet.jpg" },
};

const SECTIONS = [
  { id: 'singing', title: 'שירה', icon: <Mic2 className="w-5 h-5" /> },
  { id: 'trumpet', title: 'חצוצרה והרכבי תנועה', icon: <Music className="w-5 h-5" /> },
  { id: 'acting', title: 'משחק ותדמית', icon: <Video className="w-5 h-5" /> },
  { id: 'voiceover', title: 'קריינות ומוסיקה לפרסומות', icon: <Mic2 className="w-5 h-5" /> },
  { id: 'contact', title: 'צור קשר', icon: <Phone className="w-5 h-5" /> },
];

const AudioPlayerItem: React.FC<{ title: string, src: string, duration?: string }> = ({ title, src, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        document.querySelectorAll('audio').forEach(audio => {
          if (audio !== audioRef.current) {
            audio.pause();
          }
        });
        audioRef.current.play();
      }
    }
  };

  return (
    <div 
      className={`rounded-2xl p-5 transition-all relative overflow-hidden group shadow-lg shadow-lilac-500/5 ${
        isPlaying ? 'bg-gradient-to-r from-[#D4AF37] to-[#FDE047] scale-[1.01]' : 'bg-[#FDE047]/90 hover:bg-[#FDE047]'
      }`}
    >
      <div className="flex items-center justify-between relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
          >
            {isPlaying ? <Pause size={20} className="text-black" /> : <Play size={20} className="text-black ml-1" />}
          </button>
          <div className="text-right">
            <h4 className="font-body font-medium text-lg text-black/80">{title}</h4>
          </div>
        </div>
        <div className="text-black/40 font-mono text-sm">{duration}</div>
      </div>
      <audio 
        ref={audioRef} 
        src={src} 
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};

const InteractiveVideo: React.FC<{ 
  src: string, 
  title: string, 
  className?: string,
  iframeClassName?: string,
  aspect?: string
}> = ({ src, title, className = "", iframeClassName = "scale-105", aspect = "aspect-video" }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Extract YouTube video ID safely for thumbnail
  const videoId = src?.includes('/embed/') ? src.split('/embed/')[1]?.split('?')[0] : '';
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';

  useEffect(() => {
    try {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, { rootMargin: '50px' });
      
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => observer.disconnect();
    } catch(e) {
      // Fallback for older browsers
      setIsInView(true);
    }
  }, []);

  const buildUrl = (autoplay: boolean) => {
    if (!src) return '';
    const params = new URLSearchParams({
      enablejsapi: '1',
      mute: '0', 
      autoplay: autoplay ? '1' : '0',
      modestbranding: '1',
      rel: '0',
      controls: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : ''
    });
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${params.toString()}`;
  };

  const handleMouseEnter = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) return; // Completely block hover logic on mobile

    if (!isLoaded) {
      setIsLoaded(true);
      return;
    }
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
      );
    }
  };

  const handleMouseLeave = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) return;

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'
      );
    }
  };

  const handleOverlayClick = () => {
    setIsLoaded(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
      );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group/interactive-video w-full ${aspect} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full bg-black rounded-[inherit] overflow-hidden border-4 border-[#D4AF37] shadow-[0_20px_50px_-12px_rgba(168,128,255,0.3)] z-10 transition-transform duration-500 group-hover/interactive-video:scale-[1.01]">
        {isInView && (
          !isLoaded ? (
            <>
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div 
                className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover/interactive-video:bg-black/10 transition-colors cursor-pointer"
                onClick={handleOverlayClick}
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover/interactive-video:scale-110">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white ml-1" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <>
              <iframe 
                ref={iframeRef}
                src={buildUrl(true)} 
                title={title}
                className={`absolute inset-0 w-full h-full ${iframeClassName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </>
          )
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    message: '',
    'bot-field': ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      const encode = (data: any) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
          .join("&");
      };

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          ...formData
        })
      });
      setFormStatus('success');
      setFormData({ name: '', contact_info: '', message: '', 'bot-field': '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const backgroundY2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen font-body text-lilac-900 bg-[#fdfcff] selection:bg-lilac-200 overflow-x-hidden relative" dir="rtl">
      <SharedGradients />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FDE047] origin-right z-[100]"
        style={{ scaleX }}
      />
      
      {/* Background Decor with Parallax - More Vibrant Purple */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ y: backgroundY1 }}
          className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-lilac-400/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: backgroundY2 }}
          className="absolute top-[25%] right-[-10%] w-[50%] h-[50%] bg-lilac-200/15 rounded-full blur-[110px]" 
        />
        <motion.div 
          style={{ y: backgroundY1 }}
          className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-lilac-600/15 rounded-full blur-[150px]" 
        />
      </div>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-50">
          
          {/* Social Links on Right (RTL start) */}
          <div className="flex gap-2 items-center h-10 w-32">
            <a 
              href="https://www.instagram.com/avigaili/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-lilac-700 hover:text-lilac-900 active:scale-90 transition-transform bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-lilac-100/30"
            >
              <InstagramIcon className="w-[1.6rem] h-[1.6rem] stroke-[1.75px]" />
            </a>
            <a 
              href="https://www.facebook.com/avigail.ifergan/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-lilac-700 hover:text-lilac-900 active:scale-90 transition-transform bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-lilac-100/30"
            >
              <FacebookIcon className="w-[1.6rem] h-[1.6rem] stroke-[1.75px]" />
            </a>
          </div>

          {/* Hamburger Menu on Left (RTL end) */}
          <button 
            className="p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-sm text-lilac-700 border border-lilac-100/50 hover:bg-white transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu Overlay (Both Mobile & Desktop) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%', filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: '-100%', filter: 'blur(10px)' }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0, stiffness: 100 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] md:w-96 z-50 bg-white/95 backdrop-blur-md pt-24 px-6 overflow-y-auto shadow-[20px_0_50px_rgba(0,0,0,0.1)] border-r border-lilac-100"
          >
            {/* Close Button Inside Menu */}
            <button 
              className="absolute top-6 right-6 p-2 text-lilac-400 hover:text-lilac-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={28} />
            </button>

            <div className="flex flex-col gap-5 pb-8 mt-6 md:mt-10">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-4 text-xl md:text-2xl font-headline font-light text-lilac-800 hover:text-lilac-500 hover:translate-x-[-8px] transition-all"
                >
                  <span className="bg-lilac-50 p-2.5 rounded-xl text-lilac-500 shadow-sm">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-between md:justify-end items-center pt-16 md:pt-0 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          {/* Left Image (trumpet) - Desktop Only */}
          <div className="hidden md:block w-1/3 h-full relative">
            {isDesktop && (
              <picture>
                <source srcSet={IMAGES.trumpet.webp} type="image/webp" />
                <img 
                  src={IMAGES.trumpet.jpg} 
                  alt="" 
                  className="w-full h-full object-cover object-top opacity-30"
                  loading="lazy"
                />
              </picture>
            )}
          </div>
          {/* Middle Image (portrait) - Full on Mobile, 1/3 on Desktop */}
          <div className="w-full md:w-1/3 h-full relative">
            <picture>
              <source media="(max-width: 767px)" srcSet={IMAGES.portrait.mobileWebp} type="image/webp" />
              <source srcSet={IMAGES.portrait.webp} type="image/webp" />
              <img 
                src={IMAGES.portrait.jpg} 
                alt="" 
                className="w-full h-full object-cover opacity-60 md:opacity-50"
                fetchPriority="high"
              />
            </picture>
          </div>
          {/* Right Image (singing) - Desktop Only */}
          <div className="hidden md:block w-1/3 h-full relative">
            {isDesktop && (
              <picture>
                <source srcSet={IMAGES.singing.webp} type="image/webp" />
                <img 
                  src={IMAGES.singing.jpg} 
                  alt="" 
                  className="w-full h-full object-cover object-bottom opacity-30 scale-x-[-1]"
                  loading="lazy"
                />
              </picture>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-lilac-50/10 via-lilac-50/40 to-lilac-50/90 md:from-lilac-50/20 md:via-transparent md:to-lilac-50"></div>
        </div>

        {/* Name and Line - Top on mobile, near bottom on desktop */}
        <div className="relative z-10 text-center px-6 max-w-4xl pt-8 md:pt-0 md:mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-headline font-light mb-1.5 tracking-[0.15em] text-lilac-950 drop-shadow-sm">
                אביגיל <br className="md:hidden" /> איפרגן
            </h1>
            <div className="h-[1.5px] w-72 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent mx-auto mb-10 shadow-[0_0_15px_rgba(253,224,71,0.5)]"></div>
          </motion.div>
        </div>

        {/* Subtext - At the bottom on both */}
        <div className="relative z-10 text-center px-6 max-w-4xl md:mt-32">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-6 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm mb-7 md:mb-12">
              <p className="text-lg md:text-2xl font-body font-light text-lilac-700 tracking-[0.12em]">
                מוסיקאית<span className="mx-1 md:mx-2">•</span>שחקנית<span className="mx-1 md:mx-2">•</span>מפיקה
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-lilac-400 cursor-pointer"
          onClick={() => scrollToSection('singing')}
        >
          <ChevronDown size={32} />
        </motion.div>
      </header>

      {/* Singing Section - Gradient Transition */}
      <section id="singing" className="py-32 px-6 bg-gradient-to-b from-white to-lilac-50/50 relative">
        <div className="max-w-none mx-auto relative z-10">
          <div className="grid md:grid-cols-[1.4fr_0.8fr] lg:grid-cols-[1.6fr_0.8fr] gap-12 lg:gap-20 items-center max-w-[1600px] mx-auto mb-24 px-6">
            <motion.div
              initial={{ opacity: 0, filter: 'blur(12px)', y: 60 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 text-lilac-900 leading-tight">שירה לכל אירוע</h2>
              <div className="h-[1.5px] w-72 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent mx-auto mb-10 shadow-[0_0_15px_rgba(253,224,71,0.5)]"></div>
              <p className="text-xl text-lilac-800 leading-relaxed font-body font-light max-w-2xl mx-auto mb-10">
                הופעות שירה חיה המותאמות אישית לכל אירוע. מרגעים מרגשים בחופה ועד לאווירה יוקרתית בקבלות פנים. שילוב של ווקאליות עוצמתית ונוכחות בימתית המביאה איתה רגש עמוק לכל רגע.
              </p>

              {/* Enlarged Prominent Video */}
              <div className="w-full max-w-5xl mx-auto mt-20 relative z-20 mb-12">
                <InteractiveVideo 
                  src="https://www.youtube.com/embed/lJDnYfQ8KIk"
                  title="אביגיל איפרגן - שירה לכל אירוע"
                  aspect="aspect-video"
                  className="w-full max-w-full mx-auto rounded-[2.5rem] shadow-2xl"
                />
              </div>

              {/* Smaller Videos Grid - Below the Prominent Video */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-10 opacity-90 scale-95">
                <InteractiveVideo 
                  src="https://www.youtube.com/embed/prYFJvjaLQo"
                  title="אביגיל איפרגן - שירה 1"
                  aspect="aspect-video"
                  className="w-full max-w-full mx-auto rounded-3xl"
                />
                
                <InteractiveVideo 
                  src="https://www.youtube.com/embed/zI2CBlgEg3k"
                  title="אביגיל איפרגן - שירה 2"
                  aspect="aspect-video"
                  className="w-full max-w-full mx-auto rounded-3xl"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative md:-mr-12 lg:-mr-32"
            >
              {/* Featured Main Video (YouTube Shorts Style) */}
              <InteractiveVideo 
                src="https://www.youtube.com/embed/m36qH6yS7to"
                title="Michelle - Eurovision 2026"
                aspect="aspect-[9/15.7]"
                className="max-w-[400px] mx-auto rounded-[2.5rem]"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-lilac-100 rounded-full -z-10 blur-3xl opacity-60"></div>
            </motion.div>
          </div>


        </div>
      </section>

      {/* Trumpet Section - Vibrant Purple Theme */}
      <section id="trumpet" className="py-24 md:py-40 px-6 bg-gradient-to-br from-lilac-700 via-lilac-600 to-lilac-500 overflow-hidden relative border-y border-lilac-400/30">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-lilac-500 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-lilac-700 rounded-full blur-[130px]"></div>
        </div>
        <div className="max-w-[1500px] mx-auto relative z-10">
          <div className="grid md:grid-cols-[1.4fr_0.6fr] gap-12 md:gap-20 items-center mb-24">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', x: -50 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="order-1 md:order-2 flex flex-col text-center items-center md:-mr-24"
            >
              <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 text-white leading-[1.15]">
                חצוצרה אמנותית <br /> <span className="text-[#FDE047]">והרכבי תנועה</span>
              </h2>
              <div className="h-[1.5px] w-72 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent mx-auto mb-10 shadow-[0_0_15px_rgba(253,224,71,0.5)]"></div>
              <p className="text-xl text-lilac-100 leading-relaxed mb-6 md:mb-10 font-body font-light max-w-2xl mx-auto">
                חוויה ויזואלית ומוסיקלית יוצאת דופן לאירועי יוקרה. הרכבי תנועה אמנותיים המשלבים נגינה חיה בחצוצרה, כוריאוגרפיה מוקפדת ותלבושות מרהיבות, המעניקים לאירוע נופך של אלגנטיות וחדשנות.
              </p>
              
              {/* Spotify Embed - Desktop Hidden on bottom to be shown in column */}
              <div className="hidden md:block w-full max-w-md pt-16">
                <div className="rounded-[12px] overflow-hidden shadow-2xl">
                  <iframe 
                    data-testid="embed-iframe" 
                    style={{ borderRadius: '12px', display: 'block' }} 
                    src="https://open.spotify.com/embed/track/6lcN1FC6PoiCvkq5om9G4o?utm_source=generator" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  ></iframe>
                </div>
              </div>
            </motion.div>

            {/* Video Content */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(12px)', y: 60 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 md:order-1 md:-mt-10"
            >
              <InteractiveVideo 
                src="https://www.youtube.com/embed/8hdDD3caMuQ"
                title="נועה קירל - בריידזילה"
                aspect="aspect-video"
                className="w-full max-w-4xl mx-auto rounded-[2.5rem]"
              />
              
              {/* Spotify Embed - Mobile Only after video */}
              <div className="block md:hidden mt-32 max-w-[300px] mx-auto">
                <div className="rounded-[12px] overflow-hidden shadow-2xl">
                  <iframe 
                    data-testid="embed-iframe" 
                    style={{ borderRadius: '12px', display: 'block' }} 
                    src="https://open.spotify.com/embed/track/6lcN1FC6PoiCvkq5om9G4o?utm_source=generator" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Small Video Grid - Updated to be smaller and more rectangular */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 max-w-[1500px] mx-auto px-4"
          >
            {[
              { id: 'F8VSti0LW0Q', title: 'אביגיל איפרגן' },
              { id: '7wT_hmpmTcg', title: 'אביגיל איפרגן' },
              { id: 'DMwOfwmBBmY', title: 'אביגיל איפרגן' }
            ].map((video, i) => (
              <InteractiveVideo 
                key={i}
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                aspect="aspect-video"
                className="max-w-lg mx-auto rounded-2xl"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Acting Section - Gradient Transition */}
      <section id="acting" className="py-32 px-6 bg-gradient-to-b from-[#f0e9ff] via-white to-white relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(12px)', y: 60 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 text-lilac-900">משחק ותדמית לעסקים</h2>
            <div className="h-[1.5px] w-72 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent mx-auto mb-10 shadow-[0_0_15px_rgba(253,224,71,0.5)]"></div>
            <p className="text-xl text-lilac-700 leading-relaxed mb-12 font-body font-light">
              שירותי משחק מקצועיים לסרטי תדמית, פרסומות והפקות וידאו. בניית דמות המעבירה את המסר העסקי בצורה מדויקת, אמינה ומרשימה.
            </p>
            <div className="mb-16 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
              <InteractiveVideo 
                src="https://www.youtube.com/embed/EU5siooDAwc"
                title="משחק ותדמית - סרטון 1"
                aspect="aspect-video"
                className="max-w-4xl mx-auto rounded-3xl"
              />
              <InteractiveVideo 
                src="https://www.youtube.com/embed/5nLVGvhtgq4"
                title="משחק ותדמית - סרטון 2"
                aspect="aspect-video"
                className="max-w-4xl mx-auto rounded-3xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center max-w-7xl mx-auto">
              {[
                { id: '2uGdlgGIVxg', title: 'משחק ותדמית 1' },
                { id: 'fTEVJsd5wwU', title: 'משחק ותדמית 2' },
                { id: 'JC-7pI5MiAk', title: 'משחק ותדמית 3' }
              ].map((video, i) => (
                <InteractiveVideo 
                  key={i}
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  aspect="aspect-[9/15.7]"
                  className="max-w-[420px] mx-auto rounded-[2rem]"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voiceover Section - Vibrant Purple Theme */}
      <section id="voiceover" className="py-32 px-6 bg-gradient-to-br from-lilac-800 via-lilac-700 to-lilac-600 text-white overflow-hidden relative border-y border-lilac-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-lilac-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-lilac-600 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, filter: 'blur(12px)', y: 60 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 leading-tight">קריינות ומוסיקה לפרסומות</h2>
              <div className="h-[1.5px] w-72 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent mx-auto mb-10 shadow-[0_0_15px_rgba(253,224,71,0.5)]"></div>
              <p className="text-xl text-lilac-100 leading-relaxed mb-10 font-body font-light max-w-2xl mx-auto">
                הקלטות קריינות מקצועיות למגוון מדיות - רדיו, טלוויזיה, דיגיטל ומערכות טלפוניה. יצירת מוסיקה מקורית וג'ינגלים המותאמים אישית למותג שלך, המעניקים לו זהות קולית ייחודית וזכירה.
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                {[
                  { title: 'פרפרים - מתוך המופע של אודיה', duration: '0:30', src: '/audio/פרפרים - מתוך המופע של אודיה.wav' },
                  { title: 'Palace דיור מוגן - קריינות', duration: '0:15', src: '/audio/Palace דיור מוגן - קריינות.mp3' },
                  { title: 'Web Academix - קריינות', duration: '1:20', src: '/audio/קריינות להשתלמות עובדים.wav' },
                ].map((track, idx) => (
                  <AudioPlayerItem key={idx} title={track.title} duration={track.duration} src={track.src} />
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative pt-12 md:pt-20"
            >
              <InteractiveVideo 
                src="https://www.youtube.com/embed/KvvsnMuVZKM"
                title="קריינות ומוסיקה לפרסומות"
                aspect="aspect-video"
                className="rounded-[2.5rem]"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-lilac-500 rounded-full -z-10 blur-[100px] opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Contact Section - Fully Lilac Wrapped */}
      <section id="contact" className="py-20 md:py-32 px-4 md:px-6 bg-lilac-50/80 relative">
        <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-lilac-50/50 rounded-[2rem] md:rounded-[4rem] p-8 md:p-24 overflow-hidden relative border border-lilac-100"
        >
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 relative z-10">
              <div>
                <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 md:mb-10 text-lilac-900 leading-tight text-center">בואו ניצור משהו מופלא יחד</h2>
                <p className="text-lg md:text-xl text-lilac-700 mb-8 md:mb-12 font-body font-light text-center">
                  זמינה לשיתופי פעולה, הופעות ופרויקטים אמנותיים.<br />צרו קשר לתיאום פגישה או לקבלת הצעת מחיר מותאמת אישית.
                </p>
                
                <div className="space-y-6 md:space-y-8">
                  <a href="tel:+972504331354" className="flex items-center gap-5 md:gap-8 group">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] bg-white flex items-center justify-center text-lilac-600 shadow-sm group-hover:bg-lilac-600 group-hover:text-white transition-all">
                      <Phone size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block bg-white/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-sm md:text-base text-lilac-600 font-medium uppercase tracking-[0.15em] mb-1">טלפון</span>
                      <span className="block text-xl md:text-2xl font-body font-medium text-lilac-900 mt-1">050-4331354</span>
                    </div>
                  </a>
                  
                  <a href="mailto:avigailifergan@gmail.com" className="flex items-center gap-5 md:gap-8 group">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] bg-white flex items-center justify-center text-lilac-600 shadow-sm group-hover:bg-lilac-600 group-hover:text-white transition-all">
                      <Mail size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block bg-white/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-sm md:text-base text-lilac-600 font-medium uppercase tracking-[0.15em] mb-1">אימייל</span>
                      <span className="block text-lg md:text-2xl font-body font-medium text-lilac-900 mt-1 break-all">avigailifergan@gmail.com</span>
                    </div>
                  </a>
                </div>

                <div className="flex justify-center md:justify-start gap-5 mt-10 md:mt-16">
                  <a 
                    href="https://www.instagram.com/avigaili/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                  >
                    <InstagramIcon className="w-8 h-8" />
                  </a>
                  <a 
                    href="https://www.facebook.com/avigail.ifergan/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                  >
                    <FacebookIcon className="w-8 h-8" />
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(139,92,246,0.1)] border border-lilac-200">
                <form 
                  className="space-y-6 md:space-y-8" 
                  onSubmit={handleFormSubmit}
                  name="contact"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <div className="hidden">
                    <label>Don’t fill this out if you're human: <input name="bot-field" value={formData['bot-field']} onChange={handleFormChange} /></label>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-body font-medium text-lilac-600 mr-2">שם מלא</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-6 py-4 md:px-8 md:py-5 bg-[#FDE047]/60 border border-lilac-200 rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all outline-none text-lilac-900 placeholder:text-lilac-700 font-medium"
                      placeholder="איך קוראים לך?"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-body font-medium text-lilac-600 mr-2">אימייל / טלפון</label>
                    <input 
                      type="text" 
                      name="contact_info"
                      required
                      value={formData.contact_info}
                      onChange={handleFormChange}
                      className="w-full px-6 py-4 md:px-8 md:py-5 bg-[#FDE047]/60 border border-lilac-200 rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all outline-none text-lilac-900 placeholder:text-lilac-700 font-medium"
                      placeholder="איך נחזור אליך?"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-body font-medium text-lilac-600 mr-2">הודעה</label>
                    <textarea 
                      rows={4}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full px-6 py-4 md:px-8 md:py-5 bg-[#FDE047]/60 border border-lilac-200 rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all outline-none resize-none text-lilac-900 placeholder:text-lilac-700 font-medium"
                      placeholder="ספרו לי על האירוע שלכם..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 md:py-5 bg-lilac-600 text-white rounded-[1.5rem] font-body font-medium text-lg hover:bg-lilac-700 transition-all shadow-xl shadow-lilac-200/50 disabled:opacity-70"
                  >
                    {formStatus === 'submitting' ? 'שולח...' : formStatus === 'success' ? 'ההודעה נשלחה בהצלחה!' : formStatus === 'error' ? 'שגיאה בשליחה, נסו שוב' : 'שלחו הודעה'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-lilac-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-right">
            <h3 className="font-headline font-medium text-2xl mb-3 text-lilac-900">אביגיל איפרגן</h3>
            <p className="text-lilac-400 font-body text-sm tracking-widest uppercase">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-sm font-body font-medium text-lilac-500 hover:text-lilac-900 transition-colors"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <motion.a 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 left-10 z-[60] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.4)] transition-all overflow-hidden" 
        href="https://wa.me/972504331354"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </motion.a>
    </div>
  );
};

export default App;
