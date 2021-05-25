const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

mysqlConnection.connect(err => {
    if (err) {
        console.log("Error en db: ", err);
    } else {
        console.log("Db conectada");
    }
});

module.exports = mysqlConnection;