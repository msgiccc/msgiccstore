import React from 'react';
import { MessageCircle } from 'lucide-react';
import config from '../config';

export default function WhatsAppButton() {
    return (
        <a
            href={`https://wa.me/${config.whatsappNumber}?text=Halo%20${config.storeName}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#25D366',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 100,
                transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <MessageCircle size={32} />
        </a>
    );
}
