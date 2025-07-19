document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!productId || !userId || !token) {
    alert("Please log in to view product details and placing bid.");
    window.location.href = 'auth.html';
    return;
  }

  let biddingDeadline = null; // for deadline check

  try {
    // 1. Product Details
    const res = await fetch(`http://localhost:5000/api/products/${productId}`);
    const data = await res.json();

    if (!data.success || data.product.length === 0) {
      alert("Product not found");
      return;
    }

    const product = data.product[0];
    biddingDeadline = new Date(product.biddingDeadline);

    document.getElementById("productName").textContent = product.pname;
    document.getElementById("productDescription").textContent = product.description;
    document.getElementById("startingPrice").textContent = product.startingPrice;

    // Current Price (Highest Bid)
    const bidRes = await fetch(`http://localhost:5000/api/bids/highest/${product.product_id}`);
    const bidData = await bidRes.json();
    const highestBid = bidData.success ? bidData.highestBid.bid_amount : product.startingPrice;

    document.getElementById("currentPrice").textContent = highestBid;



    // ---------------- Time Left -------------------
    const now = new Date();
    const diff = biddingDeadline - now;
    document.getElementById("timeLeft").textContent =
      diff <= 0 ? "Expired" : `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor((diff / (1000 * 60 * 60)) % 24)}h`;
    
    const timeLeftElement = document.getElementById("timeLeft");
    updateTimeRemaining(); // initial call
    const timer = setInterval(updateTimeRemaining, 1000); // update every second
    function updateTimeRemaining() {
  const now = new Date();
  const diff = biddingDeadline - now;

  if (diff <= 0) {
    timeLeftElement.textContent = "Expired";
    clearInterval(timer); // stop updates once expired
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  timeLeftElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


    // 2. Bid History
    fetchBidHistory(product.product_id);

    // 3. Place Bid Form Logic
    const showFormBtn = document.getElementById("showBidFormBtn");
    const bidForm = document.getElementById("bidForm");
    const bidAmountInput = document.getElementById("bidAmount");
    const bidStatusMsg = document.getElementById("bidStatusMsg");

    if (diff <= 0) {
      showFormBtn.disabled = true;
      showFormBtn.textContent = "Bidding Expired";
      showFormBtn.classList.add("opacity-50", "cursor-not-allowed");

      // Call modular function to fetch winner
      fetchBidWinner(productId);
    } else {
      showFormBtn.addEventListener("click", () => {
        bidForm.classList.toggle("hidden");
        bidStatusMsg.textContent = ""; // reset on open
      });

      bidForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const bidAmount = bidAmountInput.value;
        if (!bidAmount || parseFloat(bidAmount) <= 0 || parseFloat(bidAmount) < highestBid || parseFloat(bidAmount) <= product.startingPrice) {
          bidStatusMsg.textContent = "Bid more than current value is allowed.";
          return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/bids/${product.product_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ bid_amount: bidAmount })
          });

          const result = await response.json();

          if (result.success) {
            bidStatusMsg.textContent = "✅ Bid placed successfully!";
            bidAmountInput.value = "";
            fetchBidHistory(product.product_id); // refresh bid history
            document.getElementById("currentPrice").textContent = bidAmount; // optimistic update
          } else {
            bidStatusMsg.textContent = "❌ Failed to place bid.";
          }
        } catch (err) {
          console.error("Bid error:", err);
          bidStatusMsg.textContent = "❌ An error occurred.";
        }
      });
    }
  } catch (error) {
    console.error("Error loading product:", error);
  }
});



