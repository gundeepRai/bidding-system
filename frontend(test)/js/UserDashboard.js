document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("user_name");

  if (!userId || !token) {
    alert("Please log in OR Register to access your dashboard.");
    window.location.href = 'auth.html';
    return;
  }

  // 👉 Set name and user id in sidebar
  const nameEl = document.getElementById("userName");
  const idEl = document.getElementById("userIdDisplay");
  if (nameEl && userName) nameEl.innerText = userName;
  if (idEl && userId) idEl.innerText = userId;

  fetchUserListings(userId);
  fetchUserBids(userId);

  // Handle "Create Listing" button
  document.querySelector("button").addEventListener("click", () => {
    window.location.href = "CreateProduct.html";
  });
});

async function fetchUserListings(userId) {
  try {
    const res = await fetch(`${window.BACKEND_BASE_URL}/api/products/user/${userId}`);
    const data = await res.json();

    if (data.success && data.products) {
      const listingsTable = document.getElementById("activeListingsBody").querySelector("tbody");
      listingsTable.innerHTML = "";

      for (const product of data.products) {
        const row = document.createElement("tr");
        row.classList.add("border-t", "border-t-[#e8e1cf]", "cursor-pointer");

        const timeLeft = getTimeLeft(product.biddingDeadline);
        let bid_winner = "---";
        let highestBidAmount = null;

        if (timeLeft === "Expired") {
          try {
            const winnerRes = await fetch(`${window.BACKEND_BASE_URL}/api/bids/winner/${product.product_id}`);
            if (winnerRes.ok) {
              const winnerData = await winnerRes.json();
              if (winnerData.winner) {
                const { name, email } = winnerData.winner;
                bid_winner = `${name} (${email})`;
                highestBidAmount = winnerData.bidAmount;
              }
            }
          } catch (err) {
            console.error("Error fetching bid winner:", err);
          }
        }

        // If not expired or no winner found, get the highest bid normally
        if (highestBidAmount === null) {
          highestBidAmount = await getHighestBidAmount(product.product_id);
        }

        row.innerHTML = `
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#1c170d] text-sm font-normal">${product.pname}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#9b844b] text-sm font-normal">₹${highestBidAmount ?? "---"}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#9b844b] text-sm font-normal">${timeLeft}</td>
          <td class="h-[72px] px-4 py-2 w-[400px] text-[#9b844b] text-sm font-normal">${bid_winner}</td>
        `;

        row.addEventListener("click", () => {
          window.location.href = `product.html?id=${product.product_id}`;
        });

        listingsTable.appendChild(row);
      }
    }
  } catch (error) {
    console.error("Error fetching user listings:", error);
  }
}


async function fetchUserBids(userId) {
  const bidsTable = document.getElementById("userBidsBody");
  bidsTable.innerHTML = "";

  try {
    const res = await fetch(`${window.BACKEND_BASE_URL}/api/bids/user/${userId}`);
    const { success, bids } = await res.json();
    if (!success || !bids) return;

    const now = new Date();
    const seen = new Set();

    for (let bid of bids) {
      const product = bid.product;
      if (!product || seen.has(product.product_id)) continue;
      seen.add(product.product_id);

      // 1️⃣ Fetch bidding deadline
      let deadline;
      try {
        const pRes = await fetch(`${window.BACKEND_BASE_URL}/api/products/${product.product_id}`);
        const pData = await pRes.json();
        deadline = new Date(pData.product[0].biddingDeadline);
      } catch {
        // fallback: expired
        deadline = new Date(0);
      }

      // 2️⃣ Compute time left from that deadline
      const timeLeft = getTimeLeft(deadline);

      // 3️⃣ Who's highest?
      let highest;
      try {
        const hbRes = await fetch(`${window.BACKEND_BASE_URL}/api/bids/highest/${product.product_id}`);
        if (hbRes.ok) {
          const hbData = await hbRes.json();
          highest = hbData.highestBid;
        }
      } catch { /* no-op */ }

      // 4️⃣ Determine status
      // - Highest Bid: you are highest & still open
      // - Outbid: someone else highest & still open
      // - Won: you are highest & deadline passed
      // - Lost: someone else highest & deadline passed
      let status;
      const isHighest = highest && highest.bid_by === userId;
      const open = deadline > now;

      if (isHighest && open)       status = "Highest Bid";
      else if (!isHighest && open) status = "Outbid";
      else if (isHighest && !open) status = "Won";
      else                          status = "Lost";

      // 5️⃣ Render row
      const row = document.createElement("tr");
      row.className = "border-t border-[#e8e1cf] cursor-pointer";
      row.innerHTML = `
        <td class="px-4 py-2 text-sm text-[#1c170d]">${product.pname}</td>
        <td class="px-4 py-2 text-sm text-[#9b844b]">${status}</td>
        <td class="px-4 py-2 text-sm text-[#9b844b]">${timeLeft}</td>
      `;
      row.addEventListener("click", () => {
        window.location.href = `product.html?id=${product.product_id}`;
      });
      bidsTable.appendChild(row);
    }
  } catch (err) {
    console.error("Error fetching user bids:", err);
  }
}

// Updated helper: accepts Date or ISO string
function getTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}d ${hours}h`;
}


function getTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}h`;
}

async function getHighestBidAmount(productId) {
  try {
    const res = await fetch(`${window.BACKEND_BASE_URL}/api/bids/highest/${productId}`);
    const data = await res.json();

    if (!res.ok) {
      console.warn(`❌ No highest bid for ${productId}:`, data.error || res.statusText);
      return 0;
    }

    return data.success ? data.highestBid.bid_amount : 0;
  } catch (err) {
    console.error("Error fetching highest bid:", err);
    return 0;
  }
}


async function getHighestBidder(productId) {
  try {
    const res = await fetch(`${window.BACKEND_BASE_URL}/api/bids/highest/${productId}`);
    const data = await res.json();
    return data.success ? data.highestBid : null;
  } catch {
    return null;
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("token");
  window.location.href = "auth.html";
});
