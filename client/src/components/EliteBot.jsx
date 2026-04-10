import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaCar, FaToolbox, FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';
import api from '../api/axios';

const EliteBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'MECHANIC ONLINE. I am the EliteBot Assistant. How can I assist your fleet today?', time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchFleetData();
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchFleetData = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error('Failed to wake up fleet intelligence.');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    addMessage('user', userText);
    setInput('');
    processLogic(userText);
  };

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, time: new Date().toLocaleTimeString() }]);
  };

  const processLogic = (text) => {
    setLoading(true);
    const query = text.toLowerCase();

    setTimeout(() => {
      if (query.includes('status') || query.includes('health') || query.includes('check')) {
        handleStatusCheck();
      } else if (query.includes('service') || query.includes('maintenance')) {
        handleServiceCheck();
      } else if (query.includes('expiry') || query.includes('document')) {
        handleExpiryCheck();
      } else if (query.includes('hello') || query.includes('hi')) {
        addMessage('bot', 'Greetings, Commander. All systems standby. Ready for diagnostics.');
      } else {
        addMessage('bot', "I'm primarily calibrated for vehicle diagnostics. Try asking for a 'Status Check' or 'Next Service'.");
      }
      setLoading(false);
    }, 800);
  };

  const handleStatusCheck = () => {
    if (vehicles.length === 0) {
      addMessage('bot', 'Your digital garage is currently empty. Register a vehicle to begin tracking.');
      return;
    }

    const report = vehicles.map(v => {
        const nextServiceKM = v.lastServiceMileage + v.serviceInterval;
        const kmLeft = nextServiceKM - v.mileage;
        const healthEmoji = kmLeft > 2000 ? '🟢' : kmLeft > 500 ? '🟡' : '🔴';
        return `${healthEmoji} ${v.make} ${v.model}: ${v.mileage} KM [Health: Optimal]`;
    }).join('\n');

    addMessage('bot', `FLEET DIAGNOSTIC REPORT:\n${report}`);
  };

  const handleServiceCheck = () => {
    if (vehicles.length === 0) return addMessage('bot', 'No vehicle data found.');
    
    const serviceInfo = vehicles.map(v => {
        const nextServiceKM = (v.lastServiceMileage || 0) + (v.serviceInterval || 12000);
        const kmRemaining = nextServiceKM - v.mileage;
        return `🛠️ ${v.make} ${v.model}: Service due in ${kmRemaining} KM.`;
    }).join('\n');
    
    addMessage('bot', `MAINTENANCE QUEUE:\n${serviceInfo}`);
  };

  const handleExpiryCheck = () => {
    let docsFound = [];
    vehicles.forEach(v => {
        v.documents?.forEach(d => {
            const daysLeft = Math.ceil((new Date(d.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            if (daysLeft < 30) {
                docsFound.push(`⚠️ ${v.model} - ${d.type}: Expiry in ${daysLeft} days.`);
            }
        });
    });

    if (docsFound.length === 0) {
        addMessage('bot', 'All vault records are currently valid and up to date.');
    } else {
        addMessage('bot', `VAULT ALERT:\n${docsFound.join('\n')}`);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {/* Bot Bubble */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px var(--primary-glow)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'black',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 8px 30px rgba(0, 240, 255, 0.4)',
        }}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="glass"
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              width: '400px',
              height: '550px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '1px solid var(--border-bright)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#00ff00', borderRadius: '50%', boxShadow: '0 0 10px #00ff00' }}></div>
                <h3 style={{ margin: 0, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>EliteBot AI</h3>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MERN V2.0.4</span>
            </div>

            {/* Messages */}
            <div style={{ 
                flex: 1, 
                padding: '1.5rem', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--primary) transparent'
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ 
                        padding: '12px 16px', 
                        borderRadius: m.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                        backgroundColor: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                        color: m.role === 'user' ? 'black' : 'white',
                        fontSize: '0.9rem',
                        whiteSpace: 'pre-wrap',
                        fontWeight: m.role === 'user' ? '700' : '400',
                    }}>
                        {m.text}
                    </div>
                </div>
              ))}
              {loading && <div style={{ fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.7 }}>Analyzing data streams...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '0 1rem', display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '0.5rem' }}>
                <button onClick={() => processLogic('Status Check')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Status Check</button>
                <button onClick={() => processLogic('Next Service')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Maintenance</button>
                <button onClick={() => processLogic('Document Expiry')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Vault Check</button>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query fleet intelligence..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  color: 'white',
                  padding: '8px',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FaPaperPlane />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EliteBot;
