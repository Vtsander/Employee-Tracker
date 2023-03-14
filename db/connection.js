const mysql = require('mysql2/promise');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    });
    console.log('Connected to the employees_db database')
    return connection
}

module.exports = getConnection;
