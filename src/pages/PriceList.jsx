import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { ShoppingCart, Search } from 'lucide-react';
import ProductDetailModal from '../components/ProductDetailModal';

export default function PriceList() {
    const { products, loading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

    // Filter logic
    const filteredCategories = Object.keys(groupedProducts).reduce((acc, category) => {
        const filtered = groupedProducts[category].filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) acc[category] = filtered;
        return acc;
    }, {});

    const handleBuy = (product) => {
        // Calculate display price logic same as ProductCard
        const now = new Date();
        const isDiscountActive = product.discount_percent > 0 &&
            (!product.discount_deadline || new Date(product.discount_deadline) > now);

        let finalPrice = product.price_numeric;
        if (product.price_numeric > 0 && isDiscountActive) {
            finalPrice = product.price_numeric * (100 - product.discount_percent) / 100;
        }

        const productWithPrice = { ...product, isDiscountActive, finalPrice };
        setSelectedProduct(productWithPrice);
        setIsModalOpen(true);
    };

    if (loading) return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
            <h1 className="section-title gradient-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>Tabel Harga Lengkap</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                Daftar harga resmi semua layanan premium yang tersedia.
            </p>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Tables by Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {Object.keys(filteredCategories).length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.5 }}>Produk tidak ditemukan.</div>
                ) : (
                    Object.keys(filteredCategories).map(category => (
                        <div key={category} className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                {category}
                            </h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Produk</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Harga Normal</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Harga Promo</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories[category].map(product => {
                                        const now = new Date();
                                        const isDiscountActive = product.discount_percent > 0 &&
                                            (!product.discount_deadline || new Date(product.discount_deadline) > now);

                                        const discountedPrice = product.price_numeric * (100 - product.discount_percent) / 100;

                                        return (
                                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        {product.image_url && <img src={product.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />}
                                                        {product.title}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', opacity: 0.7, textDecoration: isDiscountActive ? 'line-through' : 'none' }}>
                                                    Rp {product.price_numeric?.toLocaleString('id-ID')}
                                                </td>
                                                <td style={{ padding: '1rem', color: isDiscountActive ? 'var(--accent-pink)' : 'white', fontWeight: isDiscountActive ? 'bold' : 'normal' }}>
                                                    {isDiscountActive ? `Rp ${discountedPrice.toLocaleString('id-ID')}` : '-'}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleBuy(product)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                    >
                                                        <ShoppingCart size={16} /> Beli
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>

            {selectedProduct && (
                <ProductDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}
