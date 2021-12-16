const inquirer = require("inquirer");
const Department = require("./Department");
const Role = require("./Role");

class Employee {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select employees.first_name, employees.last_name, roles.title AS role_title, employees.manager_id
        FROM departments JOIN roles ON roles.department_id = departments.id JOIN employees ON employees.role_id = roles.id`;
        this.addQuery = `insert into employees (first_name,last_name,role_id,manager_id) values (?,?,?,?)`;
        this.addQuestions = [
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            }
        ]
        this.updateRoleQuestions = [];
        this.updateRoleQuery = `UPDATE employees SET role_id = ? WHERE id = ?`
        this.updateManagerQuestions = [];
        this.udpateManagerQuery = `UPDATE employees SET manager_id = ? WHERE id = ?`
        this.deleteQuestions = [
            {
                type: "confirm",
                name: "confirm_delete",
                message: `Are you sure you want to delete employee?`
            }
        ]
        this.deleteQuery = `delete from employees where id = ?`
        this.employeesByManagerQuestions = [];
        this.getByManagerQuery = `SELECT * from employees where manager_id = ?`
        this.employeesByDepartmentQuery = `select RTRIM(LTRIM(
            CONCAT(
                employees.first_name, 
                ' '
                ,employees.last_name
            )
        )) AS full_name, name AS department_name, title AS role_title
        FROM departments JOIN roles ON roles.department_id = departments.id JOIN employees ON employees.role_id = roles.id
        WHERE departments.name = ?`
        this.employeesByDeprmentQuestions = [];
    }
    async getEmployeesNameIdsList() {
        const [currentEmployeesRows] = await this.getInfo("select * from employees").promise;
        const employeeNamesIdsObj = currentEmployeesRows.reduce((obj, employee) => {
            return {
                ...obj,
                [`${employee.first_name} ${employee.last_name}`]: employee.id
            }
        }, {});
        return employeeNamesIdsObj
    }
    getInfo(query) {
        query = query || this.getInfoQuery;
        return { promise: this.conn.promise().query(query) };
    }

    async getEmployeesByDeparment() {
        const department = new Department(this.conn);
        const departmentsByIdObj = await department.getDepartmentTitlesIdsList();
        console.log(departmentsByIdObj)
        const departmentsQuestion = {
            type: "list",
            name: "departmentName",
            message: "Select Department:",
            choices: Object.keys(departmentsByIdObj)
        }

        this.employeesByDeprmentQuestions.push(departmentsQuestion);
        const responses = await inquirer.prompt(this.employeesByDeprmentQuestions);
        const { departmentName } = responses;
        return { promise: this.conn.promise().query(this.employeesByDepartmentQuery, [departmentName]) };
    }

    async getEmployeesByManager() {
        const employeeNamesIdsObj = await this.getEmployeesNameIdsList();
        const managerQuestion = {
            type: "list",
            name: "managerName",
            message: "Select Employee:",
            choices: Object.keys(employeeNamesIdsObj)
        }
        this.employeesByManagerQuestions.push(managerQuestion);
        const responses = await inquirer.prompt(this.employeesByManagerQuestions);
        const { managerName } = responses;
        const id = employeeNamesIdsObj[managerName];
        return { promise: this.conn.promise().query(this.getByManagerQuery, [id]) };
    }

    async add() {
        const role = new Role(this.conn);
        const roleTitlesIdsObj = await role.getRoleTitlesIdsList();
        const employeeNamesIdsObj = await this.getEmployeesNameIdsList();
        const roleTitleQuestion = {
            type: "list",
            name: "roleTitle",
            message: "What's the employees's role?",
            choices: Object.keys(roleTitlesIdsObj)
        }
        const managerQuestion = {
            type: "list",
            name: "managerName",
            message: "Who's the employees's manager?",
            choices: Object.keys(employeeNamesIdsObj)
        }
        this.addQuestions.push(roleTitleQuestion, managerQuestion)
        const responses = await inquirer.prompt(this.addQuestions);
        const { first_name, last_name, roleTitle, managerName } = responses;

        return { promise: this.conn.promise().query(this.addQuery, [first_name, last_name, roleTitlesIdsObj[roleTitle], employeeNamesIdsObj[managerName]]), message: `${roleTitle} has been added!` }
    }
    async updateRole() {
        const role = new Role(this.conn);
        const employeeNamesIdsObj = await this.getEmployeesNameIdsList();
        const roleTitlesIdsObj = await role.getRoleTitlesIdsList();
        const employeeQuestion = {
            type: "list",
            name: "full_name",
            message: "Which employee's role do you want to update?",
            choices: Object.keys(employeeNamesIdsObj)
        }
        const roleTitleQuestion = {
            type: "list",
            name: "role_title",
            message: "´Ẃhich role do you want to assign the selected employee?",
            choices: Object.keys(roleTitlesIdsObj)
        }
        this.updateRoleQuestions.push(employeeQuestion, roleTitleQuestion)
        const responses = await inquirer.prompt(this.updateRoleQuestions);
        const { full_name, role_title } = responses;
        return { promise: this.conn.promise().query(this.updateRoleQuery, [roleTitlesIdsObj[role_title], employeeNamesIdsObj[full_name]]), message: `${full_name}'s role has been updated!` }
    }
    async updateManager() {
        const employeeNamesIdsObj = await this.getEmployeesNameIdsList();
        const employeeQuestion = {
            type: "list",
            name: "employeeName",
            message: "Which employee's manager do you want to update?",
            choices: Object.keys(employeeNamesIdsObj)
        }
        const managerQuestion = {
            type: "list",
            name: "managerName",
            message: "Who's the employees's new manager?",
            choices: Object.keys(employeeNamesIdsObj)
        }
        this.updateManagerQuestions.push(employeeQuestion, managerQuestion)
        const responses = await inquirer.prompt(this.updateManagerQuestions);
        const { employeeName, managerName } = responses;
        return { promise: this.conn.promise().query(this.udpateManagerQuery, [employeeNamesIdsObj[managerName], employeeNamesIdsObj[employeeName]]), message: `${employeeName}'s manager has been updated!` }
    }
    async delete() {
        const employeeNamesIdsObj = await this.getEmployeesNameIdsList();
        const employeeQuestion = {
            type: "list",
            name: "employeeName",
            message: "Which employee do you want to delete?",
            choices: Object.keys(employeeNamesIdsObj)
        }
        this.deleteQuestions.unshift(employeeQuestion);
        const responses = await inquirer.prompt(this.deleteQuestions);
        const { employeeName, confirm_delete } = responses;
        if (!confirm_delete) return;
        return { promise: this.conn.promise().query(this.deleteQuery, employeeNamesIdsObj[employeeName]), message: `${employeeName} has been deleted!` }
    }

}

module.exports = Employee;
