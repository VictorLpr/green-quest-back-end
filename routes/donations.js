const express = require('express')
const router = express.Router()
const db = require('../db')


router.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM donations")
    res.status(200).send(result.rows)
})

router.post('/', async (req, res) => {
    try {
        const {volunteerId, associationId, value} = req.body
        
        const result = await db.query(
            `INSERT INTO donations (volunteer_id, association_id) VALUES ($1, $2) RETURNING *`,
            [volunteerId, associationId]
        )

        const donationId = result.rows[0].id
        const donationValueQuery = await db.query(
            `INSERT INTO donation_values(donation_id, value) VALUES ($1, $2) RETURNING *`,
            [donationId, value]
        )
        res.sendStatus(201)

    } catch (error) {
        console.error('Erreur serveur:', err);
        res.sendStatus(500);
    }
})


module.exports = router;
