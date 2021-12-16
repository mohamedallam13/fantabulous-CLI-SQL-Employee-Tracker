const inquirer = require("inquirer");
class Department {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery =  `select * from departments`;
        this.addQuery = `insert into departments (name) values (?)`;
        this.deleteQuery = `delete from departments where name = ?`;
        this.addQuestions = [
            {
                type: "input",
                name: "department_name",
                message: "What is the name of the department?",
            }
        ],
        this.deleteQuestions = [
            {
                type: "confirm",
                name: "confirm_delete",
                message: `Are you sure you want to delete department?`
            }
        ]
        this.getBudgetsByDepartment = `select departments.name AS department_name, SUM(roles.salary) AS total_salaries
        FROM departments JOIN roles ON roles.department_id = departments.id JOIN employees ON employees.role_id = roles.id
        GROUP BY departments.name
        `
    }
    getInfo(query) {
        query = query || this.getInfoQuery;
        return { promise: this.conn.promise().query(query) };
    }

    getSalariesByDepartment(){
        return { promise: this.conn.promise().query(this.getBudgetsByDepartment) };
    }

    async getDepartmentTitlesIdsList() {
        const [departmentrRows] = await this.getInfo().promise;
        const departmentNameIdsObj = departmentrRows.reduce((obj, departmentRow) => {
            return {
                ...obj,
                [departmentRow.name]: departmentRow.id            }
        }, {});
        return departmentNameIdsObj
    }
    async add() {
        const responses = await inquirer.prompt(this.addQuestions);
        const { department_name } = responses;
        return { promise: this.conn.promise().query(this.addQuery, [department_name]), message: `${department_name} department has been added!` }
    }
    async delete() {
        const departmentNameIdsObj = await this.getDepartmentTitlesIdsList();
        console.log(departmentNameIdsObj)
        const departmentsQuestion = {
            type: "list",
            name: "departmentName",
            message: "Which departmen do you want to delete?",
            choices: Object.keys(departmentNameIdsObj)
        }
        this.deleteQuestions.unshift(departmentsQuestion)
        const responses = await inquirer.prompt(this.deleteQuestions);
        const { departmentName, confirm_delete } = responses;
        if(!confirm_delete) return
        return { promise: this.conn.promise().query(this.deleteQuery, [departmentName]), message: `${departmentName} department has been deleted!` }
    }
}

module.exports = Department;
