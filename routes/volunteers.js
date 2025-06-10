const express = require('express')
const router = express.Router()
const db = require('../db');
const hashPassword = require('../utils/helpers');
const filterByUsername = require('../utils/middleware');
const getOrCreateCity = require('../utils/city');

const bcrypt = require('bcrypt');


router.get('/:username', filterByUsername, async (req, res) => {
    res.send(req.findUser)
})

router.post('/', getOrCreateCity, async (req, res) => {
    try {
        const { firstname, lastname, username, email, password, cityId } = req.body;
        console.log(cityId)
        const hashedPassword = await hashPassword(password);
        // console.log(hashedPassword)
        const result = await db.query(
            `INSERT INTO volunteers (firstname, lastname, username, email, password, city_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [firstname, lastname, username, email, hashedPassword, cityId]
        )
        res.status(201).json(result.rows[0])

    } catch (err) {
        if (err.constraint == "volunteers_username_key") {
            res.status(401).send("Pseudo déjà pris")
        } else if (err.constraint == "volunteers_email_key") {
            res.status(401).send("Cet email existe déjà")
        }
        console.error('Erreur serveur:', err);
        res.sendStatus(500);
    }
})


router.get("/", async (req, res) => {
    try {
        const result = await db.query(" SELECT v.id, v.firstname, v.lastname, v.username, v.email, c.title  FROM volunteers v join cities c ON v.city_id = c.id ORDER BY v.lastname")
        console.log(result.rows)
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send()
    }
})

router.delete('/:username', filterByUsername, async (req, res) => {
    try {
        const userId = req.findUser.id
        console.log(userId)
        const result = await db.query(
            `DELETE FROM volunteers WHERE id=$1`,
            [userId]
        )
        res.status(200).send(result.rows)
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).send()
    }
})

router.patch('/:id', getOrCreateCity, async (req, res) => {
    try {
        const userId = req.params.id
        const userUpdate = req.body

        if (userUpdate.city) {
            delete userUpdate.city;
            userUpdate["city_id"] = userUpdate.cityId
            delete userUpdate.cityId
        }

        if (userUpdate.password) {
            userUpdate.password = await hashPassword(userUpdate.password)
        }

        let updateQuery = `UPDATE volunteers SET`
        let values = []
        for (const [key, value] of Object.entries(userUpdate)) {
            values.push(value)
            updateQuery += ` ${key} = $${values.length},`;
        }
        updateQuery += ` updated_at = NOW() WHERE id = $${values.length + 1};`
        const result = await db.query(updateQuery, [...values, userId])
        res.sendStatus(200)

    } catch (err) {
        if (err.constraint == "volunteers_username_key") {
            res.status(401).send("Pseudo déjà pris")
        } else if (err.constraint == "volunteers_email_key") {
            res.status(401).send("Cet email existe déjà")
        }
        console.error(err)
        res.status(500).send()
    }
})

router.post("/login", async (req, res) => {
    const { username, passwordToCheck } = req.body;
    try {
        const getUserPassword = `SELECT password, id FROM volunteers WHERE volunteers.username = $1`;
        const getPassword = await db.query(getUserPassword, [username]);

        if (getPassword.rowCount === 0) {
            return res.status(401).json({ message: "Ce pseudo n'existe pas."});
        }

        const password = getPassword.rows[0].password;
        const userId = getPassword.rows[0].id;

        const autentification = await bcrypt.compare(passwordToCheck, password);

        if (!autentification) {
            return res.status(401).json({ message: "Ce mot de passe est incorrect. Veuillez réessayer."});
        };

        res.status(200).json({ userName: username, userId: userId });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
