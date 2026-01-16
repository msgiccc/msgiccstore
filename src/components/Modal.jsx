import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, children, title }) {
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
                    padding: '1rem'
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(5, 5, 8, 0.8)',
                        backdropFilter: 'blur(8px)'
                    }}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="glass-panel"
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(20, 20, 30, 0.95)', // Slightly darker for popups
                        zIndex: 10000,
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="gradient-text">{title}</h3>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
