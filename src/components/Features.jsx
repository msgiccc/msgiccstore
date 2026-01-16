import React from 'react';
import { Zap, Shield, Clock, Heart } from 'lucide-react';

export default function Features() {
    const features = [
        { icon: <Zap size={32} color="#facc15" />, title: 'Proses Cepat', desc: 'Aktivasi akun hanya dalam hitungan menit' },
        { icon: <Shield size={32} color="#22d3ee" />, title: 'Garansi Resmi', desc: 'Produk legal dan bergaransi penuh' },
        { icon: <Clock size={32} color="#a855f7" />, title: 'Support 24/7', desc: 'Bantuan admin siap sedia kapanpun' },
        { icon: <Heart size={32} color="#ec4899" />, title: 'Terpercaya', desc: 'Ribuan testimoni pelanggan puas' },
    ];

    return (
        <section className="section" id="features">
            <div className="container">
                <div className="section-header">
                    <span className="gradient-text">Kenapa Kami?</span>
                    <h2 className="section-title">Keunggulan Layanan</h2>
                    <p className="section-desc">Memberikan pelayanan terbaik untuk kepuasan Anda dalam berlangganan produk digital.</p>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-item glass-panel">
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
