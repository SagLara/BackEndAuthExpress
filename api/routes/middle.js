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
    const { userName, pass, validpass } = req.body;
    if (pass != validpass) {
        res.json('Las claves no corresponden');
    } else {
        try {
            // Hash password
            const passHash = await bcrypt.hashSync(pass, 8);
            const rol = "user";

            //Para evitar inyeccion SQL
            mysqlConnection.query('INSERT INTO usuario (NOMBRE_USUARIO,PASSWORD,ID_ROL) VALUES (?,?,?)', [userName, passHash, rol],
                (err, result) => {
                    if (!err) {
                        res.json("Se creo nuevo usuario, ID: " + result.insertId);
                    } else {
                        if (err.code == 'ER_DUP_ENTRY') {
                            res.json(false);
                        } else {
                            res.json(null);
                        }

                    }
                }
            );
        } catch (error) {
            console.log(error);
            res.json(null);
        }

    }

});

router.post('/', (req, res) => {
    const { userName, pass } = req.body;
    //Para evitar inyeccion SQL
    mysqlConnection.query('SELECT NOMBRE_USUARIO,PASSWORD,ID_ROL FROM usuario WHERE NOMBRE_USUARIO=?', [userName],
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
                                let data = rows[0];
                                const token = jwt.sign({ data }, process.env.SECRET_WORD, { algorithm: 'HS512', expiresIn: "300s" });
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
            req.data = contenido.data;
            next();
        } catch {
            return res.status(401).json('Token no valido');
        }
    } else {
        return res.status(401).json('Token vacio');
    }
}

function verifyAdmin(req, res, next) {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
        return res.status(401).json('No autorizado');
    }
    const token = req.headers.authorization.substr(7);
    if (token !== '') {
        try {
            const contenido = jwt.verify(token, process.env.SECRET_WORD);
            req.data = contenido.data;
            if (contenido.data.ID_ROL == 'admin') {
                console.log("Es admin");
                next();
            } else {
                return res.status(401).json('Usuario no es administrador');
            }

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
    verifyAdmin,
};