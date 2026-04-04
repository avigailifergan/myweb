import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Mic2, 
  Video, 
  Instagram, 
  Facebook, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ChevronDown,
  Play,
  Pause,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

const IMAGES = {
  singing: "https://lh3.googleusercontent.com/aida/ADBb0uijsMBTt-xnDpP9tOBxYUS0zZ7HlebiGrGa6plLUkFZVwZixCdWdSoqekARRhC9wvUWCOInlUU6T9MZopACwrcdIWuW9qY0cIknJXmEfoLTKfFOBNgFnLcizFuSUjeEsRQB-XiGYMXnmPcR9gynopwJRUSytbVtJC-W-IhTGzfIxc3tHx769q34tCTbK3UPsuxuaY6hGlM8q-mZ0Yxfr9bl-GXTSieWyjkRCFsgIv0dQXSReOlcGEtMX88F4Uf_BOwDYDpzD6nqv8o",
  portrait: "https://lh3.googleusercontent.com/aida/ADBb0uijPQayeexPXLXuFvNfb13SnkvFni1YvCZEBsYyxcEi7art3-ckYN3iPRvsOK2YYrRv3674f2tuDN8s0MGWHNZkl9B_rZE6OLK6zRRBk47xrQttjQqw9tO_5j4T1uwl5Oe5ZzvD9G0-PlY-_xu_eIWnC4oOCqY5hKfHPXDyqjThcGYXpg6jkxstQMkwjIlsbS116jLdks4nBnbq3hG7iM9Iztb0ShuKRDV8DlqD9csY6GUayK2lSDHiAgx_QIpq_ucDKqre7z7Bsh0",
  trumpet: "https://lh3.googleusercontent.com/aida/ADBb0ug_g7j-WzRO57S_H8S-mtJ-FQDEH2ymvG_lIgmH7hQE04wwffTdL240khZSh_pkSFocY51P2NA673uR33FOXjNgLN6eD9bOvNQkxZXxRWTaLRl2BHcBZronDLoZcKjp28LiqKmzdtr1rGmNoG5N9qFBL2evyUplztcksDQ2LaZrFEOyKuLYnfGVTz8dll1R38VtgNh6hQNuF45LmFqAhyp4kd4z0-RxYkdgH1E1XtA3dHKRQ8NGF-3-6hVnTP5U1buGI9iWb3GEQf0"
};

const SECTIONS = [
  { id: 'singing', title: 'שירה', icon: <Mic2 className="w-5 h-5" /> },
  { id: 'trumpet', title: 'חצוצרה והרכבי תנועה', icon: <Music className="w-5 h-5" /> },
  { id: 'acting', title: 'משחק ותדמית', icon: <Video className="w-5 h-5" /> },
  { id: 'voiceover', title: 'קריינות ומוסיקה לפרסומות', icon: <Mic2 className="w-5 h-5" /> },
  { id: 'contact', title: 'צור קשר', icon: <Phone className="w-5 h-5" /> },
];

