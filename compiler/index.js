const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const compileRoute = require('./routes/compile');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/run', compileRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Compiler server is running on port ${PORT}`);
});
