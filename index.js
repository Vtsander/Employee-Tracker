const iq = require('inquirer')
const mysql = require('mysql2');
const { exit } = require('process');
const cTable = require('console.table')

const initPrompt = {
    type: "list",
    name: "initAction",
    message: "What would you like to do?",
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit application'
    ]
  };
  

  
init();