const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

//capturar datos en json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// routes
const middleRoute = require('./api/routes/middle');
const userRoute = require('./api/routes/user');
const resourceRoute = require('./api/routes/resource');
const clienteRoute = require('./api/routes/cliente');
const productoRoute = require('./api/routes/producto');
const informeRoute = require('./api/routes/informes');
app.use('/login', middleRoute.router);
app.use('/user', userRoute);
app.use('/clientes', clienteRoute);
app.use('/productos', productoRoute);
app.use('/informes', informeRoute);
app.use('/home', resourceRoute);

module.exports = app;