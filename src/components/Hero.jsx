import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="container hero-container">
                <div className="hero-text">


                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Solusi <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #CBD5E1, #FCD34D, #7DD3FC)' }}>Digital Premium</span><br />
                        Untuk Kebutuhan Anda
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Dapatkan akses ke layanan premium Netflix, CapCut Pro, Canva Pro dan berbagai produk digital lainnya dengan harga terjangkau.
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <a href="#products" className="btn btn-primary">Lihat Produk</a>
                        <a href="#contact" className="btn btn-secondary">Hubungi Kami</a>
                    </motion.div>
                </div>

                <div className="hero-visual">
                    <div className="floating-cards">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="float-card card-netflix"
                        >
                            <div style={{ width: 40, height: 40 }}><img src="/logos/netflix.png" alt="Netflix" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <span>Netflix</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
                            className="float-card card-canva"
                        >
                            <div style={{ width: 40, height: 40 }}><img src="/logos/canva.png" alt="Canva" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <span>Canva</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -25, 0] }}
                            transition={{ repeat: Infinity, duration: 6, delay: 0.5, ease: "easeInOut" }}
                            className="float-card card-capcut"
                        >
                            <div style={{ width: 40, height: 40 }}><img src="/logos/capcut.png" alt="CapCut" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                            <span>CapCut</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
