const express = require('express')
const router = express.Router()
const db = require('../db');
const  hashPassword  = require('../utils/helpers');
const filterByUsername = require('../utils/middleware');
const getOrCreateCity = require('../utils/city');





router.get('/:username', filterByUsername, async (req, res) => {

     res.send(req.findUser)

})

router.post('/',getOrCreateCity, async (req, res) => {
    try {
        const {firstname, lastname, username, email, password, cityId} = req.body;
        console.log(cityId)
        const hashedPassword = await hashPassword(password);
        // console.log(hashedPassword)
        const result = await db.query(
            `INSERT INTO volunteers (firstname, lastname, username, email, password, city_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [firstname, lastname, username, email, hashedPassword, cityId]
        )
        res.status(201).json(result.rows[0])

    } catch (err) {
        console.error('Erreur serveur:', err);
        res.sendStatus(500);
    }
})

module.exports = router;
