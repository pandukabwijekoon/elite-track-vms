import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaDownload } from 'react-icons/fa';
import costBanner from '../assets/1117.jpg';
import { generateCostReport } from '../utils/reportUtil';

const CostCalculator = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/costs/summary');
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching cost summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    if (!data) return alert('No data available to export.');
    generateCostReport(data);
  };

  const COLORS = ['#E30000', '#00E676', '#2979FF', '#FFAB00', '#FF1744', '#AA00FF'];

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: 'clamp(0.5rem, 3vw, 2rem)', transition: 'var(--transition)' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1.5rem',
          marginBottom: '3rem',
          marginTop: window.innerWidth <= 1024 ? '4.5rem' : '0'
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '0.4rem' }}>COST <span style={{ color: 'var(--primary)' }}>CALCULATOR</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px' }}>ANALYZE YOUR TOTAL VEHICLE INVESTMENT WITH PRECISION</p>
          </div>
          <button 
            onClick={handleExport}
            className="glass animate-glow" 
            style={{ 
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
            }}>
            <FaDownload /> EXPORT REPORT
          </button>
        </header>

        {/* Feature Banner */}
        <div style={{ 
          height: '240px', 
          borderRadius: 'var(--radius-md)', 
          backgroundImage: `linear-gradient(to bottom, transparent, var(--bg-dark)), url(${costBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '3rem',
          border: '1px solid var(--border)'
        }}></div>

        {loading ? <p>Crunching numbers...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
              <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', borderBottom: '3px solid var(--primary)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.8rem', fontWeight: '800', fontSize: '0.75rem', letterSpacing: '2px' }}>GRAND TOTAL INVESTMENT</p>
                <h2 className="neon-amount" style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', margin: 0, fontWeight: '900' }}>LKR {data?.grandTotal?.toLocaleString()}</h2>
              </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 1024 ? '1fr' : '1fr 1fr', gap: '2rem' }}>
              <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', height: '450px' }}>
                <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '1px' }}>SPENDING BY CATEGORY</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Service', value: data?.totalServiceCost || 0 },
                        { name: 'Modifications', value: data?.totalModCost || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#E30000" />
                      <Cell fill="#FFFFFF" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', height: '450px' }}>
                <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '1px' }}>MONTHLY EXPENDITURE</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={data?.serviceByMonth || []}>
                    <XAxis dataKey="name" stroke="#A0A0A0" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#A0A0A0" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', letterSpacing: '1px' }}>MODIFICATION BREAKDOWN</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={data?.modByCategory || []}>
                  <XAxis type="number" stroke="#A0A0A0" hide />
                  <YAxis type="category" dataKey="name" stroke="#A0A0A0" width={100} fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#FFFFFF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CostCalculator;
