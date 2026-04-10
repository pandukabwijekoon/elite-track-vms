import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import api from '../api/axios';

const ServiceModal = ({ isOpen, onClose, record, onSuccess }) => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle: '',
    serviceType: 'Oil Change',
    serviceDate: new Date().toISOString().split('T')[0],
    mileageAtService: 0,
    cost: {
      laborCost: 0,
      partsCost: 0
    },
    serviceCenter: {
      name: ''
    },
    description: '',
    status: 'Completed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        setVehicles(res.data.data);
        if (res.data.data.length > 0 && !record) {
          setFormData(prev => ({ ...prev, vehicle: res.data.data[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      }
    };

    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen, record]);

  useEffect(() => {
    if (record) {
      setFormData({
        vehicle: record.vehicle?._id || record.vehicle || '',
        serviceType: record.serviceType || 'Oil Change',
        serviceDate: record.serviceDate ? new Date(record.serviceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        mileageAtService: record.mileageAtService || 0,
        cost: {
          laborCost: record.cost?.laborCost || 0,
          partsCost: record.cost?.partsCost || 0
        },
        serviceCenter: {
          name: record.serviceCenter?.name || ''
        },
        description: record.description || '',
        status: record.status || 'Completed'
      });
    } else {
      setFormData(prev => ({
        ...prev,
        serviceType: 'Oil Change',
        serviceDate: new Date().toISOString().split('T')[0],
        mileageAtService: 0,
        cost: { laborCost: 0, partsCost: 0 },
        serviceCenter: { name: '' },
        description: '',
        status: 'Completed'
      }));
    }
    setError('');
  }, [record, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (record) {
        await api.put(`/services/${record._id}`, formData);
      } else {
        await api.post('/services', formData);
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
            maxWidth: '550px', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-lg)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{record ? 'EDIT' : 'LOG'} <span style={{ color: 'var(--primary)' }}>SERVICE</span></h2>
            <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '1rem' }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>SELECT VEHICLE *</label>
              {vehicles.length > 0 ? (
                <select 
                  name="vehicle" required value={formData.vehicle} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.year} {v.make} {v.model} ({v.registrationNumber})</option>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SERVICE TYPE *</label>
                <select 
                  name="serviceType" required value={formData.serviceType} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                >
                  <option value="Oil Change">Oil Change</option>
                  <option value="Tire Rotation">Tire Rotation</option>
                  <option value="Brake Service">Brake Service</option>
                  <option value="Engine Tune-Up">Engine Tune-Up</option>
                  <option value="Air Filter">Air Filter</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Transmission Service">Transmission Service</option>
                  <option value="Wheel Alignment">Wheel Alignment</option>
                  <option value="Coolant Flush">Coolant Flush</option>
                  <option value="Spark Plugs">Spark Plugs</option>
                  <option value="AC Service">AC Service</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SERVICE DATE *</label>
                <input 
                  type="date" name="serviceDate" required value={formData.serviceDate} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MILEAGE AT SERVICE (KM) *</label>
                <input 
                  type="number" name="mileageAtService" required value={formData.mileageAtService} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SERVICE CENTER</label>
                <input 
                  type="text" name="serviceCenter.name" value={formData.serviceCenter.name} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                  placeholder="e.g. Toyota Plaza"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>LABOR COST (LKR)</label>
                <input 
                  type="number" name="cost.laborCost" value={formData.cost.laborCost} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PARTS COST (LKR)</label>
                <input 
                  type="number" name="cost.partsCost" value={formData.cost.partsCost} onChange={handleChange}
                  style={{ width: '100%', padding: '0.5rem 0.6rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DESCRIPTION</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'white', minHeight: '80px' }}
                placeholder="What was done during the service?"
              />
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
              {loading ? 'PROCESSING...' : (record ? 'UPDATE RECORD' : 'SAVE SERVICE LOG')}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ServiceModal;
