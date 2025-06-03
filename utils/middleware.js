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



module.exports = filterByUsername;