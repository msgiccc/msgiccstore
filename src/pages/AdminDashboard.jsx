import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Trash2, Plus, Upload, LogOut, X, Smartphone, List, Tag, Clock, Percent, PenTool } from 'lucide-react';
import SuccessPopup from '../components/SuccessPopup';
import Modal from '../components/Modal';

export default function AdminDashboard() {
    const { products, addProduct, updateProduct, deleteProduct, updateVoucher, categories, addCategory, deleteCategory, subcategories, addSubcategory, deleteSubcategory } = useProducts();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'vouchers', 'categories'

    // === EDIT STATE ===
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isVoucherEditModalOpen, setIsVoucherEditModalOpen] = useState(false);

    const [newCategory, setNewCategory] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [newSubcategoryParent, setNewSubcategoryParent] = useState('');
    const [newSubcategoryBanner, setNewSubcategoryBanner] = useState(null);


    // === PRODUCT FORM STATE ===
    const [formData, setFormData] = useState({
        title: '',
        price_numeric: '',
        category: 'Streaming', // Default, will be updated to dynamic if needed
        description: '',
        color: '#ffffff',
        discount_percent: '',
        discount_deadline: '',
        sold_count: 0,
        subcategory_id: null
    });

    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [screenshotFile, setScreenshotFile] = useState(null);

    // === VOUCHER FORM STATE ===
    const [vouchers, setVouchers] = useState([]);
    const [voucherForm, setVoucherForm] = useState({
        code: '',
        discount_percent: '',
        valid_until: '',
        applicable_products: []
    });

    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // const categories = ['Streaming', 'Design', 'Editing', 'Music', 'Gaming', 'Other']; // REMOVED: Now dynamic from context

    // Fetch Vouchers
    useEffect(() => {
        if (activeTab === 'vouchers') {
            fetchVouchers();
        }
    }, [activeTab]);

    const fetchVouchers = async () => {
        const { data } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
        if (data) setVouchers(data);
    };

    // === DURATION HELPER ===
    const getDurationString = (dateString) => {
        if (!dateString) return 'Selamanya';
        const now = new Date();
        const end = new Date(dateString);
        const diff = end - now;
        if (diff <= 0) return 'Expired';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days} hari lagi`;
    };

    // === DATE HELPER ===
    const formatForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // format to YYYY-MM-DDTHH:mm in local time
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // === EDIT HANDLERS ===
    const startEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            price_numeric: product.price_numeric,
            category: product.category,
            description: product.description,
            color: product.color,
            discount_percent: product.discount_percent || '',
            sold_count: product.sold_count || 0,
            discount_deadline: formatForInput(product.discount_deadline),
            subcategory_id: product.subcategory_id || null
        });
        setTags(product.features || []);
        setRules(product.rules || []);
        setIsEditModalOpen(true);
    };

    const startEditVoucher = (voucher) => {
        setEditingVoucher(voucher);
        setVoucherForm({
            code: voucher.code,
            discount_percent: voucher.discount_percent,
            valid_until: formatForInput(voucher.valid_until),
            applicable_products: voucher.applicable_products || []
        });
        setIsVoucherEditModalOpen(true);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleScreenshotChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshotFile(e.target.files[0]);
        }
    };

    const handleBannerChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    // Handlers - Product Submit (New & Edit)
    const handleProductSubmit = async (e, isEdit = false) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = isEdit ? editingProduct.image_url : '';
            let bannerUrl = isEdit ? editingProduct.banner_url : '';
            let screenshotUrl = isEdit ? editingProduct.screenshot_url : '';

            // Upload Images if changed
            if (imageFile) {
                const fileName = `main-${Math.random()}.${imageFile.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }

            if (bannerFile) {
                const fileName = `banner-${Math.random()}.${bannerFile.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, bannerFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                bannerUrl = data.publicUrl;
            }

            if (screenshotFile) {
                const fileName = `ss-${Math.random()}.${screenshotFile.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, screenshotFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                screenshotUrl = data.publicUrl;
            }

            const numericPrice = parseInt(formData.price_numeric);
            const formattedPrice = `Rp ${numericPrice.toLocaleString('id-ID')}`;

            // Convert local input time to strict ISO UTC for DB
            const deadlineISO = formData.discount_deadline ? new Date(formData.discount_deadline).toISOString() : null;

            const productData = {
                ...formData,
                price: formattedPrice,
                price_numeric: numericPrice,
                discount_percent: formData.discount_percent ? parseInt(formData.discount_percent) : 0,
                sold_count: formData.sold_count ? parseInt(formData.sold_count) : 0,
                discount_deadline: deadlineISO,
                features: tags,
                rules: rules,
                image_url: imageUrl,
                banner_url: bannerUrl,
                screenshot_url: screenshotUrl
            };

            if (isEdit) {
                await updateProduct(editingProduct.id, productData);
                setIsEditModalOpen(false);
                setEditingProduct(null);
            } else {
                await addProduct(productData);
            }

            // Reset Form (only if adding, or if edit finished)
            if (!isEdit) {
                setFormData({
                    title: '', price_numeric: '', category: 'Streaming', description: '', color: '#ffffff',
                    discount_percent: '', discount_deadline: '', sold_count: 0, subcategory_id: null
                });
                setTags([]);
                setRules([]);
                setImageFile(null);
                setBannerFile(null);
                setScreenshotFile(null);
            }

            setShowSuccess(true);

        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Handlers - Voucher
    const handleVoucherSubmit = async (e, isEdit = false) => {
        e.preventDefault();
        try {
            // Convert local input time to strict ISO UTC for DB
            const validUntilISO = voucherForm.valid_until ? new Date(voucherForm.valid_until).toISOString() : null;

            const voucherData = {
                code: voucherForm.code.toUpperCase(),
                discount_percent: parseInt(voucherForm.discount_percent),
                valid_until: validUntilISO,
                applicable_products: voucherForm.applicable_products.length > 0 ? voucherForm.applicable_products : null
            };

            if (isEdit) {
                await updateVoucher(editingVoucher.id, voucherData);
                setIsVoucherEditModalOpen(false);
                setEditingVoucher(null);
            } else {
                const { error } = await supabase.from('vouchers').insert([voucherData]);
                if (error) throw error;
                // Reset Create Form
                setVoucherForm({ code: '', discount_percent: '', valid_until: '', applicable_products: [] });
            }

            fetchVouchers();
            setShowSuccess(true);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const deleteVoucher = async (id) => {
        if (window.confirm('Yakin hapus voucher ini?')) {
            await supabase.from('vouchers').delete().eq('id', id);
            fetchVouchers();
        }
    };

    // Shared Helper
    const addTag = (e) => {
        e.preventDefault();
        if (currentTag.trim()) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };
    const addRule = (e) => {
        e.preventDefault();
        if (currentRule.trim()) {
            setRules([...rules, currentRule.trim()]);
            setCurrentRule('');
        }
    };

    const toggleProductSelection = (id) => {
        const current = [...voucherForm.applicable_products];
        if (current.includes(id)) {
            setVoucherForm({ ...voucherForm, applicable_products: current.filter(pid => pid !== id) });
        } else {
            setVoucherForm({ ...voucherForm, applicable_products: [...current, id] });
        }
    };


    // === RENDER FORM HELPER ===
    const renderProductForm = (isEdit = false) => (
        <form onSubmit={(e) => handleProductSubmit(e, isEdit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Icon Utama {isEdit && '(Biarkan kosong jika tetap)'}</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={fileInputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Banner Atas {isEdit && '(Biarkan kosong)'}</label>
                    <input type="file" accept="image/*" onChange={handleBannerChange} style={fileInputStyle} />
                </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>App Screenshot {isEdit && '(Biarkan kosong)'}</label>
                <input type="file" accept="image/*" onChange={handleScreenshotChange} style={fileInputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Nama Produk</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Harga (Angka)</label>
                    <input type="number" value={formData.price_numeric} onChange={e => setFormData({ ...formData, price_numeric: e.target.value })} required style={inputStyle} />
                </div>
            </div>

            {/* Sales Counter Input */}
            <div>
                <label style={labelStyle}>Jumlah Terjual (Fake Counter)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, sold_count: Math.max(0, (parseInt(p.sold_count) || 0) - 1) }))} className="btn btn-secondary" style={{ width: '40px', justifyContent: 'center' }}>-</button>
                    <input
                        type="number"
                        value={formData.sold_count}
                        onChange={e => setFormData({ ...formData, sold_count: parseInt(e.target.value) || 0 })}
                        style={{ ...inputStyle, textAlign: 'center' }}
                    />
                    <button type="button" onClick={() => setFormData(p => ({ ...p, sold_count: (parseInt(p.sold_count) || 0) + 1 }))} className="btn btn-secondary" style={{ width: '40px', justifyContent: 'center' }}>+</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Kategori</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value, subcategory_id: null })} style={inputStyle}>
                        <option value="" disabled>Pilih Kategori</option>
                        {categories.map(c => <option key={c.id} value={c.name} style={{ color: 'black' }}>{c.name}</option>)}
                    </select>

                    <label style={{ ...labelStyle, marginTop: '1rem' }}>Subkategori (Opsional)</label>
                    <select
                        value={formData.subcategory_id || ''}
                        onChange={e => setFormData({ ...formData, subcategory_id: e.target.value ? parseInt(e.target.value) : null })}
                        style={inputStyle}
                        disabled={!formData.category}
                    >
                        <option value="">Tidak ada</option>
                        {subcategories
                            .filter(s => s.category === formData.category)
                            .map(s => <option key={s.id} value={s.id} style={{ color: 'black' }}>{s.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Warna</label>
                    <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ ...inputStyle, height: '46px', padding: '0.2rem' }} />
                </div>
            </div>
            <div style={{ background: 'rgba(34, 211, 238, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}><Percent size={16} /> Setting Diskon / Flash Sale</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Diskon (%)</label>
                        <input type="number" placeholder="0" value={formData.discount_percent} onChange={e => setFormData({ ...formData, discount_percent: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Berakhir Pada</label>
                        <input type="datetime-local" value={formData.discount_deadline} onChange={e => setFormData({ ...formData, discount_deadline: e.target.value })} style={inputStyle} />
                    </div>
                </div>
            </div>
            <div>
                <label style={labelStyle}>Fitur Utama (Tags)</label>
                <div style={inputGroupStyle}>
                    <input type="text" value={currentTag} onChange={e => setCurrentTag(e.target.value)} style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') addTag(e) }} />
                    <button type="button" onClick={addTag} className="btn btn-secondary"><Plus size={18} /></button>
                </div>
                <div style={tagContainerStyle}>
                    {tags.map((tag, i) => (
                        <span key={i} style={tagStyle}>
                            {tag} <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} style={removeBtnStyle}><X size={12} /></button>
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <label style={labelStyle}>Aturan Pembelian</label>
                <div style={inputGroupStyle}>
                    <input type="text" value={currentRule} onChange={e => setCurrentRule(e.target.value)} style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') addRule(e) }} />
                    <button type="button" onClick={addRule} className="btn btn-secondary"><Plus size={18} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {rules.map((rule, i) => (
                        <div key={i} style={{ ...tagStyle, justifyContent: 'space-between', borderRadius: '8px' }}>
                            <span style={{ flex: 1, fontSize: '0.85rem' }}>{i + 1}. {rule}</span>
                            <button type="button" onClick={() => setRules(rules.filter((_, idx) => idx !== i))} style={removeBtnStyle}><X size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label style={labelStyle}>Deskripsi Lengkap</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ ...inputStyle, minHeight: '80px' }} />
            </div>
            <button disabled={uploading} type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                {uploading ? 'Processing...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Produk')}
            </button>
        </form>
    );

    const renderVoucherForm = (isEdit = false) => (
        <form onSubmit={(e) => handleVoucherSubmit(e, isEdit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Kode Voucher</label>
                    <input type="text" style={inputStyle} value={voucherForm.code} onChange={e => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })} required />
                </div>
                <div>
                    <label style={labelStyle}>Diskon (%)</label>
                    <input type="number" style={inputStyle} value={voucherForm.discount_percent} onChange={e => setVoucherForm({ ...voucherForm, discount_percent: e.target.value })} required />
                </div>
            </div>
            <div>
                <label style={labelStyle}>Berlaku Sampai</label>
                <input type="datetime-local" style={inputStyle} value={voucherForm.valid_until} onChange={e => setVoucherForm({ ...voucherForm, valid_until: e.target.value })} required />
            </div>
            <div>
                <label style={labelStyle}>Produk Tertentu (Opsional)</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem' }}>
                    {products.map(p => (
                        <div key={p.id} onClick={() => toggleProductSelection(p.id)} style={{
                            padding: '0.5rem', marginBottom: '0.2rem', borderRadius: '4px', cursor: 'pointer',
                            background: voucherForm.applicable_products.includes(p.id) ? 'var(--accent-cyan)' : 'transparent',
                            color: voucherForm.applicable_products.includes(p.id) ? 'black' : 'white'
                        }}>
                            <span style={{ fontSize: '0.9rem' }}>{p.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                {isEdit ? 'Simpan Voucher' : 'Buat Voucher'}
            </button>
        </form>
    );


    // === PRODUCT FILTER & SORT STATE ===
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest'); // newest, a-z, z-a, price-low, price-high, sold-high, sold-low
    const [filterCategory, setFilterCategory] = useState('All');

    // === DERIVED PRODUCTS ===
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        switch (sortOption) {
            case 'a-z': return a.title.localeCompare(b.title);
            case 'z-a': return b.title.localeCompare(a.title);
            case 'price-low': return a.price_numeric - b.price_numeric;
            case 'price-high': return b.price_numeric - a.price_numeric;
            case 'sold-high': return (b.sold_count || 0) - (a.sold_count || 0);
            case 'sold-low': return (a.sold_count || 0) - (b.sold_count || 0);
            case 'newest': default: return new Date(b.created_at) - new Date(a.created_at);
        }
    });

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
            <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message="Berhasil disimpan!" />

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="section-title gradient-text">Admin Dashboard</h1>
                <button onClick={() => logout().then(() => window.location.href = '/login')} className="btn btn-secondary">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <button onClick={() => setActiveTab('products')} className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}><List size={18} /> Produk</button>
                <button onClick={() => setActiveTab('vouchers')} className={`btn ${activeTab === 'vouchers' ? 'btn-primary' : 'btn-secondary'}`}><Tag size={18} /> Voucher</button>
                <button onClick={() => setActiveTab('categories')} className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}><Tag size={18} /> Kategori</button>
                <button onClick={() => setActiveTab('subcategories')} className={`btn ${activeTab === 'subcategories' ? 'btn-primary' : 'btn-secondary'}`}><List size={18} /> Subkategori</button>
            </div>

            {activeTab === 'subcategories' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '3rem', alignItems: 'start' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Tambah Subkategori</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Induk Kategori</label>
                                <select
                                    value={newSubcategoryParent}
                                    onChange={(e) => setNewSubcategoryParent(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="" disabled>Pilih Induk Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.name} style={{ color: 'black' }}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Nama Subkategori</label>
                                <input
                                    type="text"
                                    value={newSubcategoryName}
                                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                                    placeholder="Contoh: Youtube, Spotify"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Banner Subkategori (Opsional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewSubcategoryBanner(e.target.files[0]);
                                        }
                                    }}
                                    style={fileInputStyle}
                                />
                            </div>

                            <button
                                onClick={async () => {
                                    if (newSubcategoryName.trim() && newSubcategoryParent) {
                                        let bannerUrl = null;
                                        if (newSubcategoryBanner) {
                                            const fileName = `sub-banner-${Math.random()}.${newSubcategoryBanner.name.split('.').pop()}`;
                                            const { error: uploadError } = await supabase.storage.from('images').upload(fileName, newSubcategoryBanner);
                                            if (!uploadError) {
                                                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                                bannerUrl = data.publicUrl;
                                            }
                                        }

                                        const res = await addSubcategory(newSubcategoryName.trim(), newSubcategoryParent, null, bannerUrl);
                                        if (res.success) {
                                            setNewSubcategoryName('');
                                            setNewSubcategoryBanner(null);
                                            setShowSuccess(true);
                                        } else {
                                            alert(res.error);
                                        }
                                    } else {
                                        alert('Mohon lengkapi form');
                                    }
                                }}
                                className="btn btn-primary"
                                style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                            >
                                <Plus size={18} /> Tambah Subkategori
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Daftar Subkategori</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {categories.map(cat => {
                                const catSubs = subcategories.filter(s => s.category === cat.name);
                                if (catSubs.length === 0) return null;
                                return (
                                    <div key={cat.id}>
                                        <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>{cat.name}</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {catSubs.map(sub => (
                                                <div key={sub.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 'bold' }}>{sub.name}</span>
                                                    <button onClick={() => { if (window.confirm('Hapus subkategori?')) deleteSubcategory(sub.id) }} style={{ background: 'rgba(255,0,0,0.1)', color: 'red', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Tambah Kategori</h2>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Nama Kategori Baru"
                                style={inputStyle}
                            />
                            <button
                                onClick={async () => {
                                    if (newCategory.trim()) {
                                        const res = await addCategory(newCategory.trim());
                                        if (res.success) {
                                            setNewCategory('');
                                            setShowSuccess(true);
                                        } else {
                                            alert(res.error);
                                        }
                                    }
                                }}
                                className="btn btn-primary"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Daftar Kategori</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {categories.map(c => (
                                <div key={c.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                                    <button onClick={() => { if (window.confirm('Hapus kategori?')) deleteCategory(c.id) }} style={{ background: 'rgba(255,0,0,0.1)', color: 'red', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) 1fr', gap: '3rem', alignItems: 'start' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Tambah Produk Baru</h2>
                        {renderProductForm(false)}
                    </div>

                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Daftar Produk ({filteredProducts.length})</h2>

                        {/* PRODUCT CONTROLS: SEARCH, SORT, FILTER */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {/* Row 1: Search */}
                            <input
                                type="text"
                                placeholder="🔍 Cari nama produk..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ ...inputStyle, background: 'rgba(0,0,0,0.2)', borderColor: 'var(--accent-cyan)' }}
                            />
                            {/* Row 2: Sort & Filter */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    style={{ ...inputStyle, flex: 1, background: 'rgba(0,0,0,0.2)' }}
                                >
                                    <option value="newest" style={{ color: 'black' }}>📅 Terbaru</option>
                                    <option value="a-z" style={{ color: 'black' }}>🔤 Nama (A-Z)</option>
                                    <option value="z-a" style={{ color: 'black' }}>🔤 Nama (Z-A)</option>
                                    <option value="price-low" style={{ color: 'black' }}>💰 Harga Terendah</option>
                                    <option value="price-high" style={{ color: 'black' }}>💰 Harga Tertinggi</option>
                                    <option value="sold-high" style={{ color: 'black' }}>🔥 Terlaris (Sold High)</option>
                                    <option value="sold-low" style={{ color: 'black' }}>❄️ Penjualan Rendah</option>
                                </select>

                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    style={{ ...inputStyle, flex: 1, background: 'rgba(0,0,0,0.2)' }}
                                >
                                    <option value="All" style={{ color: 'black' }}>📂 Semua Kategori</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.name} style={{ color: 'black' }}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '1000px', overflowY: 'auto' }}>
                            {filteredProducts.map(product => (
                                <div key={product.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    ) : <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}></div>}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ color: product.color }}>{product.title}</h4>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                            Rp {product.price_numeric?.toLocaleString('id-ID') || '0'}
                                            {product.discount_percent > 0 ? <span style={{ color: 'var(--accent-pink)', marginLeft: '4px' }}>Disc {product.discount_percent}%</span> : ''}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {product.category} • {product.sold_count || 0} Terjual
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => startEditProduct(product)} style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                            <PenTool size={18} />
                                        </button>
                                        <button onClick={() => deleteProduct(product.id)} style={{ background: 'rgba(255,0,0,0.1)', color: 'red', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                                    Tidak ada produk yang cocok.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'vouchers' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Buat Voucher Baru</h2>
                        {renderVoucherForm(false)}
                    </div>

                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Voucher Aktif</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {vouchers.map(v => (
                                <div key={v.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.2rem' }}>{v.code}</h3>
                                        <div style={{ fontSize: '0.9rem' }}>Diskon {v.discount_percent}%</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Exp: {new Date(v.valid_until).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} ({getDurationString(v.valid_until)})
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => startEditVoucher(v)} style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                            <PenTool size={18} />
                                        </button>
                                        <button onClick={() => deleteVoucher(v.id)} style={{ background: 'rgba(255,0,0,0.1)', color: 'red', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL PRODUCT */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Produk">
                {renderProductForm(true)}
            </Modal>

            {/* EDIT MODAL VOUCHER */}
            <Modal isOpen={isVoucherEditModalOpen} onClose={() => setIsVoucherEditModalOpen(false)} title="Edit Voucher">
                {renderVoucherForm(true)}
            </Modal>

        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' };
const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '8px', color: 'white', outline: 'none', fontFamily: 'inherit' };
const fileInputStyle = { ...inputStyle, paddingBottom: '2rem', cursor: 'pointer' };
const inputGroupStyle = { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' };
const tagContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' };
const tagStyle = { background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' };
const removeBtnStyle = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 0, display: 'flex' };
