const config = {
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '6285123456789', // Default fallback
    instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || '#',
    telegramUrl: import.meta.env.VITE_TELEGRAM_URL || '#',
    storeName: import.meta.env.VITE_STORE_NAME || 'MsgiccStore'
};

export default config;
