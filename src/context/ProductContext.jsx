import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ProductContext = createContext();

export function useProducts() {
    return useContext(ProductContext);
}

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]); // New Subcategory State
    const [loading, setLoading] = useState(true);

    // Fetch products from Supabase
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err.message);
            if (categories.length === 0) {
                setCategories([{ id: 1, name: 'Streaming' }, { id: 2, name: 'Design' }, { id: 3, name: 'Other' }]);
            }
        }
    };

    // Fetch Subcategories
    const fetchSubcategories = async () => {
        try {
            const { data, error } = await supabase
                .from('subcategories')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            setSubcategories(data || []);
        } catch (err) {
            console.error('Error fetching subcategories:', err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubcategories();
    }, []);

    // Add Product to Supabase
    const addProduct = async (newProduct) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select();

            if (error) throw error;
            setProducts([data[0], ...products]);
            return { success: true };
        } catch (err) {
            console.error('Error adding product:', err.message);
            return { success: false, error: err.message };
        }
    };

    // Delete Product from Supabase
    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err.message);
        }
    };
    // Update Product in Supabase
    const updateProduct = async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;

            setProducts(products.map(p => (p.id === id ? data[0] : p)));
            return { success: true };
        } catch (err) {
            console.error('Error updating product:', err.message);
            return { success: false, error: err.message };
        }
    };

    // Update Voucher in Supabase
    const updateVoucher = async (id, updates) => {
        try {
            const { error } = await supabase
                .from('vouchers')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Category CRUD
    const addCategory = async (name) => {
        try {
            const { data, error } = await supabase.from('categories').insert([{ name }]).select();
            if (error) throw error;
            setCategories([...categories, data[0]]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteCategory = async (id) => {
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Subcategory CRUD
    const addSubcategory = async (name, category, icon_url = null, banner_url = null) => {
        try {
            const { data, error } = await supabase
                .from('subcategories')
                .insert([{ name, category, icon_url, banner_url }])
                .select();
            if (error) throw error;
            setSubcategories([...subcategories, data[0]]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteSubcategory = async (id) => {
        try {
            const { error } = await supabase.from('subcategories').delete().eq('id', id);
            if (error) throw error;
            setSubcategories(subcategories.filter(s => s.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    // Verify Voucher
    const verifyVoucher = async (code, productId) => {
        try {
            const { data, error } = await supabase
                .from('vouchers')
                .select('*')
                .eq('code', code)
                .single();

            if (error) throw new Error('Voucher tidak ditemukan');
            if (!data) throw new Error('Voucher tidak valid');

            // Check Expiry
            if (data.valid_until) {
                const expiry = new Date(data.valid_until);
                const now = new Date();
                if (expiry <= now) {
                    throw new Error('Voucher sudah kadaluarsa');
                }
            }

            // Check Product Applicability
            // If applicable_products is null/empty, it applies to all. 
            // If set, must include productId.
            // Note: DB returns array or null. 
            if (data.applicable_products && data.applicable_products.length > 0) {
                // Convert productId to string for comparison if needed
                if (!data.applicable_products.includes(productId.toString())) {
                    throw new Error('Voucher tidak berlaku untuk produk ini');
                }
            }

            return { success: true, discount: data.discount_percent };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return (
        <ProductContext.Provider value={{
            products, addProduct, updateProduct, deleteProduct,
            verifyVoucher, updateVoucher, loading,
            categories, addCategory, deleteCategory,
            subcategories, addSubcategory, deleteSubcategory // Expose Subcategories
        }}>
            {children}
        </ProductContext.Provider>
    );
}
