const iq = require('inquirer')
const mysql = require('mysql2');
const { exit } = require('process');
const pass = require('../../pass/pass')
const cTable = require('console.table')

const db = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: pass,
      database: 'employees_db'
  },
  console.log('Connected to the employees_db database')
);

const initPrompt = [{
  type: "list",
  name: "initAction",
  message: "what would you like to do?",
  choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit application']
}]

init();