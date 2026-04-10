import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import VehicleModal from '../components/VehicleModal';
import BrandMarquee from '../components/BrandMarquee';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FaPlus, FaGasPump, FaRoad, FaCalendarAlt, FaTools, FaTrash, FaEdit, FaUserCircle, FaShieldAlt } from 'react-icons/fa';
import { generateVehicleReport } from '../utils/reportUtil';
import AIGuardian from '../components/AIGuardian';
import FuelTracker from '../components/FuelTracker';

const Dashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ totalService: 0, totalMods: 0, activeListings: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/costs/summary')
      ]);
      setVehicles(vRes.data.data);
      if (sRes.data.success) {
        setStats({
          totalService: sRes.data.data.totalServiceCost || 0,
          totalMods: sRes.data.data.totalModCost || 0,
          activeListings: 0
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDownloadReport = async (vehicleId) => {
    try {
      const res = await api.get(`/vehicles/${vehicleId}/profile`);
      if (res.data.success) {
        generateVehicleReport(res.data.data);
      }
    } catch (err) {
      alert('Failed to generate report: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle from your garage?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete vehicle');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Sidebar />
      
      <main style={{ 
        marginLeft: 'var(--sidebar-width)', 
        flex: 1, 
        padding: 'clamp(1rem, 5vw, 3rem)',
        transition: 'var(--transition)'
      }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '5rem',
          gap: '2rem'
        }}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{ flex: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <FaUserCircle style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '900', letterSpacing: '4px', color: 'var(--text-muted)' }}>COMMANDER {user?.name?.toUpperCase() || 'OFFLINE'}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', margin: 0, lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '1.2rem' }}>MY <span style={{ color: 'var(--primary)' }}>GARAGE</span></h1>
            
            <button 
              onClick={() => handleOpenModal()}
              className="animate-glow"
              style={{ 
                backgroundColor: '#E30000', 
                color: 'white', 
                padding: '0.5rem 1.5rem', 
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                fontWeight: '900',
                letterSpacing: '1px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                boxShadow: '0 6px 15px rgba(227, 0, 0, 0.2)',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                maxWidth: '220px'
              }}
            >
              <FaPlus style={{ fontSize: '0.9rem' }} /> DEPLOY NEW
            </button>
          </motion.div>
        </header>

        <div style={{ marginBottom: '4rem' }}>
          <BrandMarquee />
        </div>

        {/* Proactive Intelligence Row */}
        {vehicles.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '4rem' 
          }}>
            <AIGuardian vehicle={vehicles[0]} />
            <FuelTracker vehicle={vehicles[0]} onUpdate={fetchDashboardData} />
          </div>
        )}

        {/* Stats Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '4rem' 
        }}>
          <StatCard label="Service Expenditure" value={`LKR ${stats.totalService.toLocaleString()}`} icon={<FaTools />} color="var(--primary)" />
          <StatCard label="Mod Investment" value={`LKR ${stats.totalMods.toLocaleString()}`} icon={<FaGasPump />} color="#00E676" />
          <StatCard label="Total Spent" value={`LKR ${(stats.totalService + stats.totalMods).toLocaleString()}`} icon={<FaRoad />} color="#2979FF" />
        </div>

        {/* Vehicles Grid */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>ACTIVE <span style={{ color: 'var(--primary)' }}>VEHICLES</span></h2>
        
        {loading ? (
          <p>Loading your vehicles...</p>
        ) : vehicles.length === 0 ? (
          <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No vehicles registered in your garage yet.</p>
            <button 
              onClick={() => handleOpenModal()}
              style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'underline', backgroundColor: 'transparent', letterSpacing: '1px' }}
            >
              REGISTER FIRST VEHICLE
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', 
            gap: '1.5rem' 
          }}>
            {vehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle._id} 
                vehicle={vehicle} 
                onEdit={() => handleOpenModal(vehicle)}
                onDelete={() => handleDeleteVehicle(vehicle._id)}
                onDownload={() => handleDownloadReport(vehicle._id)}
              />
            ))}
          </div>
        )}
      </main>

      <VehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={selectedVehicle}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>{label.toUpperCase()}</p>
      <div style={{ color: color, fontSize: '1.2rem' }}>{icon}</div>
    </div>
    <h3 className={color === 'var(--primary)' ? 'neon-amount' : 'neon-amount-white'} style={{ fontSize: '1.4rem', margin: 0, fontWeight: '800', color: color }}>{value}</h3>
  </div>
);

const VehicleCard = ({ vehicle, onEdit, onDelete, onDownload }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass"
    style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)', maxWidth: '380px' }}
  >
    <div style={{ 
      height: '110px', 
      backgroundColor: '#222', 
      backgroundImage: `url(${vehicle.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000'})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}></div>
    <div style={{ padding: '0.8rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800' }}>
          {vehicle.registrationNumber}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FaRoad style={{ color: 'var(--primary)' }} /> {vehicle.mileage.toLocaleString()} KM
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FaGasPump style={{ color: 'var(--primary)' }} /> {vehicle.fuelType}
        </div>
      </div>

      {/* Maintenance Predictor Logic */}
      {(() => {
        const dailyMileage = (vehicle.averageMonthlyMileage || 1000) / 30;
        const serviceInterval = vehicle.serviceInterval || 12000;
        const mileageSinceService = vehicle.mileage - (vehicle.lastServiceMileage || 0);
        const remainingKm = Math.max(0, serviceInterval - mileageSinceService);
        const daysRemaining = Math.ceil(remainingKm / dailyMileage);
        const progress = Math.min(100, (mileageSinceService / serviceInterval) * 100);
        const isUrgent = daysRemaining <= 15;

        return (
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.02)', 
            padding: '0.7rem', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: '1.2rem',
            border: `1px solid ${isUrgent ? 'rgba(227, 0, 0, 0.2)' : 'var(--border)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>MAINTENANCE FORECAST</span>
              <span style={{ fontSize: '0.65rem', fontWeight: '900', color: isUrgent ? 'var(--primary)' : '#00E676' }}>
                {daysRemaining > 0 ? `${daysRemaining} DAYS REMAINING` : 'SERVICE OVERDUE'}
              </span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${progress}%`, 
                backgroundColor: isUrgent ? 'var(--primary)' : '#00E676',
                transition: 'width 1s ease-in-out'
              }} />
            </div>
          </div>
        );
      })()}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button 
          onClick={onDownload}
          className="animate-glow"
          style={{ 
            width: 'fit-content', 
            padding: '0.3rem 0.6rem', 
            backgroundColor: 'var(--primary)', 
            borderRadius: '4px',
            fontWeight: '900',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            fontSize: '0.55rem',
            letterSpacing: '0.5px'
          }}
        >
          <FaCalendarAlt /> DOWNLOAD
        </button>
        <button 
          onClick={onEdit}
          style={{ 
            width: '24px',
            height: '24px',
            borderRadius: '50%', 
            border: '1.5px solid var(--primary)', 
            backgroundColor: 'rgba(227, 0, 0, 0.05)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.55rem',
            transition: 'all 0.2s ease'
          }}
          title="Edit"
        >
          <FaEdit />
        </button>
        <button 
          onClick={onDelete}
          style={{ 
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.55rem',
            border: 'none',
            transition: 'all 0.2s ease'
          }}
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  </motion.div>
);


export default Dashboard;

