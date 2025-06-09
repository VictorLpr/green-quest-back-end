const express = require('express')
const router = express.Router()
const db = require('../db')

router.get("/", async (req, res) => {
    const result = await db.query("SELECT DISTINCT c.title, c.id FROM cities c INNER JOIN  volunteers v  ON c.id = v.city_id ORDER BY title ASC")
    res.status(200).send(result.rows)
})

module.exports = router;