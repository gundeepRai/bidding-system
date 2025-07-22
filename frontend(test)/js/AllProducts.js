document.addEventListener("DOMContentLoaded", () => {
  // Check authentication status
  const token = localStorage.getItem('token');
  const signupButton = document.getElementById('signup-button');
  const loginButton = document.getElementById('login-button');
  const userDashboard = document.getElementById('user-dashboard');
  const logoutButton = document.getElementById('logout-button');

  if (token) {
    // User is logged in
    if (signupButton) signupButton.style.display = 'none';
    if (loginButton) loginButton.style.display = 'none';
    if (userDashboard) userDashboard.style.display = 'block';
    if (logoutButton) {
      logoutButton.classList.remove('hidden');
      logoutButton.addEventListener('click', handleLogout);
    }
  } else {
    // User is not logged in
    if (signupButton) signupButton.style.display = 'block';
    if (loginButton) loginButton.style.display = 'block';
    if (userDashboard) userDashboard.style.display = 'none';
    if (logoutButton) logoutButton.classList.add('hidden');
  }

  // Load products
  const productList = document.getElementById("product-list");

  fetch("http://localhost:5000/api/products/active")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && Array.isArray(data.products)) {
        data.products.forEach(product => {
          const card = document.createElement("div");
          card.className =
            "flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-[#f3f0e7]";

          card.innerHTML = `
            <div class="flex flex-col justify-center">
              <h3 class="text-lg font-semibold text-[#1c170d]">${product.pname}</h3>
              <p class="text-sm text-[#5c513a]">${product.description}</p>
              <p class="text-sm text-[#1c170d] mt-1">
                Starting Bid: ₹${product.startingPrice.toLocaleString()}
              </p>
              <p class="text-xs text-[#9b844b] mt-1">
                Deadline: ${new Date(product.biddingDeadline).toLocaleString()}
              </p>
            </div>
            <img src="https://via.placeholder.com/100" alt="${product.pname}" class="rounded-lg h-24 w-24 object-cover ml-4">
          `;

          card.addEventListener("click", () => {
            window.location.href = `product.html?id=${product.product_id}`;
          });

          productList.appendChild(card);
        });
      } else {
        productList.innerHTML = `<p class="text-red-500">No active products found.</p>`;
      }
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      productList.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
    });
});

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  window.location.reload(); // Refresh to update UI
}



// document.addEventListener("DOMContentLoaded", () => {
//   const productList = document.getElementById("product-list");

//   fetch("http://localhost:5000/api/products/active") // update if needed
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.success && Array.isArray(data.products)) {
//         data.products.forEach(product => {
//           const card = document.createElement("div");
//           card.className =
//             "flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-[#f3f0e7]";

//           card.innerHTML = `
//             <div class="flex flex-col justify-center">
//               <h3 class="text-lg font-semibold text-[#1c170d]">${product.pname}</h3>
//               <p class="text-sm text-[#5c513a]">${product.description}</p>
//               <p class="text-sm text-[#1c170d] mt-1">
//                 Starting Bid: ₹${product.startingPrice.toLocaleString()}
//               </p>
//               <p class="text-xs text-[#9b844b] mt-1">
//                 Deadline: ${new Date(product.biddingDeadline).toLocaleString()}
//               </p>
//             </div>
//             <img src="https://via.placeholder.com/100" alt="${product.pname}" class="rounded-lg h-24 w-24 object-cover ml-4">
//           `;

//           card.addEventListener("click", () => {
//             window.location.href = `product.html?id=${product.product_id}`;
//           });

//           productList.appendChild(card);
//         });
//       } else {
//         productList.innerHTML = `<p class="text-red-500">No active products found.</p>`;
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching products:", err);
//       productList.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
//     });
// });






// // document.addEventListener("DOMContentLoaded", () => {
// //   const productList = document.getElementById("product-list");

// //   fetch("http://localhost:5000/api/products/active") // update to correct backend URL if different
// //     .then((res) => res.json())
// //     .then((data) => {
// //       if (data.success && Array.isArray(data.products)) {
// //         data.products.forEach(product => {
// //           const card = document.createElement("div");
// //           card.className = "border rounded-xl p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition";
// //           card.innerHTML = `
// //             <div>
// //               <h3 class="text-lg font-semibold">${product.pname}</h3>
// //               <p class="text-sm text-gray-500">${product.description}</p>
// //               <p class="text-sm text-gray-700 mt-1">Starting Bid: ₹${product.startingPrice}</p>
// //               <p class="text-xs text-gray-400">Deadline: ${new Date(product.biddingDeadline).toLocaleString()}</p>
// //             </div>
// //             <img src="https://via.placeholder.com/100" alt="${product.pname}" class="rounded-lg h-20 w-20 object-cover">
// //           `;
// //           card.addEventListener("click", () => {
// //             window.location.href = `product.html?id=${product.product_id}`;
// //           });
// //           productList.appendChild(card);
// //         });
// //       } else {
// //         productList.innerHTML = `<p class="text-red-500">No active products found.</p>`;
// //       }
// //     })
// //     .catch((err) => {
// //       console.error("Error fetching products:", err);
// //       productList.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
// //     });
// // });
