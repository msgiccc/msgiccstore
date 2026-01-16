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

                {/* Preview Section - Product List */}
                {previewItems.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        marginTop: 'auto',
                        width: '100%'
                    }}>
                        {previewItems.map((p, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                fontSize: '0.8rem',
                                padding: '0.4rem 0.6rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: 'var(--text-secondary)'
                            }}>
                                <span style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '65%'
                                }}>
                                    {p.title}
                                </span>
                                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                                    {p.price_numeric > 0
                                        ? `Rp ${p.price_numeric.toLocaleString('id-ID')}`
                                        : 'Gratis'}
                                </span>
                            </div>
                        ))}
                        {products.length > 4 && (
                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.2rem'
                            }}>
                                +{products.length - 4} opsi lainnya
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ marginBottom: '1.5rem', marginTop: 'auto', opacity: 0.5, fontSize: '0.8rem' }}>
                        Belum ada produk
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
