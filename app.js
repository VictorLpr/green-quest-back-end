const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require('dotenv').config()
const volunteersRoutes = require('./routes/volunteers');
app.use(express.json());

const port = process.env.PORT || 5000;

app.use('/volunteers', volunteersRoutes )






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});