const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const mysqlConnection = require('../connection/conexion');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send("Login");
});

router.get('/registro', (req, res) => {
    res.send("registro");
});

router.post('/registro', async(req, res) => {
    const { userName, pass, passVerify } = req.body;
    if (pass != passVerify) {
        res.json('Las claves no corresponden');
    } else {
        try {
            // Hash password
            const passHash = await bcrypt.hashSync(pass, 8);
            console.log(passHash);
            const rol = "user";

            //Para evitar inyeccion SQL
            mysqlConnection.query('INSERT INTO usuario (NOMBRE_USUARIO,PASSWORD,ID_ROL) VALUES (?,?,?)', [userName, passHash, rol],
                (err, result) => {
                    if (!err) {
                        res.json("Se creo nuevo usuario");
                    } else {
                        console.log(err);
                    }
                }
            );
        } catch (error) {
            console.log(error);
        }

    }

});

router.post('/', (req, res) => {
    const { userName, pass } = req.body;
    //Para evitar inyeccion SQL
    mysqlConnection.query('SELECT * FROM usuario WHERE NOMBRE_USUARIO=?', [userName],
        (err, rows, fields) => {
            if (!err) {
                if (rows.length > 0) {
                    try {
                        // Compare password
                        const hash = rows[0].PASSWORD;
                        let validHash = bcrypt.compareSync(pass, hash);
                        console.log(validHash);
                        if (!validHash) {
                            res.json('Usuario o clave incorrectos');
                        } else {
                            if (rows.length > 0) {
                                let data = JSON.stringify(rows[0]);
                                const token = jwt.sign(data, process.env.SECRET_WORD);
                                res.json({ token });
                            } else {
                                res.json('Usuario o clave incorrectos');
                            }
                        }

                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    res.json('Usuario o clave no existen');
                }
            } else {
                console.log(err);
            }
        }
    );
});

//Función Middleware

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json('No autorizado');
    }
    const token = req.headers.authorization.substr(7);
    if (token !== '') {
        try {
            const contenido = jwt.verify(token, process.env.SECRET_WORD);
            req.data = contenido;
            next();
        } catch {
            return res.status(401).json('Token no valido');
        }
    } else {
        return res.status(401).json('Token vacio');
    }
}


module.exports = {
    router,
    verifyToken,
};