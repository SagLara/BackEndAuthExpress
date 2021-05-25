const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/', async(req, res) => {
    /* fetch('https://swapi.dev/api/people/1')
        .then(response => response.json())
        .then(json => res.json(json))
        .catch(e => console.log(e)); */
    try {
        const resp = await fetch('https://swapi.dev/api/people/1');
        const datos = await resp.json();
        res.json(datos);
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;