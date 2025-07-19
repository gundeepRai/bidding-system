const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const bidRoutes = require('./routes/bidRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load .env
connectDB();     // Connect to MongoDB

const app = express({
  origin: "http://127.0.0.1:5500", // frontend served via Live Server
  credentials: true
});
app.use(cors());
app.use(express.json()); // To parse JSON in requests

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bids', bidRoutes);


// Sample route
app.get('/', (req, res) => {
  res.send('🟢 Bidding System API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
