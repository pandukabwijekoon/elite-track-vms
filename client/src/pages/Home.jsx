import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaCogs, FaHistory, FaTools, FaCalculator, FaChevronRight } from 'react-icons/fa';
import BrandMarquee from '../components/BrandMarquee';
import { useAuth } from '../context/AuthContext';
import heroGtr from '../assets/hero_gtr.png';
import heroPorsche from '../assets/hero_porsche.png';
import heroSupra from '../assets/hero_supra.png';
import arsenalBg from '../assets/1118.jpg';
import footerBg from '../assets/1119.jpg';

const HERO_IMAGES = [heroGtr, heroPorsche, heroSupra];

const Home = () => {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [500, 1500], [-50, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [currentIdx, setCurrentIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        height: '110vh', 
        display: 'flex', 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, transparent, var(--bg-dark))'
      }}>
        {/* Cinematic Background Slider */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 2, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" }
            }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${HERO_IMAGES[currentIdx]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3) contrast(1.2) saturate(0.8)',
              zIndex: 0
            }}
          />
        </AnimatePresence>

        {/* Stealth UI Grid Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '30px 30px',
          zIndex: 1,
          opacity: 0.5
        }} />

        {/* Neon Scan Overlay */}
        <div className="stealth-scan" style={{ opacity: 0.2, zIndex: 1 }} />

        <div style={{ 
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 
              style={{ 
                fontSize: 'clamp(3.5rem, 15vw, 8.5rem)',
                marginBottom: '1rem',
                lineHeight: '0.85',
                textTransform: 'uppercase',
                fontWeight: '900',
                letterSpacing: '-4px',
                filter: 'drop-shadow(0 0 15px var(--primary-glow))'
              }}
              className="title-gradient"
            >
              ELITE <br /> TRACKER
            </h1>
            <div className="stealth-scan" style={{ height: '3px', width: '100%', position: 'absolute', top: '50%', opacity: 0.5 }} />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.4rem)', 
              color: 'var(--text-main)', 
              maxWidth: '800px', 
              marginBottom: '3rem',
              fontWeight: '300',
              letterSpacing: '1px'
            }}
          >
            The ultimate ecosystem for luxury performance vehicles. <br className="desktop-only" />
            Monitor, Modify, and Master your machine.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ 
              display: 'flex', 
              gap: '2rem',
              flexDirection: window.innerWidth <= 640 ? 'column' : 'row',
              width: window.innerWidth <= 640 ? '100%' : 'auto',
              maxWidth: '400px'
            }}
          >
            <Link to="/register" className="animate-glow" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '1.2rem 3.5rem', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: '800',
              fontSize: '1.2rem',
              letterSpacing: '2px',
              textAlign: 'center'
            }}>
              REGISTER
            </Link>
            <Link to="/login" style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-bright)', 
              color: 'white', 
              padding: '1.2rem 3.5rem', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: '800',
              fontSize: '1.2rem',
              letterSpacing: '2px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              LOGIN
            </Link>
          </motion.div>
        </div>

        {/* Floating Marquee in Hero */}
        <div style={{ position: 'absolute', bottom: '0', width: '100%', zIndex: 1 }}>
          <BrandMarquee />
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ 
        padding: 'clamp(50px, 15vh, 150px) 1rem', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Parallax Background for Arsenal */}
        <motion.div 
          style={{ y: y2 }}
          style={{
            position: 'absolute',
            top: '-20%',
            left: 0,
            right: 0,
            bottom: '-20%',
            backgroundImage: `url(${arsenalBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0
          }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', textTransform: 'uppercase', letterSpacing: '-1px' }}
            >
              THE <span style={{ color: 'var(--primary)' }}>ARSENAL</span>
            </motion.h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--primary)', margin: '0 auto' }}></div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
              gap: '2rem' 
            }}
          >
            <FeatureCard 
              icon={<FaHistory />} 
              title="Registry" 
              desc="Surgical logging of every mechanical interaction and maintenance event."
            />
            <FeatureCard 
              icon={<FaCogs />} 
              title="Evolution" 
              desc="Document the transformation of your build with full performance analytics."
            />
            <FeatureCard 
              icon={<FaTools />} 
              title="Nexus" 
              desc="A curated marketplace for elite components and high-performance hardware."
            />
            <FeatureCard 
              icon={<FaCalculator />} 
              title="Intelligence" 
              desc="Real-time investment tracking and algorithmic cost projections."
            />
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ 
        padding: '120px 2rem', 
        borderTop: '1px solid var(--border)', 
        textAlign: 'center', 
        position: 'relative',
        backgroundColor: '#000',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${footerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          filter: 'grayscale(100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ color: 'var(--primary)', letterSpacing: '8px', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '900' }}>ELITE TRACKER</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: '700' }}>
            ENGINEERED FOR THE DISCERNING DRIVER. <br />
            POWERED BY PRECISION. © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ y: -15, backgroundColor: 'rgba(255,255,255,0.05)' }}
    className="glass"
    style={{ 
      padding: '4rem 3rem', 
      borderRadius: 'var(--radius-lg)', 
      borderTop: '2px solid transparent',
      position: 'relative'
    }}
  >
    <div style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '2rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }}>{icon}</div>
    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>{desc}</p>
  </motion.div>
);

export default Home;

