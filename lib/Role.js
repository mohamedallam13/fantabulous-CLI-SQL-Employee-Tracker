const inquirer = require("inquirer");
const Department = require("./Department");

class Role {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select roles.title AS role_title, roles.salary, departments.name AS department_name
        FROM departments JOIN roles ON roles.department_id = departments.id JOIN employees ON employees.role_id = roles.id`;
        this.addQuery = `insert into roles (title,salary,department_id) values (?,?,?)`;
        this.addQuestions = [
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?"
            }
        ]
        this.deleteQuestions = [
            {
                type: "confirm",
                name: "confirm_delete",
                message: `Are you sure you want to delete role?`
            }
        ]
        this.deleteQuery = `delete from roles where title = ?`
    }

    getInfo(query) {
        query = query || this.getInfoQuery;
        return { promise: this.conn.promise().query(query) };
    }

    async getRoleTitlesIdsList() {
        const [roleRows] = await this.getInfo("select * from roles").promise;
        const roleTitlesIdsObj = roleRows.reduce((obj, roleRow) => {
            return {
                ...obj,
                [roleRow.title]: roleRow.id
            }
        }, {});
        return roleTitlesIdsObj
    }

    async add() {
        const department = new Department(this.conn);
        const departmentNameIdsObj = await department.getDepartmentTitlesIdsList();
        const departmentsQuestion = {
            type: "list",
            name: "departmentName",
            message: "Which department?",
            choices: Object.keys(departmentNameIdsObj)
        }
        this.addQuestions.push(departmentsQuestion)
        const responses = await inquirer.prompt(this.addQuestions);
        const { title, salary, departmentName } = responses;
        console.log(departmentNameIdsObj)
        return { promise: this.conn.promise().query(this.addQuery, [title, salary, departmentNameIdsObj[departmentName]]), message: `${title} role has been added!` }
    }

    async delete() {
        const roleTitlesIdsObj = await this.getRoleTitlesIdsList();
        const roleTitleQuestion = {
            type: "list",
            name: "roleTitle",
            message: "Which role do you want to delete?",
            choices: Object.keys(roleTitlesIdsObj)
        }
        this.deleteQuestions.unshift(roleTitleQuestion);
        const responses = await inquirer.prompt(this.deleteQuestions);
        const { roleTitle, confirm_delete } = responses;
        if (!confirm_delete) return;
        return { promise: this.conn.promise().query(this.deleteQuery, [roleTitle]), message: `${roleTitle} role has been deleted!` }

    }
}

module.exports = Role;