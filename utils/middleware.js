const db = require('../db');

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

const getOrCreateCity = async (req, res, next) => {
    try {
        const {city, zipcode} = req.body
        const cityQuery = await db.query(`SELECT id FROM cities WHERE title = $1 and zipcode = $2`, [city, zipcode]);
        let cityId;
        if (cityQuery.rows[0]) {
            cityId = cityQuery.rows[0].id;
        } else {
            const createCityQuery = await db.query(
                `INSERT INTO cities (title, zipcode) VALUES ($1, $2) RETURNING id`,
                [city, zipcode]
            );
            cityId = createCityQuery.rows[0].id;
        }
        req.body.cityId = cityId;
        next()
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.sendStatus(500);
    }
}

module.exports = filterByUsername;
module.exports = getOrCreateCity;