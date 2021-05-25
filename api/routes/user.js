const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection/conexion');
const middle = require('./middle');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    mysqlConnection.query('select * from usuario', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/test', middle.verifyToken, (req, res) => {
    console.log(req.data);
    if (req.data.ID_ROL === 'user') {
        res.json(`Bienvenido Usuario: ${req.data.NOMBRE_USUARIO}`);
    } else if (req.data.ID_ROL === 'admin') {
        res.json(`Bienvenido Señor Administrador: ${req.data.NOMBRE_USUARIO}`);
    }
    //res.json('Información secreta');
});


module.exports = router;