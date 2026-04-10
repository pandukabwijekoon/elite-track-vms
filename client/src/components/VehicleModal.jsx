import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import api from '../api/axios';

const VehicleModal = ({ isOpen, onClose, vehicle, onSuccess }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    mileage: 0,
    averageMonthlyMileage: 1000,
    serviceInterval: 12000,
    color: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        registrationNumber: vehicle.registrationNumber || '',
        fuelType: vehicle.fuelType || 'Petrol',
        transmission: vehicle.transmission || 'Manual',
        mileage: vehicle.mileage || 0,
        averageMonthlyMileage: vehicle.averageMonthlyMileage || 1000,
        serviceInterval: vehicle.serviceInterval || 12000,
        color: vehicle.color || '',
        notes: vehicle.notes || ''
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        registrationNumber: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        mileage: 0,
        averageMonthlyMileage: 1000,
        serviceInterval: 12000,
        color: '',
        notes: ''
      });
    }
    setError('');
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (vehicle) {
        await api.put(`/vehicles/${vehicle._id}`, formData);
      } else {
        await api.post('/vehicles', formData);
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
            padding: '1.25rem', 
            borderRadius: 'var(--radius-md)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{vehicle ? 'EDIT' : 'ADD NEW'} <span style={{ color: 'var(--primary)' }}>VEHICLE</span></h2>
            <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '1.1rem' }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MAKE *</label>
                <input 
                  type="text" name="make" required value={formData.make} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. BMW"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MODEL *</label>
                <input 
                  type="text" name="model" required value={formData.model} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. M3"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>YEAR *</label>
                <input 
                  type="number" name="year" required value={formData.year} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>REGISTRATION NUMBER *</label>
                <input 
                  type="text" name="registrationNumber" required value={formData.registrationNumber} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. WP-ABC-1234"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>FUEL TYPE</label>
                <select 
                  name="fuelType" value={formData.fuelType} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MILEAGE (KM)</label>
                <input 
                  type="number" name="mileage" value={formData.mileage} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>AVG MONTHLY KM</label>
                <input 
                  type="number" name="averageMonthlyMileage" value={formData.averageMonthlyMileage} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. 1500"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>COLOR</label>
                <input 
                  type="text" name="color" value={formData.color} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. Midnight Black"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SERVICE INTERVAL (KM)</label>
                <input 
                  type="number" name="serviceInterval" value={formData.serviceInterval} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. 12000"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>NOTES</label>
                <textarea 
                  name="notes" value={formData.notes} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem', minHeight: '38px' }}
                  placeholder="Describe your vehicle..."
                />
              </div>
            </div>

            {error && <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: 'fit-content', 
                minWidth: '200px',
                margin: '1rem auto 0',
                display: 'block',
                padding: '0.6rem 2rem', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                fontWeight: '800', 
                borderRadius: 'var(--radius-sm)',
                letterSpacing: '0.5px',
                fontSize: '0.85rem'
              }}
            >
              {loading ? 'PROCESSING...' : (vehicle ? 'UPDATE VEHICLE' : 'ADD TO GARAGE')}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleModal;
