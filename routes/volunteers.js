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


router.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM volunteers")
    res.status(200).send(result.rows)
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












router.post("/login", async (req, res) => {
    const {username, passwordToCheck} = req.body;
    try {
        const getUserPassword = `SELECT password, id FROM volunteers WHERE volunteers.username = $1`;
        const getPassword = await db.query(getUserPassword, [username]);
        const password = getPassword.rows[0].password;
        const userId = getPassword.rows[0].id;

        const autentification = await bcrypt.compare(passwordToCheck, password);

        if (!autentification) {
            res.status(401).json({ message: "Invalid username or password"});
        };
        
        res.status(200).json({currentUser: username, userId: userId});
    } catch (err) {
        res.status(500).send({error: err.message});
    }
});

module.exports = router;
