const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const connectDB = require('./database/db');
const authRoutes = require('./routes/authRoutes');

// middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

connectDB();

app.listen(process.env.PORT, () =>{
  console.log(`Server running on port : ${process.env.PORT}`);
});

