const express = require('express');
const router = express.Router();

const mysqlConnection = require('../connection/conexion');
const middle = require('./middle');

const jwt = require('jsonwebtoken');

router.get('/', middle.verifyToken, (req, res) => {
    const { NOMBRE_USUARIO, ID_ROL } = req.data;

    mysqlConnection.query('select * from producto', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
    //res.json('Información secreta');
});

router.get('/:id', middle.verifyToken, middle.verifyAdmin, (req, res) => {
    const { id } = req.params;
    console.log(id);
    mysqlConnection.query('select * from producto where ID_PRODUCTO=?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
            res.json(null);
        }
    });
    //res.json('Información secreta');
});


router.put('/update', middle.verifyToken, middle.verifyAdmin, (req, res) => {
    const { ID_PRODUCTO, NOMBRE, PRECIO, STOCK } = req.body;

    mysqlConnection.query('UPDATE producto SET NOMBRE=?,PRECIO=?,STOCK=? WHERE ID_PRODUCTO=?', [NOMBRE, PRECIO, STOCK, ID_PRODUCTO],
        (err, result) => {
            if (!err) {
                console.log(result.insertId);
                res.json("Se actualizo el producto, ID: " + result.insertId);
            } else {
                console.log(err);
                res.json(null);
            }
        });
    //res.json('Información secreta');
});

router.get('/delete/:id', middle.verifyToken, middle.verifyAdmin, (req, res) => {
    const { id } = req.params;
    console.log(id);
    mysqlConnection.query('DELETE FROM producto WHERE ID_PRODUCTO=?', [id], (err, result) => {
        if (!err) {
            console.log(result.insertId);
            res.json("Borrado");
        } else {
            console.log(err);
            res.json("error");
        }
    });
    //res.json('Información secreta');
});

router.post('/add', middle.verifyToken, middle.verifyAdmin, (req, res) => {
    const { NOMBRE, PRECIO, STOCK } = req.body;
    console.log(req.body);

    mysqlConnection.query('INSERT INTO producto (NOMBRE,PRECIO,STOCK) VALUES (?,?,?)', [NOMBRE, PRECIO, STOCK],
        (err, result) => {
            if (!err) {
                res.json("Se creo nuevo producto, ID: " + result.insertId);
            } else {
                if (err.code == 'ER_DUP_ENTRY') {
                    res.json(false);
                } else {
                    res.json("error");
                }

            }
        });
    //res.json('Información secreta');
});

module.exports = router;