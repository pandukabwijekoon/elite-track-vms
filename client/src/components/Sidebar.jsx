import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaHistory, FaCogs, FaStore, FaChartPie, FaSignOutAlt, FaBars, FaTimes, FaFolderOpen } from 'react-icons/fa';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="mobile-only animate-glow"
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 1000,
          backgroundColor: 'var(--primary)',
          color: 'white',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 0 15px var(--primary-glow)'
        }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 998
            }}
            className="mobile-only"
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="glass"
        initial={false}
        animate={{ 
          x: (typeof window !== 'undefined' && window.innerWidth <= 1024) ? (isOpen ? 0 : -300) : 0,
          opacity: 1
        }}
        style={{ 
          width: '280px', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          display: 'flex', 
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          zIndex: 999,
          borderRight: '1px solid var(--border)',
          backgroundColor: 'rgba(10, 10, 10, 0.95)'
        }}
      >
        <div style={{ marginBottom: '3rem', textAlign: 'center', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', letterSpacing: '3px', fontWeight: '900' }}>
            ELITE<span style={{ color: 'var(--primary)' }}>TRACK</span>
          </h2>
        </div>

        <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '900', marginBottom: '1.2rem', letterSpacing: '2px', opacity: 0.6 }}>COMMAND CENTER</p>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <SidebarLink to="/dashboard" icon={<FaCar />} label="Garage" onClick={() => setIsOpen(false)} />
            <SidebarLink to="/services" icon={<FaHistory />} label="Service Log" onClick={() => setIsOpen(false)} />
            <SidebarLink to="/modifications" icon={<FaCogs />} label="Evolution" onClick={() => setIsOpen(false)} />
            <SidebarLink to="/glovebox" icon={<FaFolderOpen />} label="Glovebox" onClick={() => setIsOpen(false)} />
            <SidebarLink to="/marketplace" icon={<FaStore />} label="Nexus" onClick={() => setIsOpen(false)} />
            <SidebarLink to="/costs" icon={<FaChartPie />} label="Analytics" onClick={() => setIsOpen(false)} />
            
            <div style={{ height: '2rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '2px', opacity: 0.6 }}>SYSTEM</p>
            <button 
              onClick={handleLogout}
              className="animate-glow"
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.2rem', 
                padding: '1.2rem', 
                color: 'white',
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: '900',
                fontSize: '0.95rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 0 15px var(--primary-glow)'
              }}
            >
              <FaSignOutAlt style={{ fontSize: '1.4rem' }} />
              <span>LOGOUT SESSION</span>
            </button>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              fontWeight: '900',
              fontSize: '1.1rem',
              border: '1px solid var(--border)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.5px', marginBottom: '2px' }}>{user?.name?.toUpperCase()}</p>
              <p style={{ color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '2px' }}>RANK: {user?.role?.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      padding: '1.2rem',
      borderRadius: 'var(--radius-sm)',
      color: isActive ? 'white' : 'var(--text-muted)',
      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
      boxShadow: isActive ? '0 10px 20px rgba(227, 0, 0, 0.2)' : 'none',
      fontWeight: isActive ? '900' : '500',
      letterSpacing: '1px',
      fontSize: '0.95rem',
      transition: 'var(--transition)',
      border: isActive ? 'none' : '1px solid transparent'
    })}
    onMouseOver={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.border = '1px solid var(--border-bright)'; }}
    onMouseOut={(e) => { e.currentTarget.style.border = '1px solid transparent'; }}
  >
    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
    <span>{label.toUpperCase()}</span>
  </NavLink>
);

export default Sidebar;

