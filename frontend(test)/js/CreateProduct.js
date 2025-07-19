document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const productName = document.getElementById("productName");
  const productDescription = document.getElementById("productDescription");
  const startingPrice = document.getElementById("startingPrice");
  const auctionDuration = document.getElementById("biddingDeadline");

  const createBtn = document.getElementById("createListingBtn");

  createBtn.addEventListener("click", async () => {
    if (!token || !userId) {
      alert("User not authenticated.");
      return;
    }

    const pname = productName.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(startingPrice.value.trim());
    const deadlineValue = auctionDuration.value;

    if (!pname || !description || isNaN(price) || !deadlineValue) {
      alert("Please fill all fields properly.");
      return;
    }

    const deadline = new Date(deadlineValue);

    const productData = {
      pname,
      description,
      startingPrice: price,
      biddingDeadline: deadline.toISOString(),
      created_By: userId,
    };

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (res.status === 201 && result.success) {
        alert("Product created successfully!");
        window.location.href = "UserDashboard.html";
      } else {
        alert("Failed to create product.");
        console.error(result);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while creating the product.");
    }
  });
});
