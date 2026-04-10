import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaUpload } from 'react-icons/fa';
import api from '../api/axios';

const ModModal = ({ isOpen, onClose, mod, onSuccess }) => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle: '',
    title: '',
    category: 'Engine',
    description: '',
    laborCost: 0,
    totalCost: 0,
    installedBy: 'Professional Shop',
    shopName: '',
    installDate: new Date().toISOString().split('T')[0],
    beforeImage: '',
    afterImage: '',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Local states for file handling
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        setVehicles(res.data.data);
        if (res.data.data.length > 0 && !mod) {
          setFormData(prev => ({ ...prev, vehicle: res.data.data[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      }
    };

    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen, mod]);

  useEffect(() => {
    if (mod) {
      setFormData({
        vehicle: mod.vehicle?._id || mod.vehicle || '',
        title: mod.title || '',
        category: mod.category || 'Engine',
        description: mod.description || '',
        laborCost: mod.laborCost || 0,
        totalCost: mod.totalCost || 0,
        installedBy: mod.installedBy || 'Professional Shop',
        shopName: mod.shopName || '',
        installDate: mod.installDate ? new Date(mod.installDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        beforeImage: mod.beforeImage || '',
        afterImage: mod.afterImage || '',
        isPublic: mod.isPublic !== undefined ? mod.isPublic : true
      });
      // Set initial previews from existing URLs
      if (mod.beforeImage) setBeforePreview(mod.beforeImage.startsWith('/') ? `http://localhost:5000${mod.beforeImage}` : mod.beforeImage);
      if (mod.afterImage) setAfterPreview(mod.afterImage.startsWith('/') ? `http://localhost:5000${mod.afterImage}` : mod.afterImage);
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        category: 'Engine',
        description: '',
        laborCost: 0,
        totalCost: 0,
        installedBy: 'Professional Shop',
        shopName: '',
        installDate: new Date().toISOString().split('T')[0],
        beforeImage: '',
        afterImage: '',
        isPublic: true
      }));
      setBeforePreview('');
      setAfterPreview('');
    }
    setBeforeFile(null);
    setAfterFile(null);
    setError('');
  }, [mod, isOpen]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'before') {
        setBeforeFile(file);
        setBeforePreview(URL.createObjectURL(file));
      } else {
        setAfterFile(file);
        setAfterPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use FormData for file uploads
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'partsUsed') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (beforeFile) data.append('beforeImage', beforeFile);
      if (afterFile) data.append('afterImage', afterFile);

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (mod) {
        await api.put(`/modifications/${mod._id}`, data, config);
      } else {
        await api.post('/modifications', data, config);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass"
          style={{ 
            width: '95%', 
            maxWidth: '500px', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{mod ? 'EDIT' : 'ADD NEW'} <span style={{ color: 'var(--primary)' }}>MODIFICATION</span></h2>
            <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '1rem' }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SELECT VEHICLE *</label>
              {vehicles.length > 0 ? (
                <select 
                  name="vehicle" required value={formData.vehicle} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.year} {v.make} {v.model}</option>
                  ))}
                </select>
              ) : (
                <div style={{ 
                  padding: '1.2rem', 
                  backgroundColor: 'rgba(227, 0, 0, 0.05)', 
                  border: '1px dashed var(--primary)', 
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No vehicles found in your garage.</p>
                  <button 
                    type="button"
                    onClick={() => window.location.href = '/dashboard'}
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      padding: '0.5rem 1.2rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: '800' 
                    }}
                  >
                    GO TO GARAGE
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MODIFICATION TITLE *</label>
                <input 
                  type="text" name="title" required value={formData.title} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. Stage 1 Tune"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CATEGORY *</label>
                <select 
                  name="category" required value={formData.category} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="Engine">Engine</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Exhaust">Exhaust</option>
                  <option value="Wheels & Tires">Wheels & Tires</option>
                  <option value="Body Kit">Body Kit</option>
                  <option value="Interior">Interior</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL COST (LKR) *</label>
                <input 
                  type="number" name="totalCost" required value={formData.totalCost} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>INSTALL DATE</label>
                <input 
                  type="date" name="installDate" value={formData.installDate} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>BEFORE IMAGE (STOCK)</label>
                <div 
                  onClick={() => document.getElementById('beforeInput').click()}
                  style={{ 
                    height: '100px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px dashed var(--border)', 
                    backgroundColor: 'var(--secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {beforePreview ? (
                    <img src={beforePreview} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <FaUpload style={{ color: 'var(--text-muted)', marginBottom: '0.4rem' }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>UPLOAD IMAGE</span>
                    </>
                  )}
                  <input id="beforeInput" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'before')} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>AFTER IMAGE (MODIFIED)</label>
                <div 
                  onClick={() => document.getElementById('afterInput').click()}
                  style={{ 
                    height: '100px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px dashed var(--border)', 
                    backgroundColor: 'var(--secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {afterPreview ? (
                    <img src={afterPreview} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <FaUpload style={{ color: 'var(--text-muted)', marginBottom: '0.4rem' }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>UPLOAD IMAGE</span>
                    </>
                  )}
                  <input id="afterInput" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'after')} style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>INSTALLED BY</label>
                <select 
                  name="installedBy" value={formData.installedBy} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="Self">Self</option>
                  <option value="Professional Shop">Professional Shop</option>
                  <option value="Dealer">Dealer</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SHOP NAME</label>
                <input 
                  type="text" name="shopName" value={formData.shopName} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DESCRIPTION</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', minHeight: '80px' }}
                placeholder="Details of the modification..."
              />
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange}
                id="isPublic"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <label htmlFor="isPublic" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Make this modification public in the showcase</label>
            </div>

            {error && <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.6rem', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                fontWeight: '800', 
                borderRadius: 'var(--radius-sm)',
                letterSpacing: '0.5px',
                fontSize: '0.85rem'
              }}
            >
              {loading ? 'PROCESSING...' : (mod ? 'UPDATE MODIFICATION' : 'ADD TO PORTFOLIO')}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModModal;
