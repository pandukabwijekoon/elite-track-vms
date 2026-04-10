import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGasPump, FaHistory, FaPlus, FaCheck } from 'react-icons/fa';
import api from '../api/axios';

const FuelTracker = ({ vehicle, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    liters: '',
    cost: '',
    mileage: vehicle.mileage || ''
  });
  const [loading, setLoading] = useState(false);

  // Calculate Average KM/L
  const calculateEfficiency = () => {
    if (!vehicle.fuelLogs || vehicle.fuelLogs.length < 2) return null;
    
    const logs = [...vehicle.fuelLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = logs[0];
    const previous = logs[1];
    
    const kmDriven = latest.mileage - previous.mileage;
    if (kmDriven <= 0) return null;
    
    return (kmDriven / latest.liters).toFixed(2);
  };

  const efficiency = calculateEfficiency();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/vehicles/${vehicle._id}/fuel`, formData);
      setFormData({ liters: '', cost: '', mileage: '' });
      setIsAdding(false);
      onUpdate();
    } catch (err) {
      alert('Failed to log fuel: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FaGasPump style={{ color: 'var(--primary)', fontSize: '1rem' }} />
          <h3 style={{ margin: 0, fontSize: '0.85rem', letterSpacing: '1px' }}>FUEL EFFICIENCY</h3>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '900' }}
          >
            <FaPlus /> LOG REFUEL
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            style={{ display: 'grid', gap: '0.8rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <input 
                type="number" step="0.01" placeholder="Liters" required
                value={formData.liters} onChange={(e) => setFormData({...formData, liters: e.target.value})}
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '4px', color: 'white', fontSize: '0.75rem' }}
              />
              <input 
                type="number" placeholder="Cost (LKR)" required
                value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})}
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '4px', color: 'white', fontSize: '0.75rem' }}
              />
            </div>
            <input 
              type="number" placeholder="Current Mileage" required
              value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})}
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '4px', color: 'white', fontSize: '0.75rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="submit" disabled={loading}
                style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', padding: '0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}
              >
                {loading ? 'SYNCING...' : 'CONFIRM LOG'}
              </button>
              <button 
                type="button" onClick={() => setIsAdding(false)}
                style={{ padding: '0.6rem', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', fontSize: '0.7rem' }}
              >
                CANCEL
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '0.5rem 0' }}
          >
            <h2 className="neon-amount-white" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
              {efficiency || '--.--'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>KM/L</span>
            </h2>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>
              {efficiency ? 'BASED ON LAST ENTRY' : 'LOG 2 REFUELS TO CALC'}
            </p>

            <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>LAST LOG</p>
                <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>{vehicle.fuelLogs?.length > 0 ? new Date(vehicle.fuelLogs[vehicle.fuelLogs.length-1].date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>TOTAL LOGS</p>
                <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>{vehicle.fuelLogs?.length || 0}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FuelTracker;
