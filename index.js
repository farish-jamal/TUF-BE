const express = require("express");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

const route = require('./routes');

app.use('/api', route);

app.listen(PORT, () => {
  console.log("Server running");
});
