const inquirer = require('inquirer');
const mysql = require("mysql2");
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db database')  
);

const dbPromise = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
).promise();

// Main App Questions.
const actions = {
    viewAllEmployees: "View All Employees.",
    viewAllDepartments: "View All Departments.",
    viewAllRoles: "View All Roles.",
    addEmployee: "Add an Employee.",
    addRole: "Add a Role.",
    addDepartment: "Add a Department.",
    updateEmployeeRole: "Update an Employee's Role.",
    quit: "Quit."
}

// All fetching sql tables for choices. 
// Grabbing the roles
const roleChoices = async () => {
    const query = `SELECT id AS value, title as name FROM role;`;
    const roles = await dbPromise.query(query);
    return roles[0];
}

// Grabbing the employees
const employeeChoices = async () => {
    const query = `SELECT id AS value, CONCAT(employee.last_name, ', ', employee.first_name) AS name FROM employee;`;
    const employees = await dbPromise.query(query);
    employees[0].push({ value: 0, name: 'N/A'});
    return employees[0];
}

// Grabbing the department.
const departmentChoices = async () => {
    const query = `SELECT id AS value, depName as name FROM department;`;
    const departments = await dbPromise.query(query);
    return departments[0];
}

// All question sets
// Questions for adding employee.
const addEmployeeActions = [
    {
        type: 'input',
        name: 'fName',
        message: `Enter the employee's first name.`
    },
    {
        type: 'input',
        name: 'lName',
        message: `Enter the employee's last name.`
    },
    {
        type: 'list',
        name: 'roleID',
        message: 'Select the role this employee belongs to.',
        choices: roleChoices
    },
    {
        type: 'list',
        name: 'managerID',
        message: `Select this employee's Manager`,
        choices: employeeChoices
    }
]

// Questions for adding role.
const addRoleActions = [
    {
        type: 'input',
        name: 'title',
        message: `Enter the role's title.`
    },
    {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for this role.'
    },
    {
        type: 'list',
        name: 'department_id',
        message: 'Select the department this role belongs to.',
        choices: departmentChoices
    }
]

// Questions for adding department.
const addDepartmentActions = [
    {
        type: 'input',
        name: 'depName',
        message: `Enter the new department's name.`
    }
]

// Questions for updating role
const updateEmployeActions = [
    {
        type: 'list',
        name: 'employeeID',
        message: 'Select which employee you want to update',
        choices: employeeChoices
    },
    {
        type: 'list',
        name: 'newRole',
        message: 'Select which role you want to assign to the selected employee.',
        choices: roleChoices
    }
]

// Basis for functionality
function appQuestions() {
    inquirer
        .prompt({
            type: 'list',
            name: 'selected',
            message: 'What do you want to do?',
            choices: [
                actions.viewAllEmployees,
                actions.viewAllDepartments,
                actions.viewAllRoles,
                actions.addEmployee,
                actions.addRole,
                actions.addDepartment,
                actions.updateEmployeeRole,
                actions.quit
            ]
        })
        .then(answer => {
            switch (answer.selected) {
                case actions.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case actions.viewAllDepartments:
                    viewAllDepartments();
                    break;

                case actions.viewAllRoles:
                    viewAllRoles();
                    break;

                case actions.addEmployee:
                    addEmployee();
                    break;
                    
                case actions.addRole:
                    addRole();
                    break;
                    
                case actions.addDepartment:
                    addDepartment();
                    break;
                    
                case actions.updateEmployeeRole:
                    updateEmployeeRole();
                    break;
                    
                case actions.quit:
                    console.log('Goodbye!')
                    process.exit();
                    break;
            }
        });
}

appQuestions()

// Function for viewing all the employees
function viewAllEmployees() {
    const query = `SELECT employee.id as ID, CONCAT(employee.last_name, ', ', employee.first_name) AS 'Employee Name', role.title as Position, department.depName AS Department, role.salary AS Salary, IFNULL(CONCAT(manager.last_name, ', ', manager.first_name), 'N/A') AS Manager
    FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    JOIN role 
    ON employee.role_id = role.id
    JOIN department
    ON role.department_id = department.id;`;
    db.query(query, (err, res) => {
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        appQuestions();
    })
};

// Function for viewing all the departments
function viewAllDepartments() {
    const query = `SELECT department.id AS ID, department.depName AS Departments FROM department ORDER BY department.id`;
    db.query(query, (err, res) => {
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        appQuestions();
    })
};

// Function for viewing all the roles
function viewAllRoles() {
    const query = `SELECT role.id AS ID, role.title as 'Role Name', role.salary as Salary, department.depName AS Department
    FROM role
    JOIN department
    ON role.department_id = department.id
    ORDER BY role.id`;
    db.query(query, (err, res) => {
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        appQuestions();
    })
};

// Function for adding employee
function addEmployee() {
    inquirer
        .prompt(addEmployeeActions)
        .then((answers) => {
            const newEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("` + answers.fName + `", "` + answers.lName + `", ` + answers.roleID + `, ` + answers.managerID + `)`;
            db.query(newEmployee, (err, res) => {
                console.log(`\n`);
                console.log(`New employee added.`);
                console.log(`\n`);
                appQuestions();
            });
        });
};

// Function for adding role
function addRole() {
    inquirer
        .prompt(addRoleActions)
        .then((answers) => {
            const newRole = `INSERT INTO role (title, salary, department_id)
            VALUES ("` + answers.title + `", ` + answers.salary + `, ` + answers.department_id + ')';
            db.query(newRole, (err, res) => {
                console.log(`\n`);
                console.log(`New role added.`);
                console.log(`\n`);
                appQuestions();
            });
        });
};

// Function for adding department
function addDepartment() {
    inquirer
        .prompt(addDepartmentActions)
        .then((answers) => {
            const newDep = `INSERT INTO department (depName)
            VALUES ("` + answers.depName + `")`;
            db.query(newDep, (err, res) => {
                console.log(`\n`);
                console.log(`New department added.`);
                console.log(`\n`);
                appQuestions();
            });
        });
};

// Function for updating employee's role.
function updateEmployeeRole() {
    inquirer
        .prompt(updateEmployeActions)
        .then((answers) => {
            const updateRole = `UPDATE employee SET role_id = ` + answers.newRole + ` WHERE ID = ` + answers.employeeID
            db.query(updateRole, (err, res) => {
                console.log(`\n`);
                console.log(`Selected role updated.`);
                console.log(`\n`);
                appQuestions();
            });
        });
};