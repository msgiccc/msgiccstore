import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider, useProducts } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { Play, Clock, ArrowRight } from 'lucide-react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Features from './components/Features';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import Catalog from './pages/Catalog';
import PriceList from './pages/PriceList'; // Import PriceList
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function Home() {
  const { products } = useProducts();

  // Logic for Flash Sale
  const flashSaleProducts = products.filter(p => {
    const now = new Date();
    return p.discount_percent > 0 && (!p.discount_deadline || new Date(p.discount_deadline) > now);
  });

  // Logic for Featured (excluding Flash Sale to avoid duplicates if desired, or just top regular)
  // Sort by sold_count descending
  const featuredProducts = [...products]
    .sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
    .slice(0, 8);

  // Helper for icons
  const getIcon = (type) => {
    const imgStyle = { width: '100%', height: '100%', objectFit: 'contain' };
    switch ((type || '').toLowerCase()) {
      case 'netflix': return <img src="/logos/netflix.png" alt="Netflix" style={imgStyle} />;
      case 'canva': return <img src="/logos/canva.png" alt="Canva" style={imgStyle} />;
      case 'capcut': return <img src="/logos/capcut.png" alt="CapCut" style={imgStyle} />;
      default: return <Play fill="white" size={32} />;
    }
  };

  return (
    <>
      <Hero />

      {/* === FLASH SALE SECTION === */}
      {flashSaleProducts.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--accent-pink)', padding: '0.5rem', borderRadius: '12px' }}>
                <Clock color='white' size={24} />
              </div>
              <div>
                <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Flash <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #f472b6, #ec4899)' }}>Sale</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>Diskon terbatas, segera amankan!</p>
              </div>
            </div>

            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {flashSaleProducts.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  icon={product.image_url
                    ? <img src={product.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    : getIcon(product.iconType)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === FEATURED PRODUCTS === */}
      <section className="section" id="products">
        <div className="container">
          <div className="section-header">
            <span className="gradient-text">Produk Pilihan</span>
            <h2 className="section-title">Produk Paling Laris</h2>
            <p className="section-desc">Pilihan terbaik untuk kebutuhan subscription premium Anda.</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                icon={product.image_url
                  ? <img src={product.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  : getIcon(product.iconType)
                }
              />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="/catalog" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Lihat Semua Produk <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <Features />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <Layout>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/pricelist" element={<PriceList />} /> {/* Add Route */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </Layout>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}
