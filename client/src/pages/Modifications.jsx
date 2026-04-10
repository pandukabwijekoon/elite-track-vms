import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ModModal from '../components/ModModal';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCogs, FaPlus, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa';
import modBanner from '../assets/1115.jpg';

const Modifications = () => {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMod, setSelectedMod] = useState(null);
  const [evolutionView, setEvolutionView] = useState({}); // { modId: boolean }

  const fetchMods = async () => {
    try {
      const res = await api.get('/modifications');
      setMods(res.data.data);
    } catch (err) {
      console.error('Error fetching modifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMods();
  }, []);

  const handleOpenModal = (mod = null) => {
    setSelectedMod(mod);
    setIsModalOpen(true);
  };

  const handleDeleteMod = async (id) => {
    if (window.confirm('Are you sure you want to remove this modification from your portfolio?')) {
      try {
        await api.delete(`/modifications/${id}`);
        fetchMods();
      } catch (err) {
        alert('Failed to delete modification');
      }
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: 'clamp(1rem, 5vw, 3rem)', transition: 'var(--transition)' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1.5rem',
          marginBottom: '3rem',
          marginTop: window.innerWidth <= 1024 ? '4.5rem' : '0'
        }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 8vw, 2.5rem)', marginBottom: '0.5rem' }}>MOD <span style={{ color: 'var(--primary)' }}>PORTFOLIO</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>SHOWCASE YOUR CUSTOM BUILDS AND PERFORMANCE UPGRADES</p>
          </motion.div>
          <button 
            onClick={() => handleOpenModal()}
            className="animate-glow"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              padding: '1rem 2rem', 
              borderRadius: 'var(--radius-sm)', 
              fontWeight: '900', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.8rem',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              justifyContent: 'center',
              letterSpacing: '1px'
            }}
          >
            <FaPlus /> REGISTER MOD
          </button>
        </header>

        {/* Feature Banner */}
        <div style={{ 
          height: '280px', 
          borderRadius: 'var(--radius-md)', 
          backgroundImage: `linear-gradient(to top, var(--bg-dark), transparent), url(${modBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '3rem',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '2rem'
        }}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
             <p style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '3px', marginBottom: '0.2rem' }}>EVOLUTION PROJECT</p>
             <h2 style={{ margin: 0, fontSize: '1.5rem' }}>PERFORMANCE ARCHIVE</h2>
          </div>
        </div>

        {loading ? <p>Loading portfolio...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
            {mods.length === 0 ? (
              <div className="glass" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <FaCogs style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem' }} />
                <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: '800' }}>NO MODIFICATIONS DOCUMENTED YET</p>
              </div>
            ) : (
              mods.map(mod => (
                <motion.div 
                  key={mod._id} 
                  whileHover={{ y: -10 }}
                  className="glass" 
                  style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
                >
                  <div style={{ 
                    height: '240px', 
                    backgroundColor: '#111', 
                    backgroundImage: `linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8)), url(${
                      (mod.afterImage ? (mod.afterImage.startsWith('/') ? `http://localhost:5000${mod.afterImage}` : mod.afterImage) : 
                       (mod.beforeImage ? (mod.beforeImage.startsWith('/') ? `http://localhost:5000${mod.beforeImage}` : mod.beforeImage) : 
                        (mod.images?.[0] || 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=800')))
                    })`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>
                      {mod.category?.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '1px' }}>{mod.vehicle?.year} {mod.vehicle?.make?.toUpperCase()} {mod.vehicle?.model?.toUpperCase()}</p>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>{mod.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span className="neon-amount" style={{ fontSize: '1.2rem' }}>LKR {mod.totalCost?.toLocaleString()}</span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => handleOpenModal(mod)} style={{ color: 'var(--text-muted)', backgroundColor: 'transparent', fontSize: '1.1rem' }} title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDeleteMod(mod._id)} style={{ color: '#FF5252', backgroundColor: 'transparent', fontSize: '1.1rem' }} title="Delete"><FaTrash /></button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEvolutionView(prev => ({ ...prev, [mod._id]: !prev[mod._id] }))}
                      style={{ 
                        width: '100%', 
                        border: '1px solid var(--border)', 
                        padding: '0.8rem', 
                        borderRadius: 'var(--radius-sm)', 
                        color: 'white', 
                        backgroundColor: evolutionView[mod._id] ? 'rgba(227, 0, 0, 0.1)' : 'rgba(255,255,255,0.03)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem', 
                        fontSize: '0.8rem', 
                        fontWeight: '700', 
                        letterSpacing: '1px',
                        borderColor: evolutionView[mod._id] ? 'var(--primary)' : 'var(--border)'
                      }}
                    >
                      {evolutionView[mod._id] ? 'EXIT EVOLUTION' : 'VIEW EVOLUTION'} <FaChevronRight size={10} style={{ transform: evolutionView[mod._id] ? 'rotate(90deg)' : 'none' }} />
                    </button>

                    <AnimatePresence>
                      {evolutionView[mod._id] && (mod.beforeImage || mod.afterImage) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ marginTop: '1.5rem', overflow: 'hidden' }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <div style={{ position: 'relative' }}>
                              <img 
                                src={mod.beforeImage ? (mod.beforeImage.startsWith('/') ? `http://localhost:5000${mod.beforeImage}` : mod.beforeImage) : mod.images?.[0]} 
                                alt="Before" 
                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} 
                              />
                              <span style={{ position: 'absolute', bottom: '0.4rem', left: '0.4rem', backgroundColor: 'rgba(0,0,0,0.7)', padding: '0.2rem 0.5rem', fontSize: '0.5rem', fontWeight: '900', borderRadius: '2px' }}>STOCK</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <img 
                                src={mod.afterImage ? (mod.afterImage.startsWith('/') ? `http://localhost:5000${mod.afterImage}` : mod.afterImage) : mod.images?.[0]} 
                                alt="After" 
                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} 
                              />
                              <span style={{ position: 'absolute', bottom: '0.4rem', left: '0.4rem', backgroundColor: 'var(--primary)', padding: '0.2rem 0.5rem', fontSize: '0.5rem', fontWeight: '900', borderRadius: '2px' }}>MODIFIED</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      <ModModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mod={selectedMod}
        onSuccess={fetchMods}
      />
    </div>
  );
};

export default Modifications;

