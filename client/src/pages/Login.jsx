import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import loginBg from '../assets/login-bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      backgroundColor: 'var(--bg-dark)',
      overflow: 'hidden'
    }}>
      {/* Visual Side */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          flex: '1.2', 
          position: 'relative', 
          display: 'block',
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRight: '1px solid var(--border)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, transparent 0%, var(--bg-dark) 100%), linear-gradient(to bottom, transparent 70%, var(--bg-dark) 100%)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', zIndex: 2 }}>
          <h2 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-2px', color: 'white', textTransform: 'uppercase', lineHeight: '0.9' }}>
            PRECISION <br /> <span style={{ color: 'var(--primary)' }}>AUTHENTICATION</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: '300' }}>SECURE ACCESS TO YOUR DIGITAL GARAGE</p>
        </div>
      </motion.div>

      {/* Form Side */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '4rem',
        zIndex: 2
      }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>LOG<span style={{ color: 'var(--primary)' }}>IN</span></h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>ENTER YOUR CREDENTIALS TO LOGIN</p>
          </motion.div>
          
          {error && (
            <motion.div 
              variants={itemVariants}
              style={{ 
                backgroundColor: 'rgba(255, 23, 68, 0.1)', 
                color: 'var(--error)', 
                padding: '1rem', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: '1.5rem',
                border: '1px solid var(--error)',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-muted)' }}>NETWORK ID (EMAIL)</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1.2rem 1.2rem 1.2rem 3.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  placeholder="driver@elitetracker.com"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-muted)' }}>ENCRYPTION KEY (PASSWORD)</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1.2rem 1.2rem 1.2rem 3.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  placeholder="••••••••"
                />
              </div>
            </motion.div>
            
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: 'var(--primary-hover)' }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="animate-glow"
              style={{ 
                width: '100%', 
                padding: '1.2rem', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                borderRadius: 'var(--radius-sm)', 
                fontWeight: '900',
                fontSize: '1.1rem',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'SYNCHRONIZING...' : 'LOGIN SESSION'}
              {!loading && <FaArrowRight />}
            </motion.button>
          </form>
          
          <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            New driver? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '800' }}>REQUEST ACCESS</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

