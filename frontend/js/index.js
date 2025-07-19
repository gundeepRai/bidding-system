// js/index.js
document.addEventListener('DOMContentLoaded', async () => {
  const productsContainer = document.getElementById('products-container');
  const dashboardBtn = document.getElementById('dashboardBtn');

  // Redirect logic for dashboard button
  dashboardBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = 'user_dashboard.html';
    } else {
      window.location.href = 'auth.html';
    }
  });

  // Load and display products
  const products = await fetchActiveProducts();

  if (products.length === 0) {
    productsContainer.innerHTML = `<p>No active products found.</p>`;
    return;
  }

  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${prod.pname}</h3>
      <p>${prod.description}</p>
      <p>Starting Price: ₹${prod.startingPrice}</p>
      <p>Deadline: ${new Date(prod.biddingDeadline).toLocaleString()}</p>
    `;
    card.addEventListener('click', () => {
      window.location.href = `product.html?product_id=${encodeURIComponent(prod.product_id)}`;
    });
    productsContainer.appendChild(card);
  });
});
