import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PartModal from '../components/PartModal';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaStore, FaSearch, FaFilter, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import marketplaceBanner from '../assets/1116.jpg';

const Marketplace = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: 0, item: '' });

  const fetchParts = async () => {
    try {
      const res = await api.get(`/marketplace?search=${search}`);
      setParts(res.data.data);
    } catch (err) {
      console.error('Error fetching marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [search]);

  const handleOpenModal = (part = null) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleEngage = (part) => {
    setPaymentData({ amount: part.price, item: part.title });
    setIsPaymentOpen(true);
  };

  const handleDeletePart = async (id) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      try {
        await api.delete(`/marketplace/${id}`);
        fetchParts();
      } catch (err) {
        alert('Failed to delete listing');
      }
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: 'clamp(0.5rem, 3vw, 2rem)', transition: 'var(--transition)' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          marginBottom: '2.5rem',
          marginTop: window.innerWidth <= 1024 ? '4.5rem' : '0'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '1.2rem'
          }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '0.4rem' }}>PARTS <span style={{ color: 'var(--primary)' }}>MARKETPLACE</span></h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px' }}>FIND, BUY, AND SELL PERFORMANCE COMPONENTS</p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="animate-glow"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '0.6rem 1.2rem', 
                borderRadius: 'var(--radius-sm)', 
                fontWeight: '900', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem',
                width: window.innerWidth <= 768 ? '100%' : 'auto',
                justifyContent: 'center',
                letterSpacing: '0.5px',
                fontSize: '0.8rem'
              }}
            >
              <FaPlus /> LIST A PART
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth <= 640 ? 'column' : 'row',
            gap: '0.6rem' 
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FaSearch style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6, fontSize: '0.8rem' }} />
              <input 
                type="text" 
                placeholder="Search engine parts, wheels, turbos..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.6rem 1rem 0.6rem 2.5rem', 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.8rem'
                }} 
              />
            </div>
            <button className="glass" style={{ 
              padding: '0.6rem 1rem', 
              borderRadius: 'var(--radius-sm)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '700',
              letterSpacing: '0.5px',
              fontSize: '0.75rem'
            }}>
              <FaFilter /> FILTERS
            </button>
          </div>
        </header>

        {/* Feature Banner */}
        <div style={{ 
          height: '140px', 
          borderRadius: 'var(--radius-md)', 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), transparent), url(${marketplaceBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '1.2rem'
        }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.6rem', letterSpacing: '3px' }}>PERFORMANCE NEXUS</span>
            <h2 style={{ fontSize: '1.3rem', margin: '0.2rem 0' }}>ELITE PARTS HUB</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '350px', fontSize: '0.75rem' }}>The most exclusive inventory for custom builds.</p>
          </div>
        </div>

        {loading ? <p>Scanning marketplace...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            {parts.length === 0 ? (
              <div className="glass" style={{ gridColumn: '1/-1', padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <FaStore style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.05)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: '800', fontSize: '0.8rem' }}>NO LISTINGS CAPTURED IN RANGE</p>
              </div>
            ) : (
              parts.map(part => (
                <motion.div 
                  key={part._id} 
                  whileHover={{ y: -5 }}
                  className="glass" 
                  style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ height: '110px', backgroundColor: '#111', backgroundImage: `url(${part.images?.[0] || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div style={{ padding: '0.8rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '1px' }}>{part.category?.toUpperCase()}</span>
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: '700' }}>{part.condition?.toUpperCase()}</span>
                    </div>
                    <h3 style={{ fontSize: '0.85rem', marginBottom: '0.8rem', fontWeight: '800', lineHeight: '1.3' }}>{part.title}</h3>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="neon-amount-white" style={{ fontSize: '0.95rem', fontWeight: '900' }}>{part.currency} {part.price?.toLocaleString()}</span>
                        {part.seller?._id === user?.id || part.seller === user?.id ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button onClick={() => handleOpenModal(part)} style={{ color: 'var(--text-muted)', backgroundColor: 'transparent', fontSize: '0.85rem' }}><FaEdit /></button>
                            <button onClick={() => handleDeletePart(part._id)} style={{ color: '#FF5252', backgroundColor: 'transparent', fontSize: '0.85rem' }}><FaTrash /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleEngage(part)} style={{ backgroundColor: 'var(--primary)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '900', color: 'white' }}>ENGAGE</button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      <PartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        part={selectedPart}
        onSuccess={fetchParts}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={paymentData.amount}
        item={paymentData.item}
        onSuccess={(id) => console.log('Payment unique transaction:', id)}
      />
    </div>
  );
};

export default Marketplace;
