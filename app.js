const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()

const volunteersRoutes = require('./routes/volunteers');
app.use(cors());
app.use(express.json());

const port =  5000;

app.use('/volunteers', volunteersRoutes )






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});