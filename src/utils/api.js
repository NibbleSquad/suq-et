import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchShops = async (categoryId = null) => {
  try {
    const endpoint = categoryId ? `/api/shops?category=${categoryId}` : '/api/shops/featured';
    console.log(`Fetching shops from: ${API_URL}${endpoint}`);
    const response = await api.get(endpoint);
    console.log('Shops fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching shops:', error.response?.data || error.message);
    return [];
  }
};

export const fetchProductsByShop = async (storeId) => {
  try {
    const endpoint = `/api/store/${storeId}/products`;
    console.log(`Fetching products from: ${API_URL}${endpoint}`);
    const response = await api.get(endpoint);
    console.log(`Products for ${storeId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for ${storeId}:`, error.response?.data || error.message);
    return [];
  }
};

export const createCheckout = async (cart, storeId, totalAmount) => {
  try {
    console.log('Creating checkout with:', {cart, storeId, totalAmount});
    const response = await api.post('/api/checkout', {
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productId: item._id,
      })),
      totalAmount,
      storeId,
    });
    console.log('Checkout response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating checkout:', error.response?.data || error.message);
    throw error;
  }
};

export default api;