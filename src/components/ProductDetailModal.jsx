import React, { useState } from 'react';
import Modal from './Modal';
import { useProducts } from '../context/ProductContext';
import { Check, ShoppingCart, AlertCircle, Smartphone, Tag, Loader } from 'lucide-react';
import config from '../config';

export default function ProductDetailModal({ isOpen, onClose, product }) {
    const { verifyVoucher } = useProducts();
    const [agreed, setAgreed] = useState(false);

    // Voucher State
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherApplied, setVoucherApplied] = useState(null); // { code, discount }
    const [checkingVoucher, setCheckingVoucher] = useState(false);
    const [voucherError, setVoucherError] = useState('');

    if (!product) return null;

    // Calculate Base Price (from Flash Sale or Normal)
    const basePrice = product.finalPrice || product.price_numeric || 0;

    // Calculate Final Price with Voucher
    let finalPriceValue = basePrice;
    if (voucherApplied && basePrice > 0) {
        finalPriceValue = basePrice * (100 - voucherApplied.discount) / 100;
    }

    const finalPriceText = basePrice > 0 ? `Rp ${finalPriceValue.toLocaleString('id-ID')}` : product.price;

    // WhatsApp Message Construction
    // E.g. "Halo.. saya beli X. Harga Awal: 50.000. Diskon: 10%. Total: 45.000 (Kode: ASIA)"
    let buyingDetails = `ingin membeli ${product.title}`;
    if (basePrice > 0) {
        if (voucherApplied) {
            buyingDetails += `\n- Harga Awal: Rp ${basePrice.toLocaleString('id-ID')}\n- Voucher: ${voucherApplied.code} (${voucherApplied.discount}%)\n- *Total Bayar: ${finalPriceText}*`;
        } else {
            buyingDetails += ` seharga ${finalPriceText}`;
        }
    } else {
        buyingDetails += ` seharga ${product.price}`;
    }

    const message = `Halo MsgiccStore, saya setuju dengan aturan pembelian dan ${buyingDetails}.`;
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Methods
    const handleCheckVoucher = async () => {
        if (!voucherCode.trim() || !product.id) return;
        setCheckingVoucher(true);
        setVoucherError('');

        const result = await verifyVoucher(voucherCode.trim().toUpperCase(), product.id);

        if (result.success) {
            setVoucherApplied({ code: voucherCode.trim().toUpperCase(), discount: result.discount });
            setVoucherError('');
        } else {
            setVoucherError(result.error);
            setVoucherApplied(null);
        }
        setCheckingVoucher(false);
    };

    const removeVoucher = () => {
        setVoucherApplied(null);
        setVoucherCode('');
        setVoucherError('');
    };

    // Convert rules
    const rules = product.rules && product.rules.length > 0 ? product.rules : [
        "Produk bergaransi sesuai deskripsi.",
        "Dilarang mengganti email/password akun.",
        "Proses 1-10 menit saat admin online.",
        "Pembelian bersifat legal & aman."
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Produk & Pembelian">

            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden',
                            boxShadow: `0 10px 30px ${product.color}44`, border: '1px solid var(--glass-border)'
                        }}>
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)' }}></div>
                            )}
                        </div>
                        {product.screenshot_url && (
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden',
                                border: '1px solid var(--accent-cyan)', position: 'relative'
                            }}>
                                <img src={product.screenshot_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{product.title}</h2>

                    {/* Dynamic Price Display */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* 1. Show Original if Flash Sale */}
                        {product.isDiscountActive && product.price_numeric > 0 && (
                            <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '1rem' }}>
                                Rp {product.price_numeric.toLocaleString('id-ID')}
                            </span>
                        )}

                        {/* 2. Show Base/Flash Price (Strikethrough if Voucher Applied) */}
                        {voucherApplied && basePrice > 0 ? (
                            <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                                Rp {basePrice.toLocaleString('id-ID')}
                            </span>
                        ) : null}

                        {/* 3. Final Price */}
                        <p style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '1.4rem' }}>
                            {finalPriceText}
                        </p>

                        {voucherApplied && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                                Hemat {voucherApplied.discount}% (Voucher: {voucherApplied.code})
                            </span>
                        )}
                    </div>
                </div>

                {/* Feature Tags */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                        {product.features?.map((tag, i) => (
                            <span key={i} style={{
                                background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)',
                                color: 'var(--accent-cyan)', padding: '0.3rem 0.8rem', borderRadius: '6px',
                                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500'
                            }}>
                                <Check size={12} strokeWidth={3} /> {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Full Description */}
                <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                    <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{product.description}</p>
                </div>

                {/* App Screenshot */}
                {product.screenshot_url && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Smartphone size={16} /> Tampilan Aplikasi
                        </h4>
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <img src={product.screenshot_url} alt="App Screenshot" style={{ width: '100%', display: 'block' }} />
                        </div>
                    </div>
                )}

                {/* === VOUCHER SECTION === */}
                {basePrice > 0 && (
                    <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                        <h4 style={{ marginBottom: '0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={16} /> Punya Kode Voucher?
                        </h4>

                        {!voucherApplied ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Masukkan Kode"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    style={{
                                        flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                        padding: '0.5rem', borderRadius: '8px', color: 'white', outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={handleCheckVoucher}
                                    disabled={checkingVoucher || !voucherCode}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                >
                                    {checkingVoucher ? <Loader size={14} className="spin" /> : 'Cek'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '0.8rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Check size={14} /> Voucher berhasil dipasang!
                                    </span>
                                    <button onClick={removeVoucher} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>Hapus</button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Rp {basePrice.toLocaleString('id-ID')}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>➜</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>Rp {finalPriceValue.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        )}

                        {voucherError && (
                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{voucherError}</p>
                        )}
                    </div>
                )}

                {/* Purchase Rules */}
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} /> Aturan Pembelian
                    </h4>
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {rules.map((rule, idx) => (
                            <li key={idx} style={{ lineHeight: '1.4' }}>{rule}</li>
                        ))}
                    </ul>
                </div>

                {/* Agreement Checkbox */}
                <div
                    onClick={() => setAgreed(!agreed)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        background: agreed ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.05)',
                        padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem',
                        cursor: 'pointer', transition: 'all 0.3s ease',
                        border: agreed ? '1px solid var(--accent-cyan)' : '1px solid transparent'
                    }}
                >
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: agreed ? 'none' : '2px solid var(--text-secondary)',
                        background: agreed ? 'var(--accent-cyan)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {agreed && <Check size={16} color="black" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '0.9rem', userSelect: 'none' }}>
                        Saya setuju dengan <b>Aturan Pembelian</b> di atas.
                    </span>
                </div>

                {/* Action Button */}
                {agreed ? (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                        <ShoppingCart size={20} /> Lanjut ke WhatsApp
                    </a>
                ) : (
                    <button disabled className="btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'var(--glass-border)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>
                        <AlertCircle size={20} /> Setujui Aturan Dulu
                    </button>
                )}

            </div>
        </Modal>
    );
}
