import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function SuccessPopup({ isOpen, message, onClose }) {
    // Auto close after 3 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    pointerEvents: 'none' // Click through background
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="glass-panel"
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        border: '2px solid var(--accent-cyan)',
                        background: 'rgba(5, 5, 8, 0.9)',
                        pointerEvents: 'auto', // Enable clicks on modal
                        boxShadow: '0 0 50px rgba(34, 211, 238, 0.2)'
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        <Check size={40} color="white" strokeWidth={3} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Berhasil!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
