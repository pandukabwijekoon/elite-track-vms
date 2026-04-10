import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ServiceModal from '../components/ServiceModal';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaPlus, FaCalendarAlt, FaEdit, FaTrash, FaFilePdf, FaDownload } from 'react-icons/fa';
import serviceBanner from '../assets/1114.jpg';
import { generateVehicleReport } from '../utils/reportUtil';

const ServiceHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/services');
      setRecords(res.data.data);
    } catch (err) {
      console.error('Error fetching service records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleOpenModal = (record = null) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchRecords();
      } catch (err) {
        alert('Failed to delete record');
      }
    }
  };

  const handleDownloadVehicleReport = async (vehicleId) => {
    if (!vehicleId) return alert('No vehicle linked to this record.');
    setDownloadingId(vehicleId);
    try {
      const res = await api.get(`/vehicles/${vehicleId}/profile`);
      if (res.data.success) {
        generateVehicleReport(res.data.data);
      }
    } catch (err) {
      alert('Report generation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllServices = () => {
    if (records.length === 0) return alert('No service records to export.');
    // Get unique vehicle IDs and download a report for each
    const vehicleMap = {};
    records.forEach(r => {
      if (r.vehicle?._id) vehicleMap[r.vehicle._id] = true;
    });
    const uniqueVehicleIds = Object.keys(vehicleMap);
    uniqueVehicleIds.forEach(id => handleDownloadVehicleReport(id));
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: 'clamp(0.5rem, 3vw, 2rem)', transition: 'var(--transition)' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: window.innerWidth <= 768 ? 'stretch' : 'center', 
          gap: '1.5rem',
          marginBottom: '3rem',
          marginTop: window.innerWidth <= 1024 ? '4.5rem' : '0'
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '0.4rem' }}>SERVICE <span style={{ color: 'var(--primary)' }}>HISTORY</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px' }}>KEEP YOUR MACHINE IN PEAK CONDITION</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadAllServices}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)',
                color: 'white', 
                padding: '0.6rem 1rem', 
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                letterSpacing: '0.5px'
              }}
            >
              <FaDownload style={{ color: '#2979FF' }} /> EXPORT ALL
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal()}
              className="animate-glow"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '0.6rem 1rem', 
                borderRadius: 'var(--radius-sm)',
                fontWeight: '800',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 20px rgba(227, 0, 0, 0.3)',
                letterSpacing: '0.5px'
              }}
            >
              <FaPlus /> LOG SERVICE
            </motion.button>
          </div>
        </header>

        {/* Feature Banner */}
        <div style={{ 
          height: '240px', 
          borderRadius: 'var(--radius-md)', 
          backgroundImage: `linear-gradient(to bottom, transparent, var(--bg-dark)), url(${serviceBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '3rem',
          border: '1px solid var(--border)'
        }}></div>

        <div className="glass" style={{ borderRadius: 'var(--radius-md)', padding: 'clamp(1rem, 3vw, 2rem)' }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ letterSpacing: '2px', fontWeight: '800' }}>SCANNING MAINTENANCE LOGS...</p>
            </div>
          ) : records.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 2rem' }}>No service records found. Log your first service above.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="desktop-only">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1px' }}>
                      <th style={{ padding: '0.6rem' }}>DATE</th>
                      <th style={{ padding: '0.6rem' }}>VEHICLE</th>
                      <th style={{ padding: '0.6rem' }}>SERVICE TYPE</th>
                      <th style={{ padding: '0.6rem' }}>COST</th>
                      <th style={{ padding: '0.6rem' }}>MILEAGE</th>
                      <th style={{ padding: '0.6rem' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(record => (
                      <tr key={record._id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                        <td style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaCalendarAlt style={{ color: 'var(--primary)' }} />
                            {new Date(record.serviceDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ padding: '0.6rem', fontWeight: '800', letterSpacing: '0.5px', fontSize: '0.8rem' }}>
                          {record.vehicle?.make?.toUpperCase()} {record.vehicle?.model?.toUpperCase()}
                        </td>
                        <td style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid var(--border)' }}>
                            {record.serviceType?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <span className="neon-amount" style={{ fontSize: '0.9rem' }}>LKR {(record.cost?.totalCost || 0).toLocaleString()}</span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                          {record.mileageAtService?.toLocaleString()} KM
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <button 
                              onClick={() => handleDownloadVehicleReport(record.vehicle?._id)} 
                              disabled={downloadingId === record.vehicle?._id}
                              title="Download Vehicle Report (PDF)"
                              style={{ 
                                color: '#2979FF', 
                                backgroundColor: 'rgba(41, 121, 255, 0.1)', 
                                border: '1px solid rgba(41, 121, 255, 0.3)',
                                borderRadius: '6px',
                                padding: '0.4rem 0.7rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                opacity: downloadingId === record.vehicle?._id ? 0.5 : 1
                              }}
                            >
                              <FaFilePdf />
                            </button>
                            <button onClick={() => handleOpenModal(record)} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', backgroundColor: 'transparent' }} title="Edit"><FaEdit /></button>
                            <button onClick={() => handleDeleteRecord(record._id)} style={{ color: '#FF5252', backgroundColor: 'transparent' }} title="Delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {records.map(record => (
                  <motion.div 
                    key={record._id} 
                    className="glass" 
                    style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.8rem' }}>{new Date(record.serviceDate).toLocaleDateString()}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{record.mileageAtService?.toLocaleString()} KM</span>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: '0.3rem', fontWeight: '800' }}>{record.vehicle?.make} {record.vehicle?.model}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>{record.serviceType?.toUpperCase()}</p>
                    <p style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--primary)' }}>LKR {record.cost?.totalCost?.toLocaleString()}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleDownloadVehicleReport(record.vehicle?._id)}
                        disabled={downloadingId === record.vehicle?._id}
                        style={{ 
                          flex: 1, padding: '0.6rem', 
                          backgroundColor: 'rgba(41, 121, 255, 0.1)', 
                          border: '1px solid rgba(41, 121, 255, 0.3)',
                          borderRadius: '6px', color: '#2979FF', 
                          fontWeight: '800', fontSize: '0.75rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          opacity: downloadingId === record.vehicle?._id ? 0.5 : 1
                        }}
                      >
                        <FaFilePdf /> {downloadingId === record.vehicle?._id ? '---' : 'PDF'}
                      </button>
                      <button onClick={() => handleOpenModal(record)} style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)' }}><FaEdit /></button>
                      <button onClick={() => handleDeleteRecord(record._id)} style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '6px', color: '#FF5252' }}><FaTrash /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <ServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        record={selectedRecord}
        onSuccess={fetchRecords}
      />
    </div>
  );
};

export default ServiceHistory;
