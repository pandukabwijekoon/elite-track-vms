import React from 'react';
import { motion } from 'framer-motion';

const BrandMarquee = () => {
  const brands = [
    'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'BMW', 'MERCEDES-BENZ', 
    'AUDI', 'ASTON MARTIN', 'MCLAREN', 'ROLLS-ROYCE', 'BENTLEY',
    'BUGATTI', 'MASERATI', 'TESLA', 'NISSAN GT-R', 'TOYOTA GR'
  ];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div style={{ 
      width: '100%', 
      overflow: 'hidden', 
      padding: '2rem 0',
      backgroundColor: 'rgba(227, 0, 0, 0.03)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      position: 'relative'
    }}>
      {/* Gradients to hide edges */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '150px',
        background: 'linear-gradient(to right, var(--bg-dark), transparent)',
        zIndex: 2
      }}></div>
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '150px',
        background: 'linear-gradient(to left, var(--bg-dark), transparent)',
        zIndex: 2
      }}></div>

      <motion.div 
        animate={{ x: [0, -2000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ 
          display: 'flex', 
          gap: '4rem', 
          whiteSpace: 'nowrap',
          paddingLeft: '2rem'
        }}
      >
        {duplicatedBrands.map((brand, index) => (
          <span 
            key={index} 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: '900', 
              color: 'var(--text-main)', 
              letterSpacing: '4px',
              opacity: 0.3,
              transition: 'var(--transition)',
              cursor: 'default'
            }}
            onMouseOver={(e) => {
              e.target.style.opacity = '1';
              e.target.style.color = 'var(--primary)';
              e.target.style.textShadow = '0 0 15px var(--primary-glow)';
            }}
            onMouseOut={(e) => {
              e.target.style.opacity = '0.3';
              e.target.style.color = 'var(--text-main)';
              e.target.style.textShadow = 'none';
            }}
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default BrandMarquee;
