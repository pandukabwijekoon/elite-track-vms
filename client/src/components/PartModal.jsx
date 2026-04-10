import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import api from '../api/axios';

const PartModal = ({ isOpen, onClose, part, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engine Parts',
    description: '',
    brand: '',
    condition: 'New',
    price: 0,
    currency: 'LKR',
    location: '',
    contactPhone: '',
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (part) {
      setFormData({
        title: part.title || '',
        category: part.category || 'Engine Parts',
        description: part.description || '',
        brand: part.brand || '',
        condition: part.condition || 'New',
        price: part.price || 0,
        currency: part.currency || 'LKR',
        location: part.location || '',
        contactPhone: part.contactPhone || '',
        isAvailable: part.isAvailable !== undefined ? part.isAvailable : true
      });
    } else {
      setFormData({
        title: '',
        category: 'Engine Parts',
        description: '',
        brand: '',
        condition: 'New',
        price: 0,
        currency: 'LKR',
        location: '',
        contactPhone: '',
        isAvailable: true
      });
    }
    setError('');
  }, [part, isOpen]);

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
      if (part) {
        await api.put(`/marketplace/${part._id}`, formData);
      } else {
        await api.post('/marketplace', formData);
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
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{part ? 'EDIT' : 'LIST A'} <span style={{ color: 'var(--primary)' }}>PART</span></h2>
            <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '1rem' }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PART TITLE *</label>
              <input 
                type="text" name="title" required value={formData.title} onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                placeholder="e.g. Garrett Turbo GTX3582R"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CATEGORY *</label>
                <select 
                  name="category" required value={formData.category} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="Engine Parts">Engine Parts</option>
                  <option value="Body Parts">Body Parts</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Transmission">Transmission</option>
                  <option value="Exhaust">Exhaust</option>
                  <option value="Wheels & Tires">Wheels & Tires</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONDITION *</label>
                <select 
                  name="condition" required value={formData.condition} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="For Parts">For Parts</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PRICE (LKR) *</label>
                <input 
                  type="number" name="price" required value={formData.price} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>BRAND</label>
                <input 
                  type="text" name="brand" value={formData.brand} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>LOCATION</label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. Colombo, Sri Lanka"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONTACT PHONE</label>
                <input 
                  type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DESCRIPTION</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', minHeight: '80px' }}
                placeholder="Give more details about the part..."
              />
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange}
                id="isAvailable"
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <label htmlFor="isAvailable" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Part is currently available for sale</label>
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
              {loading ? 'PROCESSING...' : (part ? 'UPDATE LISTING' : 'LIST PART')}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PartModal;
