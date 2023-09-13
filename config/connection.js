const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'S0ngBird#13',
        database: 'employees_db'
    },
    console.log('Connected to employee database.')
);

module.exports = db;