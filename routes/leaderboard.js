const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
    try {
        const getDonationByUser = await db.query(
            `SELECT volunteers.firstname, SUM(donations.value) AS total
             FROM volunteers
             JOIN donations ON donations.volunteer_id = volunteers.id
             GROUP BY volunteers.firstname
            `
        )

        console.log(getDonationByUser.rows);
        const donationByUser = getDonationByUser.rows;

        res.status(200).json({
            donationByUser
        });

    } catch (err) {
        console.error('Erreur serveur:', err);
        res.sendStatus(500)
    }

})

module.exports = router