import React from 'react';
import { Package, Folder } from 'lucide-react';

export default function SubcategoryCard({ subcategory, productCount, products = [], onClick }) {
    // Use custom color or default to cyan
    const cardColor = subcategory.color || 'var(--accent-cyan)';

    // Get up to 4 preview items
    const previewItems = products.slice(0, 4);

    return (
        <div
            onClick={onClick}
            className="product-card"
            style={{
                padding: 0,
                border: `2px solid ${cardColor}`, // Customizable Outline Color
                background: 'var(--glass-bg)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                borderRadius: '16px'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Banner Area */}
            <div style={{
                height: '80px',
                width: '100%',
                background: subcategory.banner_url
                    ? `url(${subcategory.banner_url}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${cardColor}44, transparent)`,
                position: 'relative',
                borderBottom: `1px solid ${cardColor}22`
            }}>
                {/* Overlay for readability if banner exists */}
                {subcategory.banner_url && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />}

                {/* ICON: Left Aligned, Overlapping */}
                <div className="product-icon" style={{
                    width: '50px', height: '50px',
                    position: 'absolute',
                    bottom: '-25px', // Half overlap
                    left: '20px', // Left aligned
                    background: '#0a0a0f',
                    border: `2px solid ${cardColor}`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                }}>
                    {subcategory.icon_url ? (
                        <img src={subcategory.icon_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    ) : (
                        <div style={{ color: cardColor }}>
                            <Folder size={24} />
                        </div>
                    )}
                </div>

                {/* Badge Count Top Right */}
                <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {productCount} Produk
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '35px 15px 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', textAlign: 'left', marginLeft: '5px' }}>{subcategory.name}</h3>

                {/* Product List Title */}
                {/* <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'left', marginLeft: '5px' }}>
                    Pilihan Tersedia:
                </p> */}

                {/* Preview Section - Product List */}
                {previewItems.length > 0 ? (
                    {/* Preview Section - Product List */ }
                {previewItems.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        marginBottom: '1rem',
                        marginTop: '1.2rem',
                        width: '100%'
                    }}>
                        {previewItems.map((p, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                fontSize: '0.75rem',
                                padding: '0.5rem 0.8rem',
                                background: 'rgba(0,0,0,0.4)', // Darker background for contrast
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.8)'
                            }}>
                                <span style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '65%'
                                }}>
                                    {p.title}
                                </span>
                                <span style={{ color: cardColor, fontWeight: '600' }}>
                                    {p.price_numeric > 0
                                        ? `Rp ${p.price_numeric.toLocaleString('id-ID')}`
                                        : 'Gratis'}
                                </span>
                            </div>
                        ))}
                        {products.length > 4 && (
                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.7rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.2rem',
                                fontStyle: 'italic'
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

                {/* Button as simple text link for cleaner look */}
                <button
                    style={{
                        marginTop: 'auto',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        fontWeight: '500',
                        opacity: 0.8,
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '1'}
                    onMouseLeave={e => e.target.style.opacity = '0.8'}
                >
                    Lihat Pilihan
                </button>
            </div>
        </div>
    );
}
