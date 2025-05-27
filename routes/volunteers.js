const express = require('express')
const router = express.Router()
const db = require('../db')

const filterByUsername = async (req, res, next) => {
    const username = req.params.username;
    console.log(username)
    try {
        let baseQuery = 'SELECT * FROM volunteers WHERE username = $1'
        const result = await db.query(baseQuery, [username])
        console.log(result.rows)
        if (result.rows[0]) {
            req.findUser = result.rows[0]
            next()
        } else {
            res.sendStatus(404)
        }
    } catch (err) {
        res.sendStatus(500)
    }
}



router.get('/:username', filterByUsername, async (req, res) => {

     res.send(req.findUser)

})

router.post('/', async (req, res) => {
    try {
        const {firstName, lastName, username, email, password, city } = req.body;
        const cityQuery = `SELECT id FROM cities WHERE title = $1`;
        const cityId = await db.query(cityQuery, [city]);
        if (cityId.rows[0]) {
            cityId = cityId.rows[0];
        } else {
            const createCity = await db.query(
                `INSERT INTO cities (title) VALUES ($1) RETURNING id`,
                [city]
            );
            cityId = createCity.rows[0];
        }
        const result = await db.query(
            `INSERT INTO volunteers (firstname, lastname, username, email, password, city_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [firstName, lastName, username, email, password, cityId]
        )
        res.status(201).json(result.rows[0])

    } catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;
