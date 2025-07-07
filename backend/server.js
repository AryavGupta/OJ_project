const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const connectDB = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const testcases = require('./routes/testcases');
const submissions = require('./routes/submissions');

// middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/testcases', testcases);
app.use('/api/submissions', submissions);

connectDB();

app.listen(process.env.PORT, () =>{
  console.log(`Server running on port : ${process.env.PORT}`);
});

