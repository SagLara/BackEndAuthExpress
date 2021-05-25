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
app.use('/login', middleRoute.router);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);

module.exports = app;