import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { FaFolderOpen, FaFileAlt, FaCalendarTimes, FaPlus, FaTrash, FaShieldAlt } from 'react-icons/fa';
import api from '../api/axios';

const Glovebox = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Insurance',
    expiryDate: '',
    fileUrl: ''
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data.data);
      if (res.data.data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/vehicles/${selectedVehicle._id}/documents`, formData);
      setFormData({ title: '', type: 'Insurance', expiryDate: '', fileUrl: '' });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      alert('Failed to add document');
    }
  };

  const getDaysRemaining = (date) => {
    if (!date) return null;
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Sidebar />
      
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: 'clamp(1rem, 5vw, 3rem)' }}>
        <header style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <FaFolderOpen style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '900', letterSpacing: '4px', color: 'var(--text-muted)' }}>VAULT SYSTEM</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', margin: 0, textTransform: 'uppercase' }}>DIGITAL <span style={{ color: 'var(--primary)' }}>GLOVEBOX</span></h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Vehicle Selector */}
          <section className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', alignSelf: 'start' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', letterSpacing: '1px' }}>SELECT ASSET</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {vehicles.map(v => (
                <button 
                  key={v._id}
                  onClick={() => setSelectedVehicle(v)}
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: selectedVehicle?._id === v._id ? 'rgba(227, 0, 0, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedVehicle?._id === v._id ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800' }}>{v.year} {v.make} {v.model}</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>{v.registrationNumber}</p>
                  </div>
                  {selectedVehicle?._id === v._id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />}
                </button>
              ))}
            </div>
          </section>

          {/* Documents Grid */}
          <section style={{ flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>SECURED <span style={{ color: 'var(--primary)' }}>PAPERS</span></h3>
              <button 
                onClick={() => setIsAdding(true)}
                style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: 'var(--radius-sm)', fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px' }}
              >
                + DEPLOY DOC
              </button>
            </div>

            <AnimatePresence>
              {isAdding && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass" 
                  style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--primary)' }}
                >
                  <form onSubmit={handleAddDocument} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>DOCUMENT TITLE</label>
                      <input type="text" placeholder="e.g. Comprehensive Insurance" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>DOCUMENT TYPE</label>
                      <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }}>
                        <option>Insurance</option>
                        <option>Revenue License</option>
                        <option>Emission Test</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>EXPIRY DATE</label>
                      <input type="date" required value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>FILE URL / CLOUD LINK</label>
                      <input type="text" placeholder="https://..." value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                      <button type="submit" style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', padding: '0.8rem', borderRadius: '4px', fontWeight: '900' }}>STORE IN VAULT</button>
                      <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.8rem', borderRadius: '4px' }}>DISCARD</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {selectedVehicle?.documents?.map((doc, idx) => {
                const daysLeft = getDaysRemaining(doc.expiryDate);
                const isUrgent = daysLeft !== null && daysLeft <= 30;

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="glass" 
                    style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${isUrgent ? 'var(--primary)' : '#00E676'}` }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}><FaFileAlt /></div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{doc.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>TYPE: {doc.type.toUpperCase()}</p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      {daysLeft !== null && (
                        <div>
                          <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: isUrgent ? 'var(--primary)' : 'var(--text-muted)', letterSpacing: '1px' }}>
                            {isUrgent ? 'URGENT EXPIRY' : 'STATUS VALID'}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800' }}>{daysLeft} DAYS</p>
                        </div>
                      )}
                      <a 
                        href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '900' }}
                      >
                        VIEW DOC
                      </a>
                    </div>
                  </motion.div>
                );
              })}
              {selectedVehicle?.documents?.length === 0 && (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <FaShieldAlt style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }} />
                  <p>No documents stored for this asset. Start by deploying your Insurance or License.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Glovebox;
