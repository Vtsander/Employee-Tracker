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

const departmentPrompt = [{
  type: "input",
  name: "depName",
  message: "What is the name of the department?",
}]

const deptQuery = async() => {
  const res = await iq.prompt(departmentPrompt)
  db.query(`INSERT INTO department (name) VALUES ("${res.depName}")`)
  init();
  
}

const roleQuery = async(data) => {
  const res = await iq.prompt([{
      type: "input",
      name: "roleName",
      message: "What is the name of the role?"
  },{
      type: "number",
      name: "salary",
      message: "What is the salary for this role?"
  },{
      type: "list",
      name: "depRole",
      choices: data
  }])

  var roleID = data.find(element => {
      return element.name === res.depRole
  })
  db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${res.roleName}", "${res.salary}", ${roleID.id})`, function (err, res) {
      init()
  })
}

init();