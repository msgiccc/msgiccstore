import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import SubcategoryCard from '../components/SubcategoryCard';
import SubcategoryProductsModal from '../components/SubcategoryProductsModal';
import { Play, Music, PenTool, Video, Gamepad, Folder } from 'lucide-react';

export default function Catalog() {
    const { products, subcategories } = useProducts();
    const [activeTab, setActiveTab] = useState('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    // Added 'Flash Sale' to categories
    const categories = ['All', 'Flash Sale', 'Streaming', 'Design', 'Editing', 'Music', 'Education', 'AI', 'Productivity', 'Gaming', 'Other'];

    const filteredProducts = (products || []).filter(p => {
        if (!p) return false;
        if (activeTab === 'All') return true;
        if (activeTab === 'Flash Sale') {
            // Check if product has active discount
            const now = new Date();
            const isDiscountActive = (p.discount_percent || 0) > 0 &&
                (!p.discount_deadline || new Date(p.discount_deadline) > now);
            return isDiscountActive;
        }
        return p.category === activeTab;
    });

    const getIcon = (type, color) => {
        // Basic icon mapping, can be expanded
        const imgStyle = { width: '100%', height: '100%', objectFit: 'contain' };
        switch ((type || '').toLowerCase()) {
            case 'netflix': return <img src="/logos/netflix.png" alt="Netflix" style={imgStyle} />;
            case 'canva': return <img src="/logos/canva.png" alt="Canva" style={imgStyle} />;
            case 'capcut': return <img src="/logos/capcut.png" alt="CapCut" style={imgStyle} />;
            case 'spotify': return <span style={{ fontSize: 32 }}>🎧</span>;
            default: return <span style={{ fontSize: 32 }}>📦</span>;
        }
    };

    // Subcategory Logic
    const currentSubcategories = (subcategories || []).filter(s => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Flash Sale') return false; // Show products directly
        return s.category === activeTab;
    });

    const orphanProducts = filteredProducts.filter(p => !p.subcategory_id);

    const handleSubClick = (sub) => {
        setSelectedSubcategory(sub);
        setIsSubModalOpen(true);
    };

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className="section-header">
                <span className="section-badge">Katalog Lengkap</span>
                <h1 className="section-title">Semua <span className="gradient-text">Produk</span></h1>
                <p className="section-desc">Telusuri semua produk digital terbaik kami berdasarkan kategori.</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '3rem'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`btn ${activeTab === cat ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ minWidth: '100px', justifyContent: 'center' }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {/* Grid */}
            <div className="products-grid">
                {/* 1. Show Subcategories first (unless Flash Sale) */}
                {activeTab !== 'Flash Sale' && currentSubcategories.map(sub => {
                    const count = products.filter(p => p.subcategory_id === sub.id).length;
                    return (
                        <SubcategoryCard
                            key={sub.id}
                            subcategory={sub}
                            productCount={count}
                            onClick={() => handleSubClick(sub)}
                        />
                    );
                })}

                {/* 2. Show Orphan Products OR All Products if Flash Sale */}
                {(activeTab === 'Flash Sale' ? filteredProducts : orphanProducts).map(product => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        icon={product.image_url
                            ? <img src={product.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                            : getIcon(product.iconType, product.color)
                        }
                    />
                ))}

                {/* Empty State */}
                {activeTab !== 'Flash Sale' && currentSubcategories.length === 0 && orphanProducts.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        <p>Belum ada produk di kategori ini.</p>
                    </div>
                )}
                {activeTab === 'Flash Sale' && filteredProducts.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        <p>Tidak ada promo Flash Sale saat ini.</p>
                    </div>
                )}
            </div>

            {/* Subcategory Modal */}
            <SubcategoryProductsModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                subcategory={selectedSubcategory}
                products={selectedSubcategory ? products.filter(p => p.subcategory_id === selectedSubcategory.id) : []}
            />
        </div>
    );
}
