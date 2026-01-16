import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null); // Store extended profile (role, avatar)
    const [loading, setLoading] = useState(true);

    // Fetch profile helper
    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            // If no profile exists yet (new user), return basic null/default
            setProfile(data || { role: 'member' });
        } catch (err) {
            console.error('Profile fetch error:', err);
        }
    };

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    // Allow manual profile refresh
    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id);
    };

    // Computed role checks
    const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';
    const isOwner = profile?.role === 'owner';

    return (
        <AuthContext.Provider value={{ user, profile, isAdmin, isOwner, login, logout, loading, refreshProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
