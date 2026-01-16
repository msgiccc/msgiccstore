import React from 'react';
import { Package, Folder } from 'lucide-react';

export default function SubcategoryCard({ subcategory, productCount, products = [], onClick }) {
    const cardColor = 'var(--accent-cyan)';

    // Get up to 4 preview items
    const previewItems = products.slice(0, 4);

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
                background: subcategory.banner_url
                    ? `url(${subcategory.banner_url}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${cardColor}44, transparent)`,
                position: 'relative',
                borderBottom: `1px solid ${cardColor}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Overlay for readability if banner exists */}
                {subcategory.banner_url && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />}

                {!subcategory.banner_url && <Folder size={48} color="rgba(255,255,255,0.2)" />}

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
            <div style={{ padding: '40px 20px 20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{subcategory.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    {productCount} Produk Tersedia
                </p>

                {/* Preview Section */}
                {previewItems.length > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '1.5rem',
                        marginTop: 'auto'
                    }}>
                        {previewItems.map((p, i) => (
                            <div key={i} style={{
                                width: '32px', height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {p.image_url ? (
                                    <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '0.6rem', color: p.color || 'white' }}>Prod</span>
                                )}
                            </div>
                        ))}
                        {products.length > 4 && (
                            <div style={{
                                width: '32px', height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', color: 'var(--text-secondary)'
                            }}>
                                +{products.length - 4}
                            </div>
                        )}
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    style={{
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
