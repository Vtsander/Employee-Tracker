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
      db.query(`INSERT INTO department (name) VALUES ("${res.depName}")`,
      function (err, res) {
        if (err) {
          console.error(err);
        } else {
          console.log('Department added successfully!');
          init();
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
};

  const roleQuery = async (data) => {
    try {
      const department = await db.promise().query(`SELECT * FROM department`);
      const departmentNames = department[0].map(dept => dept.name);
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
          choices: departmentNames
        }
      ]);
      
      const selectedDepartment = department[0].find(dept => dept.name === userInput.depRole);
  
      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${userInput.roleName}", "${userInput.salary}", ${selectedDepartment.id})`,
        function (err, res) {
          if (err) {
            console.error(err);
          } else {
            console.log('Role added successfully!');
            init();
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const employQuery = async (employeeList, roleList) => {
    try {
      const employee = await db.promise().query(`SELECT * FROM employee`);
      const managerNames = employee[0].map(employee => employee.first_name + employee.last_name);
      managerNames.push("");
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
          choices: roleList.map(role => role.title),
        },
        {
          type: "list",
          name: "managerId",
          message: "Who is the employee's manager?",
          choices: employeeList.map(employee => employee.first_name + employee.last_name),
        },
      ]);
  
      const selectedEmployee = roleList.find(role => role.title === employeeInfo.roleId);

      const selectedManager = employeeList.find(employee => employee.first_name + employee.last_name === employeeInfo.managerId);

      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employeeInfo.firstName}", "${employeeInfo.lastName}", ${selectedEmployee.id}, ${selectedManager.id})`,
        function (err, res) {
          if (err) {
            console.error(err);
          } else {
            console.log('Employee added successfully!');
            init();
          }       
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const updateQuery = async (employees, roles) => {
    try {
      const userUpdate = await iq.prompt([
        {
          type: "list",
          name: "updateEmploy",
          message: "Which employee would you like to have updated?",
          choices: employees.map(
            (employee) => employee.first_name + employee.last_name
          ),
        },
        {
          type: "list",
          name: "updateRole",
          message: "What is the new role of this employee?",
          choices: roles.map((role) => role.title),
        },
      ]);
  
      const selectedUpdateEmp = employees.find(
        (employee) =>
          employee.first_name + employee.last_name === userUpdate.updateEmploy
      );
  
      const selectedUpdateRole = roles.find(
        (role) => role.title === userUpdate.updateRole
      );
  
      db.query(
        `UPDATE employee SET role_id = ${selectedUpdateRole.id} WHERE id = ${selectedUpdateEmp.id}`,
        function (err, res) {
          if (err) {
            console.error(err);
          } else {
            console.log("Employee updated successfully!");
            init();
          }
        }
      );
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
        db.query('SELECT * FROM employee', function (err, employees){
            db.query('SELECT * FROM role', function (err, roles){
                employQuery(employees, roles);
            });
        });
    }
    if (res.initAction === 'Update an employee role'){
      db.query('SELECT * FROM employee', function (err, employees){
        db.query('SELECT * FROM role', function (err, roles){
            updateQuery(employees, roles);
        });
    });
    }
    if (res.initAction === 'Exit application'){
        process.exit(0);
    }
    return
}
init();