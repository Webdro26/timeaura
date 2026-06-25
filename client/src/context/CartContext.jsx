import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0, discount: 0 });
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
      setCartCount(res.data.items?.reduce((s, i) => s + i.quantity, 0) || 0);
    } catch {}
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      await fetchCart();
      toast.success('Added to cart!', { style: { background: '#1e2035', color: '#fff', border: '1px solid #00d4ff33' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put('/cart/update', { productId, quantity });
      await fetchCart();
    } catch {}
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
      toast.success('Removed from cart');
    } catch {}
  };

  const applyCoupon = async (code) => {
    const res = await api.post('/cart/coupon', { code });
    await fetchCart();
    return res.data;
  };

  const removeCoupon = async () => {
    await api.delete('/cart/coupon');
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart({ items: [], subtotal: 0, total: 0, discount: 0 });
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
