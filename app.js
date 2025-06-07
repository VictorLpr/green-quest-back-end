const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()

const volunteersRoutes = require('./routes/volunteers');
const associationsRoutes = require('./routes/associations');
const donationsRoutes = require('./routes/donations');
const collectionsRoutes = require('./routes/collections');
const wastesRoutes = require('./routes/wastes');
const leaderboardRoutes = require('./routes/leaderboard')
const citiesRoutes = require('./routes/cities');

app.use(cors());
app.use(express.json());

const port = 5001;

app.use('/volunteers', volunteersRoutes)

app.use('/associations', associationsRoutes)

app.use('/donations', donationsRoutes)

app.use('/collections', collectionsRoutes)

app.use('/wastes', wastesRoutes)

app.use('/leaderboard', leaderboardRoutes) 

app.use('/cities', citiesRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});