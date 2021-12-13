const inquirer = require("inquirer");
const Role = require("./Role");

class Employee {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select * from employees`;
        this.addQuery = `insert into roles (first_name,last_name,role_id,manager_id) values (?,?,?,?)`;
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
    }
    getInfo(queryCallBack, params = {}) {
        if (params.limit) {
            this.getInfoQuery = this.getInfoQuery + `limit to ${params.limit}`;
        }
        this.conn.query(this.getInfoQuery, queryCallBack);
    }
    async add() {
        const role = new Roles(this.conn);
        const [rows] = await role.getInfo();
        const roleTitles = rows.map(row => row.name);
        const roleTitleQuestion = {
            type: "list",
            name: "roleTitle",
            message: "What's the employees's role?",
            choices: roleTitles
        }
        this.addQuestions.push(roleTitleQuestion)
        const responses = await inquirer.prompt(this.addQuestions);
        const { first_name, last_name, roleTitle } = responses;
        const role_id = rows.filter(row=> row.name == roleTitle)[0].id;
        return { promise: this.conn.promise().query(this.addQuery, [first_name, last_name, role_id,1]),  message: `${title} has been added!`  }
    }
    update() {

    }
}

module.exports = Employee;
