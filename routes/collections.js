const express = require('express')
const router = express.Router()
const db = require('../db')

const getOrCreateCity = require('../utils/middleware')

router.post('/', getOrCreateCity, async (req, res) => {
    const client = await db.connect();
    try {
        const {volunteerId, quantitiesArray, cityId} = req.body;
        // quantitiesArray [
        //    {
        //         "wasteId": "_",
        //         "wastePoints": "_",
        //         "quantity": "_"
        //     },
        //     ...
        // ]

        // check les entrées
        if (!volunteerId) {
            return res.status(400).json({error : 'Volunteer id is missing'});
        };
        if (!Array.isArray(quantitiesArray) || quantitiesArray.length === 0) {
            return res.status(400).json({error : 'Quantities are missing'});
        };
        if (!cityId) {
            return res.status(400).json({error : 'City id is missing'});
        };

        // Lance les query
        await client.query('BEGIN');

        // add collection
        const insertCollectionQuery = `INSERT INTO collections (volunteer_id, city_id) VALUES ($1, $2) RETURNING id, created_at`;
        // get city title
        const selectCityTitleQuery = `SELECT title FROM cities WHERE id = $1`;
        // add quantities
        const insertQuantityQuery = `INSERT INTO quantities (quantity, waste_id, collection_id) VALUES ($1, $2, $3)`;
        // get waste point value and title
        const selectWasteQuery = `SELECT points_value, title FROM wastes WHERE id = $1`;
        // get points volunteers already have
        const selectVolunteerPointsQuery = `SELECT points FROM volunteers WHERE id = $1`;
        // update volunteer / calculate total points
        const updateVolunteerPointsQuery = `UPDATE volunteers SET points = $1 WHERE id = $2`;

        const createCollecte = await client.query(insertCollectionQuery, [volunteerId, cityId]);
        const collectionId = createCollecte.rows[0].id;
        const collectionDate = createCollecte.rows[0].created_at;

        const getCity = await client.query(selectCityTitleQuery, [cityId]);
        const cityName = getCity.rows[0].title;

        const getSoldePoints = await client.query(selectVolunteerPointsQuery, [volunteerId]);
        let totalPoints = getSoldePoints.rows[0].points;

        const collectWastes = [];
        let pointsEarned = 0;

        for (const quantity of quantitiesArray) {
            await client.query(insertQuantityQuery, [quantity.quantity, quantity.wasteId, collectionId]);
    
            const wastePoints = await client.query(selectWasteQuery, [quantity.wasteId]);
            pointsEarned += wastePoints.rows[0].points_value * quantity.quantity;
    
            // faire le tableau : waste title, quantity
            collectWastes.push({title: wastePoints.rows[0].title, quantity: quantity.quantity});
        }

        totalPoints += pointsEarned;

        await client.query(updateVolunteerPointsQuery, [totalPoints, volunteerId]);
        await client.query('COMMIT');

        const returnDatas = [
            {
                date: collectionDate,
                cityName,
                collectWastes
            }
        ]

        // return [
        //     {
        //         date: "",
        //         cityName: "",
        //         [
        //             {
        //                 title: "",
        //                 quantity: ""
        //             },
        //             ...
        //         ]
        //     }
        // ]

        res.status(201).json(returnDatas);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
})

module.exports = router;