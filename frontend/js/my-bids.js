const API_BASE_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const userData = JSON.parse(localStorage.getItem("user"));

if (!token || !userData) {
  window.location.href = "auth.html";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchUserBids(userData.user_id);
});

async function fetchUserBids(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/bids/user/${userId}`);
    const data = await res.json();

    if (!data.success) throw new Error("Failed to fetch bids");

    const container = document.getElementById("bid-list");
    if (data.bids.length === 0) {
      container.innerHTML = "<p>No bids placed yet.</p>";
      return;
    }

    for (let bid of data.bids) {
      const product = bid.product;

      // Get highest bid
      const highest = await fetch(`${API_BASE_URL}/bids/highest/${product.product_id}`);
      const highestData = await highest.json();

      let status = "Unknown";

      const deadlinePassed = new Date(product.biddingDeadline) < new Date();
      if (!deadlinePassed) {
        status = "Active ⏳";
      } else if (highestData.success && highestData.highestBid.bid_by === userId && highestData.highestBid.bid_amount === bid.bid_amount) {
        status = "Won ✅";
      } else {
        status = "Lost ❌";
      }

      const row = document.createElement("div");
      row.className = "bid-item";
      row.innerHTML = `
        <h3>${product.pname}</h3>
        <p><strong>Starting Price:</strong> ₹${product.startingPrice}</p>
        <p><strong>Your Bid:</strong> ₹${bid.bid_amount}</p>
        <p><strong>Bid Time:</strong> ${new Date(bid.bid_time).toLocaleString()}</p>
        <p><strong>Status:</strong> ${status}</p>
        <hr />
      `;
      container.appendChild(row);
    }

  } catch (err) {
    console.error("Error fetching bids:", err);
    document.getElementById("bid-list").innerHTML = "<p>Failed to load bids.</p>";
  }
}
