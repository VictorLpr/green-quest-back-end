const db = require('../db');

const getOrCreateCity = async (req, res, next) => {
    try {
        if(!req.body.city) {
            next()
        }
        const {title, zipcode, lat, lng} = req.body.city
        const cityQuery = await db.query(`SELECT id FROM cities WHERE title = $1 and zipcode = $2`, [title, zipcode]);
        let cityId;
        if (cityQuery.rows[0]) {
            cityId = cityQuery.rows[0].id;
        } else {
            const createCityQuery = await db.query(
                `INSERT INTO cities (title, zipcode, lat, long) VALUES ($1, $2, $3, $4) RETURNING id`,
                [title, zipcode, lat, lng]
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

module.exports = getOrCreateCity;
