// get the client
const mysql = require('mysql');

// create the connection to database, pool 10 connections
const pool = mysql.createPool({
    connectionLimit: 25,
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: 'vertrigo',
    database: 'hmcontrol'
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('DB Conectada');
    }
});

pool.query('SELECT * FROM rackStatus', (err, result, fields) => {
    if (err) {
        throw new Error(err);
    } else {
        console.log('DB Conectada!')
    }
})


module.exports = pool;