const AudioPlayerItem = ({ title, src, duration }: { title: string, src: string, duration?: string }) => {
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
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group" onClick={togglePlay}>
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-lilac-500/50 flex items-center justify-center group-hover:bg-lilac-500 transition-colors">
          {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
        </div>
        <span className="font-body font-medium text-lg">{title}</span>
      </div>
      <span className="text-sm text-lilac-300 font-body">{duration}</span>
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <div className="min-h-screen font-body text-lilac-900 bg-lilac-50 selection:bg-lilac-200 overflow-x-hidden" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          {/* Desktop Menu Styled Container */}
          <div className="hidden md:flex items-center gap-6 px-10 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg shadow-lilac-100/20">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-sm font-body font-bold tracking-widest text-lilac-900 hover:text-lilac-600 transition-colors uppercase whitespace-nowrap"
              >
                {section.title}
              </button>
            ))}
            <div className="flex items-center gap-5 mr-2 border-r border-lilac-100 pr-6">
              <a 
                href="https://www.instagram.com/avigaili/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#f09433' }} />
                      <stop offset="25%" style={{ stopColor: '#e6683c' }} />
                      <stop offset="50%" style={{ stopColor: '#dc2743' }} />
                      <stop offset="75%" style={{ stopColor: '#cc2366' }} />
                      <stop offset="100%" style={{ stopColor: '#bc1888' }} />
                    </linearGradient>
                  </defs>
                  <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.148.258-2.911.556-.788.306-1.457.715-2.123 1.381s-1.075 1.335-1.381 2.123c-.298.763-.499 1.634-.556 2.911-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.258 2.148.556 2.911.306.788.715 1.457 1.381 2.123s1.335 1.075 2.123 1.381c.763.298 1.634.499 2.911.556 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.148-.258 2.911-.556.788-.306 1.457-.715 2.123-1.381s1.075-1.335 1.381-2.123c.298-.763.499-1.634.556-2.911.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.277-.258-2.148-.556-2.911-.306-.788-.715-1.457-1.381-2.123s-1.335-1.075-2.123-1.381c-.763-.298-1.634-.499-2.911-.556-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/avigail.ifergan/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex w-full justify-end items-center">
            <button className="p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-sm text-lilac-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-4 text-2xl font-headline font-light text-lilac-800 border-b border-lilac-100 pb-4"
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen flex items-end justify-center pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          {/* Left Image (Image 3) */}
          <div className="w-1/3 h-full relative">
            <img 
              src={IMAGES.trumpet} 
              alt="" 
              className="w-full h-full object-cover object-top opacity-30"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Middle Image (Image 2) */}
          <div className="w-1/3 h-full relative">
            <img 
              src={IMAGES.portrait} 
              alt="" 
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Right Image (Image 1 - Cropped Top) */}
          <div className="w-1/3 h-full relative">
            <img 
              src={IMAGES.singing} 
              alt="" 
              className="w-full h-full object-cover object-bottom opacity-30"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-lilac-50/20 via-transparent to-lilac-50"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-headline font-extralight mb-4 tracking-[0.15em] text-lilac-900">
              אביגיל איפרגן
            </h1>

            <div className="h-[1px] w-48 bg-[#FDE047] mx-auto mb-6"></div>
            <div className="inline-block px-6 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm mb-12">
              <p className="text-lg md:text-2xl font-body font-light text-lilac-700 tracking-[0.1em]">
                מוסיקאית • שחקנית • מפיקה
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

      {/* Singing Section */}
      <section id="singing" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 text-lilac-900 leading-tight">שירה לכל אירוע</h2>
              <div className="h-[1px] w-48 bg-[#FDE047] mx-auto mb-10"></div>
              <p className="text-xl text-lilac-700 leading-relaxed mb-10 font-body font-light max-w-2xl mx-auto">
                הופעות שירה חיה המותאמות אישית לכל אירוע. מרגעים מרגשים בחופה ועד לאווירה יוקרתית בקבלות פנים. שילוב של ווקאליות עוצמתית ונוכחות בימתית כובשת המביאה איתה רגש עמוק לכל רגע.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-lilac-200 bg-black">
                <iframe 
                  src="https://www.youtube.com/embed/prYFJvjaLQo?autoplay=0&rel=0&controls=0&modestbranding=1&iv_load_policy=3" 
                  title="אביגיל איפרגן - שירה לכל אירוע"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-lilac-100 rounded-full -z-10 blur-3xl opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trumpet Section */}
      <section id="trumpet" className="py-32 px-6 bg-lilac-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-stretch mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              {/* Make square and larger */}
              <div className="aspect-square max-w-xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl relative group border-4 border-lilac-200 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/8hdDD3caMuQ"
                  title="חצוצרה אמנותית והרכבי תנועה"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 flex flex-col text-center"
            >
              <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 text-lilac-900 leading-tight">חצוצרה אמנותית והרכבי תנועה</h2>
              <div className="h-[1px] w-48 bg-[#FDE047] mx-auto mb-10"></div>
              <p className="text-xl text-lilac-700 leading-relaxed mb-10 font-body font-light max-w-2xl mx-auto">
                חוויה ויזואלית ומוסיקלית יוצאת דופן לאירועי יוקרה. הרכבי תנועה אמנותיים המשלבים נגינה חיה בחצוצרה, כוריאוגרפיה מוקפדת ותלבושות מרהיבות, המעניקים לאירוע נופך של אלגנטיות וחדשנות.
              </p>
              
              {/* Spotify Embed - Square and larger */}
              <div className="mt-auto pt-10 max-w-md">
                <iframe 
                  data-testid="embed-iframe" 
                  style={{ borderRadius: '12px' }} 
                  src="https://open.spotify.com/embed/track/6lcN1FC6PoiCvkq5om9G4o?utm_source=generator" 
                  width="100%" 
                  height="352" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>

          {/* Small Video Grid - Updated to be smaller and more rectangular */}
          <div className="text-center mb-12">
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-[1800px] mx-auto px-4"
          >
            {[
              { id: 'F8VSti0LW0Q', title: 'אביגיל איפרגן' },
              { id: '7wT_hmpmTcg', title: 'אביגיל איפרגן' },
              { id: 'DMwOfwmBBmY', title: 'אביגיל איפרגן' }
            ].map((video, i) => (
              <div key={i} className="aspect-video bg-black rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all relative border border-lilac-100">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0&showinfo=0`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Acting Section */}
      <section id="acting" className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 text-lilac-900">משחק ותדמית לעסקים</h2>
            <div className="h-[1px] w-48 bg-[#FDE047] mx-auto mb-10"></div>
            <p className="text-xl text-lilac-700 leading-relaxed mb-12 font-body font-light">
              שירותי משחק מקצועיים לסרטי תדמית, פרסומות והפקות וידאו. בניית דמות המעבירה את המסר העסקי בצורה מדויקת, אמינה ומרשימה.
            </p>
            <div className="mb-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black rounded-3xl overflow-hidden shadow-xl border-2 border-lilac-50 aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/EU5siooDAwc?modestbranding=1&rel=0"
                  title="משחק ותדמית - סרטון 1"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="bg-black rounded-3xl overflow-hidden shadow-xl border-2 border-lilac-50 aspect-video w-full">
                <iframe
                  src="https://www.youtube.com/embed/5nLVGvhtgq4?modestbranding=1&rel=0"
                  title="משחק ותדמית - סרטון 2"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {[
                { id: '2uGdlgGIVxg', title: 'משחק ותדמית 1' },
                { id: 'fTEVJsd5wwU', title: 'משחק ותדמית 2' },
                { id: 'JC-7pI5MiAk', title: 'משחק ותדמית 3' }
              ].map((video, i) => (
                <div 
                  key={i} 
                  className="bg-black rounded-3xl overflow-hidden shadow-xl border-2 border-lilac-50 aspect-[9/16] max-w-[280px] mx-auto w-full"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voiceover Section */}
      <section id="voiceover" className="py-32 px-6 bg-lilac-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-lilac-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-lilac-600 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-6xl font-headline font-light mb-6 leading-tight">קריינות ומוסיקה לפרסומות</h2>
              <div className="h-[1px] w-48 bg-[#FDE047] mx-auto mb-10"></div>
              <p className="text-xl text-lilac-100 leading-relaxed mb-10 font-body font-light max-w-2xl mx-auto">
                הקלטות קריינות מקצועיות למגוון מדיות - רדיו, טלוויזיה, דיגיטל ומערכות טלפוניה. יצירת מוסיקה מקורית וג'ינגלים המותאמים אישית למותג שלך, המעניקים לו זהות קולית ייחודית וזכירה.
              </p>
              <div className="space-y-5">
                {[
                  { title: 'פרפרים - מתוך המופע של אודיה', duration: '0:30', src: '/audio/פרפרים - מתוך המופע של אודיה.wav' },
                  { title: 'Palace דיור מוגן - קריינות', duration: '0:15', src: '/audio/Palace דיור מוגן - קריינות.mp3' },
                  { title: 'קריינות להשתלמות עובדים', duration: '1:20', src: '/audio/קריינות להשתלמות עובדים.wav' },
                ].map((track, idx) => (
                  <AudioPlayerItem key={idx} title={track.title} duration={track.duration} src={track.src} />
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative pt-12 md:pt-20"
            >
              <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-4 border-white/10 bg-black scale-110 origin-top">
                <iframe
                  src="https://www.youtube.com/embed/KvvsnMuVZKM?modestbranding=1&rel=0"
                  title="קריינות ומוסיקה לפרסומות"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-lilac-500 rounded-full -z-10 blur-[100px] opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-lilac-50/50 rounded-[4rem] p-12 md:p-24 overflow-hidden relative border border-lilac-100">
            <div className="grid md:grid-cols-2 gap-20 relative z-10">
              <div>
                <h2 className="text-5xl md:text-6xl font-headline font-light mb-10 text-lilac-900 leading-tight">בואו ניצור משהו מופלא יחד</h2>
                <p className="text-xl text-lilac-700 mb-12 font-body font-light">
                  זמינה לשיתופי פעולה, הופעות ופרויקטים אמנותיים. צרו קשר לתיאום פגישה או לקבלת הצעת מחיר מותאמת אישית.
                </p>
                
                <div className="space-y-8">
                  <a href="tel:+972504331354" className="flex items-center gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-lilac-600 shadow-sm group-hover:bg-lilac-600 group-hover:text-white transition-all">
                      <Phone size={28} />
                    </div>
                    <div>
                      <span className="block text-xs text-lilac-400 uppercase tracking-[0.2em] mb-1">טלפון</span>
                      <span className="text-2xl font-body font-medium">050-4331354</span>
                    </div>
                  </a>
                  
                  <a href="mailto:avigailifergan@gmail.com" className="flex items-center gap-8 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-lilac-600 shadow-sm group-hover:bg-lilac-600 group-hover:text-white transition-all">
                      <Mail size={28} />
                    </div>
                    <div>
                      <span className="block text-xs text-lilac-400 uppercase tracking-[0.2em] mb-1">אימייל</span>
                      <span className="text-2xl font-body font-medium">avigailifergan@gmail.com</span>
                    </div>
                  </a>
                </div>

                <div className="flex gap-5 mt-16">
                  <a 
                    href="https://www.instagram.com/avigaili/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-lilac-600 hover:bg-lilac-600 hover:text-white transition-all shadow-sm"
                  >
                    <Instagram size={24} />
                  </a>
                  <a 
                    href="https://www.facebook.com/avigail.ifergan/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-lilac-600 hover:bg-lilac-600 hover:text-white transition-all shadow-sm"
                  >
                    <Facebook size={24} />
                  </a>
                </div>
              </div>

              <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(139,92,246,0.1)] border border-lilac-200">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-3">
                    <label className="text-sm font-body font-medium text-lilac-600 mr-2">שם מלא</label>
                    <input 
                      type="text" 
                      className="w-full px-8 py-5 bg-lilac-50/50 border border-lilac-100 rounded-[1.5rem] focus:ring-2 focus:ring-lilac-200 focus:bg-white transition-all outline-none"
                      placeholder="איך קוראים לך?"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-body font-medium text-lilac-600 mr-2">אימייל / טלפון</label>
                    <input 
                      type="text" 
                      className="w-full px-8 py-5 bg-lilac-50/50 border border-lilac-100 rounded-[1.5rem] focus:ring-2 focus:ring-lilac-200 focus:bg-white transition-all outline-none"
                      placeholder="איך נחזור אליך?"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-body font-medium text-lilac-600 mr-2">הודעה</label>
                    <textarea 
                      rows={4}
                      className="w-full px-8 py-5 bg-lilac-50/50 border border-lilac-100 rounded-[1.5rem] focus:ring-2 focus:ring-lilac-200 focus:bg-white transition-all outline-none resize-none"
                      placeholder="ספרו לי על האירוע שלכם..."
                    ></textarea>
                  </div>
                  <button className="w-full py-5 bg-lilac-600 text-white rounded-[1.5rem] font-body font-medium text-lg hover:bg-lilac-700 transition-all shadow-xl shadow-lilac-200/50">
                    שלחו הודעה
                  </button>
                </form>
              </div>
            </div>
          </div>
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
