const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/', ddfiujhf, async (req, res) => {
    try {
        const {volunteerId, quantitiesArray} = req.body;
        // quantitiesArray [
        //    {
        //         "wasteId": "_",
        //         "wastePoints": "_",
        //         "quantity": "_"
        //     },
        //     ...
        // ]

        const cityId = 1;

        //////  date !!!!!!

        // add collection
        const insertCollectionQuery = `INSERT INTO collections (volunteer_id, city_id) VALUES ($1, $2) RETURNING id, created_at`;
        // get city title
        const selectCityTitleQuery = `SELECT title FROM cities WHERE id = $1`;
        // add quantities
        const insertQuantityQuery = `INSERT INTO quantities (quantity, waste_id, collection_id) VALUES ($1, $2, $3)`;
        // get waste point value and title
        const selectWasteQuery = `SELECT points_value, title FROM wastes WHERE waste_id = $1`;
        // get points volunteers already have
        const selectVolunteerPointsQuery = `SELECT points FROM volunteers WHERE volunteer_id = $1`;
        // update volunteer / calculate total points
        const updateVolunteerPointsQuery = `UPDATE volunteers SET points = $1 WHERE volunteer_id = $2`;

        const createCollecte = await db.query(insertCollectionQuery, [volunteerId, cityId]);
        const collectionId = createCollecte.rows[0].id;
        const collectionDate = createCollecte.rows[0].created_at;

        const getCity = await db.query(selectCityTitleQuery, [cityId]);
        const cityName = getCity.rows[0].title;

        const getSoldePoints = await db.query(selectVolunteerPointsQuery, [volunteerId]);
        const totalPoints = getSoldePoints.rows[0].points;

        const collectWastes = [];

        quantitiesArray.map( async (quantity) => {
            const createQuantity = await db.query(insertQuantityQuery, [quantity.quantity, quantity.wasteId, collectionId]);

            const wastePoints = await db.query(selectWasteQuery[0], [quantity.wasteId]);
            totalPoints += wastePoints.rows[0].points_value * quantity.quantity;

            // faire le tableau : waste title, quantity
            collectWastes.push({title: wastePoints.rows[0].title, quantity: quantity.quantity});
        })

        const updateVolunteer = await db.query(updateVolunteerPointsQuery, [totalPoints, volunteerId]);

        
        const returnDatas = [
            {
                date: collectionDate,
                cityName: cityName,
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
        res.sendStatus(500);
    }
})

module.exports = router;