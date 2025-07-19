// js/api.js
const API_BASE_URL = 'http://localhost:5000/api'; // change if different

async function fetchActiveProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/active`);
    const data = await response.json();
    if (data.success) return data.products;
    else throw new Error(data.error || 'Failed to fetch products');
  } catch (err) {
    console.error('API Error:', err.message);
    return [];
  }
}
