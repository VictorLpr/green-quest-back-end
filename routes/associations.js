const express = require('express')
const router = express.Router()
const db = require('../db')

router.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM associations")
    console.log(result.rows);
    res.sendStatus(200)
})

module.exports = router;
