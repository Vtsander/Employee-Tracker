const iq = require('inquirer')
const mysql = require('mysql2');
const { exit } = require('process');
const cTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connecting to employees_db database')
);

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
  
  const departPrompt = {
    type: "input",
    name: "depName",
    message: "What is the name of the department?",
  };
  
  const departQuery = async () => {
    try {
      const res = await iq.prompt(departPrompt);
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
  
  const employQuery = async (employeeList, roleList) => {
    try {
      const employeeInfo = await iq.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleList.map(role => role.name),
        },
        {
          type: "list",
          name: "managerId",
          message: "Who is the employee's manager?",
          choices: employeeList.map(manager => manager.name),
        },
      ]);
      
      const selectedManager = employeeList.find(manager => manager.name === employeeInfo.managerId);
      
      const selectedRole = roleList.find(role => role.name === employeeInfo.roleId);
      
      const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employeeInfo.firstName}", "${employeeInfo.lastName}", ${selectedRole.id}, ${selectedManager.id})`;
      
      await db.query(query);
      
      init();
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const init = async() => {
    const res = await iq.prompt(initPrompt)
    if (res.initAction === 'View all departments'){
        db.query('SELECT * FROM department', function (err, results){
            console.table(results)
            init();
        })
    }  
    if (res.initAction === 'Add a department'){
        departQuery();
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
    if (res.initAction === 'View all employees'){
        db.query('SELECT * FROM employee', function (err, results){
            console.table(results)
            init();
        })
    }
    if (res.initAction === 'Add an employee'){
        employQuery();
    }
    if (res.initAction === 'Exit Application'){
        return exit()
    }
    return
}
init();