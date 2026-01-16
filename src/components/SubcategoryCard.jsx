import React from 'react';
import { Package, Folder } from 'lucide-react';

export default function SubcategoryCard({ subcategory, productCount, onClick }) {
    const cardColor = 'var(--accent-cyan)';

    return (
        <div
            onClick={onClick}
            className="product-card"
            style={{
                padding: 0,
                border: `1px solid ${cardColor}33`,
                background: 'var(--glass-bg)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Banner Area */}
            <div style={{
                height: '100px',
                width: '100%',
                background: `linear-gradient(135deg, ${cardColor}44, transparent)`,
                position: 'relative',
                borderBottom: `1px solid ${cardColor}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Folder size={48} color="rgba(255,255,255,0.2)" />

                {/* ICON Floating */}
                <div className="product-icon" style={{
                    width: '60px', height: '60px',
                    position: 'absolute',
                    bottom: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#050508',
                    border: `2px solid ${cardColor}`,
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                }}>
                    {subcategory.icon_url ? (
                        <img src={subcategory.icon_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                    ) : (
                        <Package size={32} color={cardColor} />
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '40px 20px 20px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{subcategory.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {productCount} Produk Tersedia
                </p>

                <button
                    className="btn btn-primary"
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        justifyContent: 'center',
                        background: `linear-gradient(90deg, ${cardColor}22, ${cardColor}44)`,
                        border: `1px solid ${cardColor}44`
                    }}
                >
                    Lihat Pilihan
                </button>
            </div>
        </div>
    );
}
