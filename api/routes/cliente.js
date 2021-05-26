const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection/conexion');
const middle = require('./middle');

const jwt = require('jsonwebtoken');

router.get('/', middle.verifyToken, (req, res) => {
    const { NOMBRE_USUARIO, ID_ROL } = req.data;

    mysqlConnection.query('select * from cliente', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
    //res.json('Información secreta');
});

module.exports = router;