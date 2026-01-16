import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth(); // Get auth state

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="MSGICC STORE" style={{ height: '50px', objectFit: 'contain' }} />
                </Link>

                <style>{`
          .active-link { color: var(--accent-cyan) !important; text-shadow: 0 0 10px rgba(34, 211, 238, 0.4); }
        `}</style>

                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/" className={isActive('/')} onClick={() => setIsOpen(false)}>Beranda</Link>
                    <Link to="/catalog" className={isActive('/catalog')} onClick={() => setIsOpen(false)}>Produk Lengkap</Link>
                    <Link to="/pricelist" className={isActive('/pricelist')} onClick={() => setIsOpen(false)}>Tabel Harga</Link>
                    <a href="/#features" onClick={() => setIsOpen(false)}>Keunggulan</a>

                    {/* Enhanced Profile Link */}
                    <Link
                        to={user ? "/profile" : "/login"}
                        className={`btn-secondary ${isActive('/profile')}`}
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}
                        onClick={() => setIsOpen(false)}
                    >
                        <User size={16} /> {user ? 'Akun' : 'Login'}
                    </Link>
                </div>

                <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X color="white" /> : <Menu color="white" />}
                </button>
            </div>
        </nav>
    );
}
