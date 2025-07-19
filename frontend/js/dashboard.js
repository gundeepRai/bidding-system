// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user'));

  if (!token || !userData) {
    alert('You must be logged in!');
    window.location.href = 'auth.html';
    return;
  }

  // Display user info
  document.getElementById('user-name').textContent = userData.name;
  document.getElementById('user-id').textContent = userData.user_id;

  // Fetch and render user's products
fetchUserProducts(userData.user_id);

async function fetchUserProducts(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/user/${userId}`);
    const data = await res.json();

    if (data.success && data.products.length > 0) {
      const container = document.getElementById('listed-products');
      data.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
          <h3>${product.pname}</h3>
          <p>${product.description}</p>
          <p>Starting at ₹${product.startingPrice}</p>
          <p><strong>Deadline:</strong> ${new Date(product.biddingDeadline).toLocaleString()}</p>
          <button onclick="goToProduct('${product.product_id}')">View Product</button>
        `;

        container.appendChild(card);
      });
    } else {
      document.getElementById('listed-products').innerHTML = '<p>No products found.</p>';
    }
  } catch (err) {
    console.error('Error fetching user products:', err);
    alert('Failed to fetch your products.');
  }
}

function goToProduct(productId) {
  window.location.href = `product.html?product_id=${productId}`;
}

  // Handle form submit of creating a new product
  const form = document.getElementById('product-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
      pname: document.getElementById('pname').value,
      description: document.getElementById('description').value,
      startingPrice: document.getElementById('startingPrice').value,
      biddingDeadline: document.getElementById('biddingDeadline').value,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });

      const data = await res.json();
      if (data.success) {
        alert('Product created successfully!');
        form.reset(); // Clear form
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Product creation error:', err);
      alert('Error creating product');
    }
  });
});

// Optional logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
