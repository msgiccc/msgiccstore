import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { User, Shield, LogOut, Camera, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import SuccessPopup from '../components/SuccessPopup';

export default function Profile() {
    const { user, profile, logout, refreshProfile, isAdmin } = useAuth();
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url);
        }
    }, [profile]);

    const handleAvatarUpload = async (e) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await updateProfile({ avatar_url: publicUrl });
            setAvatarUrl(publicUrl);

        } catch (error) {
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                updated_at: new Date(),
                ...updates,
            });

            if (error) throw error;
            await refreshProfile();
            setShowSuccess(true);
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    // Helper for Role Badge Color
    const getRoleColor = (role) => {
        if (role === 'owner') return '#facc15'; // Gold
        if (role === 'admin') return '#a855f7'; // Purple
        return '#94a3b8'; // Grey
    };

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '4rem', maxWidth: '600px' }}>
            <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} message="Profil berhasil diperbarui!" />

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>

                {/* Avatar Section */}
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem auto' }}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--accent-cyan)' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={60} color="rgba(255,255,255,0.5)" />
                        </div>
                    )}

                    <label style={{
                        position: 'absolute', bottom: '0', right: '0',
                        background: 'var(--accent-cyan)', borderRadius: '50%',
                        width: '36px', height: '36px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <Camera size={20} color="black" />
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                    </label>
                </div>

                {/* Info Section */}
                <h2 style={{ marginBottom: '0.5rem' }}>{user?.email}</h2>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: `${getRoleColor(profile?.role)}22`,
                    color: getRoleColor(profile?.role),
                    padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2rem'
                }}>
                    <Shield size={16} /> {profile?.role?.toUpperCase() || 'MEMBER'}
                </div>

                {/* Edit Name */}
                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nama Lengkap Anda"
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '0.8rem', borderRadius: '8px', color: 'white', outline: 'none'
                            }}
                        />
                        <button onClick={() => updateProfile({ full_name: fullName })} className="btn btn-secondary" style={{ padding: '0.8rem' }}>
                            <Save size={20} />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {isAdmin && (
                        <Link to="/admin" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                            <Shield size={20} /> Buka Admin Dashboard
                        </Link>
                    )}

                    <button onClick={handleLogout} className="btn btn-secondary" style={{ justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
