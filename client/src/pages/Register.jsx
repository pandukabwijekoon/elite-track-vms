import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import registerBg from '../assets/register-bg.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match');
    }
    const result = await register({ name: formData.name, email: formData.email, password: formData.password });
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
            <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>REG<span style={{ color: 'var(--primary)' }}>ISTER</span></h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>JOIN THE ELITE PERFORMANCE NETWORK</p>
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
            <motion.div variants={itemVariants} style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-muted)' }}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                <input 
                  type="text" 
                  name="name"
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.2rem 1rem 3.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="John Doe"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-muted)' }}>NETWORK ID (EMAIL)</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                <input 
                  type="email" 
                  name="email"
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.2rem 1rem 3.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="driver@elitetracker.com"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-muted)' }}>ENCRYPTION KEY (PASSWORD)</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                <input 
                  type="password" 
                  name="password"
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.2rem 1rem 3.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-muted)' }}>CONFIRM KEY</label>
              <div style={{ position: 'relative' }}>
                <FaCheckCircle style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} />
                <input 
                  type="password" 
                  name="confirmPassword"
                  required 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.2rem 1rem 3.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    outline: 'none'
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
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'PROCESSING...' : 'ESTABLISH ACCOUNT'}
            </motion.button>
          </form>
          
          <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '800' }}>ACCESS SESSION</Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Visual Side */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          flex: '1.2', 
          position: 'relative', 
          display: 'block',
          backgroundImage: `url(${registerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderLeft: '1px solid var(--border)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to left, transparent 0%, var(--bg-dark) 100%), linear-gradient(to bottom, transparent 70%, var(--bg-dark) 100%)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', zIndex: 2, textAlign: 'right' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-2px', color: 'white', textTransform: 'uppercase', lineHeight: '0.9' }}>
            ENHANCED <br /> <span style={{ color: 'var(--primary)' }}>ECOSYSTEM</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: '300' }}>THE NEW STANDARD FOR VEHICLE MANAGEMENT</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
