const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const middle = require('./middle');
const mysqlConnection = require('../connection/conexion');

router.get('/public', middle.verifyToken, async(req, res) => {
    /* fetch('https://swapi.dev/api/people/1')
        .then(response => response.json())
        .then(json => res.json(json))
        .catch(e => console.log(e)); */
    try {
        const resp = await fetch('https://pokeapi.co/api/v2/pokemon/658');
        const datos = await resp.json();
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json(null);
    }

});

router.get('/', middle.verifyToken, (req, res) => {
    const { NOMBRE_USUARIO, ID_ROL } = req.data;
    mysqlConnection.query('select NOMBRE_USUARIO,ID_ROL from usuario WHERE NOMBRE_USUARIO=?', [NOMBRE_USUARIO], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
            res.json(null);
        }
    });
});


module.exports = router;