import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart, MoreVertical, Clock, Percent } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';

export default function ProductCard({
    id, title, price, price_numeric,
    discount_percent = 0, discount_deadline,
    features = [], icon, color, description,
    image_url, banner_url, screenshot_url, rules = [],
    sold_count = 0 // Default to 0 if undefined
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    // Check Discount Validity
    const now = new Date();
    const isDiscountActive = discount_percent > 0 &&
        (!discount_deadline || new Date(discount_deadline) > now);

    // Calculate Countdown (Same as before)
    useEffect(() => {
        if (!isDiscountActive || !discount_deadline) {
            setTimeLeft('');
            return;
        }

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(discount_deadline);
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('Ended');
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                let timeString = '';
                if (days > 0) timeString += `${days}h `;
                timeString += `${hours}j ${minutes}m ${seconds}d`;
                setTimeLeft(timeString);
            }
        }, 1000); // Update every second

        // Initial set
        const end = new Date(discount_deadline);
        const diff = end - new Date();
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            let timeString = '';
            if (days > 0) timeString += `${days}h `;
            timeString += `${hours}j ${minutes}m ${seconds}d`;
            setTimeLeft(timeString);
        }

        return () => clearInterval(interval);
    }, [discount_deadline, isDiscountActive]);


    // Calculate Display Price
    let displayPrice = price;
    let finalPrice = price_numeric;

    if (price_numeric > 0 && isDiscountActive) {
        const discountedValue = price_numeric * (100 - discount_percent) / 100;
        finalPrice = discountedValue;
        displayPrice = `Rp ${discountedValue.toLocaleString('id-ID')}`;
    }

    const fullProduct = {
        id, title, price, price_numeric,
        discount_percent, discount_deadline,
        features, icon, color, description,
        image_url, banner_url, screenshot_url, rules,
        isDiscountActive, finalPrice
    };

    // Styling constants
    const cardColor = color || 'var(--accent-cyan)';

    return (
        <>
            <div className="product-card" style={{
                padding: 0,
                border: `1px solid ${cardColor}33`,
                background: 'var(--glass-bg)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* BANNER HEADER */}
                <div style={{
                    height: '100px',
                    width: '100%',
                    background: banner_url ? `url(${banner_url}) center/cover no-repeat` : `linear-gradient(135deg, ${cardColor}44, transparent)`,
                    position: 'relative',
                    borderBottom: `1px solid ${cardColor}22`
                }}>
                    {/* Flash Sale Badge (Moved to Top Right of Banner) */}
                    {isDiscountActive && (
                        <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: 'rgba(252, 211, 77, 0.75)', color: '#000', // More transparent (0.75)
                            padding: '0.2rem 0.5rem', borderRadius: '8px', // Smaller padding & radius
                            fontSize: '0.6rem', fontWeight: 'bold', // Smaller font
                            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0px',
                            zIndex: 10,
                            boxShadow: '0 4px 15px rgba(252, 211, 77, 0.1)',
                            backdropFilter: 'blur(3px)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Clock size={9} /> {timeLeft ? `${timeLeft}` : `Limited`}
                            </div>
                            <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                                Hemat Rp {(price_numeric * discount_percent / 100).toLocaleString('id-ID')}
                            </div>
                        </div>
                    )}

                    {/* Sales Counter (New) */}
                    <div style={{
                        position: 'absolute', bottom: '10px', right: '10px',
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '0.7rem',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 4 // Behind overlapping icon if they clash, but icon is left, this is right
                    }}>
                        {sold_count || 0} Terjual
                    </div>

                    {/* Edit/More Button (Top Left of Banner for accessibility/visibility) */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            position: 'absolute', top: '5px', left: '5px',
                            background: 'rgba(0,0,0,0.4)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                        <MoreVertical size={16} />
                    </button>

                    {/* OVERLAPPING ICON */}
                    <div className="product-icon" style={{
                        width: '70px', height: '70px',
                        position: 'absolute',
                        bottom: '-45px',
                        left: '20px',
                        background: '#050508', // Match card bg to create 'cutout' effect
                        border: `2px solid ${cardColor}`, // Solid border for pop
                        borderRadius: '20px', // slightly softer square
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 5,
                        boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                        padding: '10px' // Padding for inner content
                    }}>
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            // If it's an image, round it
                            borderRadius: '12px', overflow: 'hidden'
                        }}>
                            {icon}
                        </div>
                    </div>
                </div>

                {/* CONTENT BODY */}
                <div style={{ padding: '20px', marginTop: '45px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '40px', lineHeight: '1.4' }}>
                        {description?.length > 60 ? description.substring(0, 60) + '...' : description}
                    </p>

                    {/* Price Display */}
                    <div className="product-price" style={{ marginBottom: '1rem' }}>
                        {isDiscountActive && price_numeric > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
                                <span style={{ color: cardColor, fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {displayPrice}
                                </span>
                                <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', opacity: 0.5, fontWeight: '400' }}>
                                    Rp {price_numeric.toLocaleString('id-ID')}
                                </span>
                            </div>
                        ) : (
                            <span style={{ color: cardColor, fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {displayPrice}
                            </span>
                        )}
                    </div>

                    {/* Features (limit to 2 lines to save space) */}
                    <ul className="feature-list" style={{ marginBottom: 'auto' }}>
                        {features?.slice(0, 2).map((feat, i) => (
                            <li key={i}><Check size={16} color={cardColor} /> {feat}</li>
                        ))}
                    </ul>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-secondary"
                        style={{
                            width: '100%', justifyContent: 'center', marginTop: '1.5rem',
                            borderColor: cardColor, color: 'white',
                            background: `linear-gradient(90deg, ${cardColor}11, transparent)`
                        }}
                    >
                        <ShoppingCart size={18} /> Detail
                    </button>
                </div>
            </div>

            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={fullProduct}
            />
        </>
    );
}