async function fetchBidHistory(productId) {
  const bidHistoryContainer = document.getElementById("bidHistoryBody");
  bidHistoryContainer.innerHTML = "";

  try {
    const res = await fetch(`http://localhost:5000/api/bids/history/${productId}`);
    const data = await res.json();

    if (data.success && data.bids.length > 0) {
      data.bids.forEach((bid) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="px-4 py-2 text-sm text-[#1c170d]">${bid.bid_by.name}</td>
          <td class="px-4 py-2 text-sm text-[#1c170d]">₹${bid.bid_amount}</td>
          <td class="px-4 py-2 text-sm text-[#9b844b]">${new Date(bid.bid_time).toLocaleString()}</td>
        `;
        bidHistoryContainer.appendChild(row);
      });
    } else {
      bidHistoryContainer.innerHTML = `<tr><td colspan="3" class="px-4 py-2 text-sm text-[#a16a45]">No bids yet.</td></tr>`;
    }
  } catch (err) {
    console.error("Error fetching bid history:", err);
  }
}

function fetchBidWinner(productId) {
  const winnerSection = document.getElementById("bidWinnerSection");
  const winnerInfo = document.getElementById("winnerInfo");

  fetch(`http://localhost:5000/api/bids/winner/${productId}`)
    .then(res => {
      if (!res.ok) throw new Error("No winner found or error occurred.");
      return res.json();
    })
    .then(data => {
      if (data.winner) {
        const { name, email } = data.winner;
        const bidAmount = data.bidAmount;
        winnerInfo.textContent = `🏆 Winning Bid: ₹${bidAmount} by ${name} (${email})`;
      } else {
        winnerInfo.textContent = "No bids were placed.";
      }
      winnerSection.classList.remove("hidden");
    })
    .catch(err => {
      console.error("Error fetching bid winner:", err);
      winnerInfo.textContent = "Error fetching bid winner.";
      winnerSection.classList.remove("hidden");
    });
}










// document.addEventListener("DOMContentLoaded", async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const productId = urlParams.get("id");

//   if (!productId) {
//     alert("Product ID missing in URL");
//     return;
//   }

//   try {
//     // Step 1: Fetch product details
//     const res = await fetch(`http://localhost:5000/api/products/${productId}`);
//     const data = await res.json();

//     if (!data.success || !data.product || data.product.length === 0) {
//       alert("Product not found");
//       return;
//     }

//     const product = data.product[0];

//     // Populate product details
//     document.getElementById("productName").textContent = product.pname;
//     document.getElementById("productDescription").textContent = product.description;
//     document.getElementById("startingPrice").textContent = product.startingPrice;

//     // Step 2: Get current (highest) bid
//     const bidRes = await fetch(`http://localhost:5000/api/bids/highest/${product.product_id}`);
//     const bidData = await bidRes.json();
//     const highestBid = bidData.success ? bidData.highestBid.bid_amount : product.startingPrice;
    
//     document.getElementById("currentPrice").textContent = highestBid;

//     // Step 3: Time left
//     const deadline = new Date(product.biddingDeadline);
//     const now = new Date();
//     const diff = deadline - now;

//     document.getElementById("timeLeft").textContent =
//       diff <= 0 ? "Expired" : `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor((diff / (1000 * 60 * 60)) % 24)}h`;

//     // Step 4: Fetch and display bid history
//     await fetchBidHistory(product.product_id);

//   } catch (error) {
//     console.error("Error fetching product details:", error);
//   }
// });

// async function fetchBidHistory(productId) {
//   try {
//     const res = await fetch(`http://localhost:5000/api/bids/history/${productId}`);
//     const data = await res.json();

//     if (!data.success || !data.bids) {
//       console.warn("No bid history found.");
//       return;
//     }

//     const tbody = document.getElementById("bidHistoryBody");
//     tbody.innerHTML = "";

//     // Sort bids by latest
//     const sortedBids = data.bids.sort((a, b) => new Date(b.bid_time) - new Date(a.bid_time));

//     sortedBids.forEach(bid => {
//       const row = document.createElement("tr");
//       row.classList.add("border-t", "border-[#ead8cd]");

//       const bidTime = new Date(bid.bid_time).toLocaleString("en-IN", {
//         dateStyle: "medium",
//         timeStyle: "short",
//       });

//       row.innerHTML = `
//         <td class="px-4 py-2">${bid.bid_by.name}</td>
//         <td class="px-4 py-2">₹${bid.bid_amount}</td>
//         <td class="px-4 py-2">${bidTime}</td>
//       `;

//       tbody.appendChild(row);
//     });

//   } catch (err) {
//     console.error("Failed to fetch bid history:", err);
//   }
// }
