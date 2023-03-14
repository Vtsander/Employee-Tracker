const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

connection.connect();

const sql = 'SELECT * FROM mytable';

console.log(sql);

connection.query(sql, (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

connection.end();
