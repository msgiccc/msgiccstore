import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductCard from './ProductCard';

export default function SubcategoryProductsModal({ isOpen, onClose, subcategory, products }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !subcategory) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1rem',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{
                width: '100%',
                maxWidth: '1200px',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: '0',
                overflow: 'hidden',
                background: '#0a0a0f',
                border: '1px solid var(--glass-border)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', letterSpacing: '1px' }}>EXPLORE CATEGORY</span>
                        <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{subcategory.name}</h2>
                    </div>
                    <button onClick={onClose} className="btn-icon" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable Grid */}
                <div style={{
                    padding: '2rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    <div className="products-grid">
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    icon={product.image_url
                                        ? <img src={product.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                        : null
                                    }
                                />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                                <p>Belum ada produk di subkategori ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
