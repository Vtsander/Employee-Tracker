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
  
  const departmentPrompt = {
    type: "input",
    name: "depName",
    message: "What is the name of the department?",
  };
  
  const deptQuery = async () => {
    try {
      const res = await iq.prompt(departmentPrompt);
      await db.query(`INSERT INTO department (name) VALUES ("${res.depName}")`);
      init();
    } catch (error) {
      console.error(error);
    }
  };

  const roleQuery = async (data) => {
    try {
      const userInput = await iq.prompt([
        { 
          type: "input", 
          name: "roleName", 
          message: "What is the name of the role?" 
        },
        { 
          type: "number", 
          name: "salary", 
          message: "What is the salary for this role?" 
        },
        { 
          type: "list", 
          name: "depRole", 
          message: "What department does this role belong to?",
          choices: data
        }
      ]);
      
      const selectedDepartment = data.find(department => department.name === userInput.depRole);
      
      await db.query(
        `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
        [userInput.roleName, userInput.salary, selectedDepartment.id]
      );
  
      init();
    } catch (error) {
      console.error(error);
    }
  }
  
  
  const init = async() => {
    const res = await iq.prompt(initPrompt)
    if (res.initAction === 'View all departments'){
        db.query('SELECT * FROM department', function (err, results){
            console.table(results)
            init();
        })
    }  
    if (res.initAction === 'Add a department'){
        deptQuery();
    }
    if (res.initAction === 'View all roles'){
        db.query('SELECT * FROM role', function (err, results){
            console.table(results)
            init();
        })
    }
    if (res.initAction === 'Add a role'){
        roleQuery();
    }
    return
}
init();