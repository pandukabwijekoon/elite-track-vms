import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaEnvelopeOpenText, FaCheckCircle, FaExclamationTriangle, FaLock } from 'react-icons/fa';
import api from '../api/axios';

const PaymentModal = ({ isOpen, onClose, amount, item, onSuccess }) => {
  const [step, setStep] = useState('initiate'); // initiate, verify, success
  const [otp, setOtp] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep('initiate');
      setOtp('');
      setPaymentId(null);
      setError(null);
      setCountdown(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInitiate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/payments/initiate', { amount, item });
      if (res.data.success) {
        setPaymentId(res.data.paymentId);
        setStep('verify');
        setCountdown(600); // 10 minutes
        // DEV MODE: auto-fill OTP when email is not configured
        if (res.data.dev_otp) {
          setOtp(res.data.dev_otp);
          setError(`DEV MODE: OTP auto-filled (${res.data.dev_otp}). Configure SMTP in server/.env for real emails.`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate verification');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Please enter a 6-digit code');

    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/payments/verify', { paymentId, otp });
      if (res.data.success) {
        setStep('success');
        if (onSuccess) onSuccess(res.data.transactionId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
      padding: '1.5rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          backgroundColor: '#111', border: '1px solid var(--border)',
          borderRadius: '1rem', width: '100%', maxWidth: '380px',
          padding: '1.25rem', position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Glow Effect */}
        <div style={{
          position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
          background: 'radial-gradient(circle, rgba(227, 0, 0, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-muted)', fontSize: '1.5rem', backgroundColor: 'transparent' }}
        >
          ×
        </button>

        {step === 'initiate' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(227, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.2rem' }}>
              <FaShieldAlt style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>SECURE PAYMENT</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              To complete your purchase of <strong style={{ color: 'white' }}>{item}</strong>, we need to verify your identity.
            </p>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.6rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: '700', letterSpacing: '1px' }}>TOTAL AMOUNT</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>LKR {amount?.toLocaleString()}</h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInitiate}
              disabled={loading}
              className="animate-glow"
              style={{
                width: '100%', padding: '0.8rem', backgroundColor: 'var(--primary)',
                color: 'white', borderRadius: '0.6rem', fontWeight: '900',
                fontSize: '0.85rem', letterSpacing: '1px', opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'GENERATING CODE...' : 'SEND VERIFICATION CODE'}
            </motion.button>
          </div>
        )}

        {step === 'verify' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(227, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                <FaEnvelopeOpenText style={{ fontSize: '1.8rem', color: 'var(--primary)' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>CHECK YOUR EMAIL</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We sent a 6-digit code to your registered address.</p>
            </div>

            {error && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: error.startsWith('DEV MODE') ? 'rgba(255, 171, 0, 0.1)' : 'rgba(255, 82, 82, 0.1)', 
                border: `1px solid ${error.startsWith('DEV MODE') ? '#FFAB00' : '#FF5252'}`, 
                borderRadius: '0.8rem', 
                color: error.startsWith('DEV MODE') ? '#FFAB00' : '#FF5252', 
                marginBottom: '1.5rem', 
                fontSize: '0.85rem', 
                textAlign: 'center' 
              }}>
                <FaExclamationTriangle style={{ marginRight: '0.5rem' }} /> {error}
              </div>
            )}

            <form onSubmit={handleVerify}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                  <input 
                    type="text"
                    maxLength="6"
                    placeholder="ENTER 6-DIGIT CODE"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{
                      width: '100%', padding: '1rem 1.2rem 1rem 3.5rem',
                      backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                      borderRadius: '0.8rem', color: 'white', fontSize: '1.1rem', fontWeight: '900',
                      letterSpacing: '8px', textAlign: 'center', outline: 'none'
                    }}
                  />
                </div>
                <p style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Code expires in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="animate-glow"
                style={{
                  width: '100%', padding: '1rem', backgroundColor: 'var(--primary)',
                  color: 'white', borderRadius: '0.8rem', fontWeight: '900',
                  fontSize: '0.95rem', letterSpacing: '1px', opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'VERIFYING...' : 'COMPLETE TRANSACTION'}
              </motion.button>
            </form>

            <button 
              onClick={handleInitiate}
              disabled={loading || countdown > 540}
              style={{ width: '100%', marginTop: '1.5rem', backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px', opacity: countdown > 540 ? 0.3 : 1 }}
            >
              RESEND CODE {countdown > 540 && `(${countdown - 540}s)`}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(0, 230, 118, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 2rem' }}>
              <FaCheckCircle style={{ fontSize: '3rem', color: '#00E676' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '1px' }}>TRANSACTION COMPLETE</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Identity verified. The secure payment for <strong style={{ color: 'white' }}>{item}</strong> has been processed successfully.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                width: '100%', padding: '1.2rem', backgroundColor: '#00E676',
                color: 'black', borderRadius: '1rem', fontWeight: '900',
                fontSize: '1.1rem', letterSpacing: '1px'
              }}
            >
              RETURN TO CENTER
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentModal;
