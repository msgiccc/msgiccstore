import config from '../config';

export default function Footer() {
    return (
        <footer id="contact" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div className="container">
                <div className="footer-content" style={{ textAlign: 'center' }}>
                    <div className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        <img src="/footer.png" alt={config.storeName} style={{ height: '120px', objectFit: 'contain' }} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        Solusi kebutuhan digital Anda dengan harga terbaik dan pelayanan tercepat.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '1.1rem' }}>Instagram</a>
                        <a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '1.1rem' }}>WhatsApp</a>
                        <a href={config.telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '1.1rem' }}>Telegram</a>
                    </div>
                    <div style={{ marginTop: '3rem', fontSize: '1rem', opacity: 0.6, borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                        &copy; 2026 MsgiccStore. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
