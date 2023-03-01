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

const empQuery = async(data, data2) => {
  const res = await iq.prompt([{
      type: "input",
      name: "empfName",
      message: "What is the employee's first name?"
  },{
      type: "input",
      name: "emplName",
      message: "What is the employee's last name?" 
  },{
      type: "list",
      name: "empRole",
      message: "What is the employee's role?",
      choices: data2
      
  },{
      type: "list",
      name: "empMan",
      message: "Who is the employee's manager?",
      choices: data
  }])

  var hasManager = data.find(element => {
      return element.name === res.empMan
  })

  var hasRole = data2.find(el => {
      return el.name === res.empRole
  })
  db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.empfName}", "${res.emplName}", ${hasRole.id}, ${hasManager.id})`, function (err, res) {
      init()
  })
}

const updateQuery = async (data, data2) => {

 const res = await iq.prompt([{
      type: 'list',
      name: 'updateEmp',
      message: 'Which employee would you like to update?',
      choices: data
  },{
    type: 'list',
    name:'updateEmpRole',
    message: "What is the employee's new role?",
    choices: data2
    
  }])

  const empEl = data.find(el => {
      return el.name === res.updateEmp 
  })

  const empElID = empEl.id

  const roleEl = data2.find(el => {
      return el.name === res.updateEmpRole
  })

  const roleElID = roleEl.id

  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
  const params = [roleElID, empElID]
  db.query(sql, params, (err, result) => {
      if (err) {
          console.error(err)
      } else {
          init();
      }
  })

 
}

init();