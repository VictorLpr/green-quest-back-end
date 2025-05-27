const express = require('express')
const router = express.Router()
const db = require('../db')

router.get("/", async (req, res) => {
    const result = db.query("SELECT * FROM associations")
    console.log(result.rows);
    
})

module.exports = router;
