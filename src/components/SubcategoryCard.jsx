import React from 'react';
import { Package, Folder, ArrowRight } from 'lucide-react';

export default function SubcategoryCard({ subcategory, productCount, products = [], onClick }) {
    // Helper to find majority attribute
    const getMajority = (items, key) => {
        if (!items || items.length === 0) return null;
        const counts = {};
        let maxCount = 0;
        let majorItem = null;

        for (const item of items) {
            const val = item[key];
            if (!val) continue;
            counts[val] = (counts[val] || 0) + 1;
            if (counts[val] > maxCount) {
                maxCount = counts[val];
                majorItem = val;
            }
        }
        return majorItem;
    };

    // 1. Dynamic Color (Strictly Auto-Detected from Products)
    // User requested to ignore manual admin color and always follow products
    const majorityColor = getMajority(products, 'color');
    const cardColor = majorityColor || 'var(--accent-cyan)';

    // 2. Dynamic Banner (Manual > Majority)
    const majorityBanner = getMajority(products, 'banner_url');
    const displayBanner = subcategory.banner_url || majorityBanner;

    // 3. Dynamic Icon Logic
    const majorityIconType = getMajority(products, 'iconType');

    // 4. Dynamic Description (Majority)
    const majorityDescription = getMajority(products, 'description');

    // Helper to get icon from type (Replicated from Catalog.jsx)
    const getIcon = (type) => {
        const imgStyle = { width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' };
        switch ((type || '').toLowerCase()) {
            case 'netflix': return <img src="/logos/netflix.png" alt="Netflix" style={imgStyle} />;
            case 'canva': return <img src="/logos/canva.png" alt="Canva" style={imgStyle} />;
            case 'capcut': return <img src="/logos/capcut.png" alt="CapCut" style={imgStyle} />;
            case 'spotify': return <span style={{ fontSize: 32 }}>🎧</span>;
            case 'youtube': return <span style={{ fontSize: 32 }}>▶️</span>;
            default: return null;
        }
    };

    const majorIcon = getIcon(majorityIconType);

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
                borderRadius: '16px'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Banner Area */}
            <div style={{
                height: '100px',
                width: '100%',
                background: displayBanner
                    ? `url(${displayBanner}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${cardColor}44, transparent)`,
                position: 'relative',
                borderBottom: `1px solid ${cardColor}22`
            }}>
                {/* Overlay for readability if banner exists */}
                {displayBanner && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />}

                {/* ICON: Left Aligned, Overlapping (MATCHING PRODUCT CARD) */}
                <div className="product-icon" style={{
                    width: '70px', height: '70px',
                    position: 'absolute',
                    bottom: '-45px',
                    left: '20px',
                    background: '#050508',
                    border: `2px solid ${cardColor}`,
                    borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                    padding: '10px'
                }}>
                    {subcategory.icon_url ? (
                        <img src={subcategory.icon_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                        majorIcon ? (
                            majorIcon
                        ) : (
                            products.length > 0 && products[0].image_url ? (
                                <img src={products[0].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                            ) : (
                                <div style={{ color: cardColor }}>
                                    <Folder size={32} />
                                </div>
                            )
                        )
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

            {/* Content Body (MATCHING PRODUCT CARD PADDING/MARGIN) */}
            <div style={{ padding: '20px', marginTop: '45px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem', textAlign: 'left' }}>{subcategory.name}</h3>

                {/* Description (Added) */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '40px', lineHeight: '1.4', textAlign: 'left' }}>
                    {majorityDescription && majorityDescription.length > 60
                        ? majorityDescription.substring(0, 60) + '...'
                        : (majorityDescription || 'Lihat pilihan produk terbaik kami di kategori ini.')}
                </p>

                {/* Preview Section - Product List */}
                {previewItems.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        marginBottom: 'auto',
                        width: '100%'
                    }}>
                        {previewItems.map((p, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                fontSize: '0.75rem',
                                padding: '0.5rem 0.8rem',
                                background: 'rgba(0,0,0,0.4)',
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
                    </div>
                ) : (
                    <div style={{ marginBottom: 'auto', opacity: 0.5, fontSize: '0.8rem' }}>
                        Belum ada produk
                    </div>
                )}

                {/* Button Styled Like Product Card */}
                <button
                    className="btn btn-secondary"
                    style={{
                        width: '100%', justifyContent: 'center', marginTop: '1.5rem',
                        borderColor: cardColor, color: 'white',
                        background: `linear-gradient(90deg, ${cardColor}11, transparent)`,
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <span>Lihat Pilihan</span> <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
