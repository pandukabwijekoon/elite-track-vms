import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const AIGuardian = ({ vehicle }) => {
  const calculateHealth = () => {
    // 60% Service Score
    const serviceInterval = vehicle.serviceInterval || 12000;
    const mileageSinceService = vehicle.mileage - (vehicle.lastServiceMileage || 0);
    const serviceScore = Math.max(0, 100 - (mileageSinceService / serviceInterval) * 100);

    // 40% Age/Usage Score (Base degrades 2% per year from 100)
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - vehicle.year);
    const ageScore = Math.max(60, 100 - age * 2);

    const totalScore = Math.round((serviceScore * 0.6) + (ageScore * 0.4));
    return totalScore;
  };

  const score = calculateHealth();
  const getStatusColor = () => {
    if (score > 85) return '#00E676'; // Pristine
    if (score > 60) return '#FFD600'; // Warning
    return '#FF1744'; // Critical
  };

  const getStatusText = () => {
    if (score > 85) return 'PRISTINE';
    if (score > 60) return 'FAIR';
    return 'CRITICAL';
  };

  const getTip = () => {
    if (score > 85) return 'All systems nominal. Ready for deployment.';
    if (score > 60) return 'Efficiency dipping. Schedule routine check soon.';
    return 'Immediate service required to prevent breakdown.';
  };

  return (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <FaShieldAlt style={{ color: getStatusColor(), fontSize: '1.2rem' }} />
        <div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '1px' }}>AI GUARDIAN</h3>
          <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800' }}>INTELLIGENT DIAGNOSTICS</p>
        </div>
      </div>

      <div style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Semi-circular Gauge Background */}
        <div style={{ 
          width: '180px', 
          height: '90px', 
          border: '8px solid rgba(255,255,255,0.05)', 
          borderBottom: 'none', 
          borderTopLeftRadius: '100px', 
          borderTopRightRadius: '100px',
          position: 'absolute',
          top: '20px'
        }} />
        
        {/* Active Progress */}
        <motion.div 
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (score * 1.8) }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ 
            width: '180px', 
            height: '90px', 
            border: `8px solid ${getStatusColor()}`, 
            borderBottom: 'none', 
            borderTopLeftRadius: '100px', 
            borderTopRightRadius: '100px',
            position: 'absolute',
            top: '20px',
            transformOrigin: 'bottom center',
            boxShadow: `0 0 15px ${getStatusColor()}66`
          }} 
        />

        <div style={{ textAlign: 'center', zIndex: 1, marginTop: '20px' }}>
          <h2 className="neon-amount" style={{ fontSize: '2.2rem', margin: 0, color: getStatusColor() }}>{score}%</h2>
          <p style={{ fontSize: '0.7rem', fontWeight: '900', color: getStatusColor(), letterSpacing: '2px' }}>{getStatusText()}</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.8rem', 
        backgroundColor: 'rgba(255,255,255,0.02)', 
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6rem'
      }}>
        {score > 60 ? <FaCheckCircle style={{ color: '#00E676', marginTop: '3px', fontSize: '0.8rem' }} /> : <FaExclamationTriangle style={{ color: '#FF1744', marginTop: '3px', fontSize: '0.8rem' }} />}
        <p style={{ fontSize: '0.7rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.4' }}>
          <strong style={{ color: 'white' }}>SYSTEM TIP:</strong> {getTip()}
        </p>
      </div>

      {/* Scanning Effect */}
      <motion.div 
        animate={{ y: [0, 180, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '2px', 
          background: `linear-gradient(90deg, transparent, ${getStatusColor()}44, transparent)`,
          zIndex: 0,
          opacity: 0.3
        }}
      />
    </div>
  );
};

export default AIGuardian;
