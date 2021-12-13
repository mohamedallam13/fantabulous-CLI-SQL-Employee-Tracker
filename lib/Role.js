const inquirer = require("inquirer");
const Department = require("./Department");

class Role {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select * from roles`;
        this.addQuery = `insert into departments (title,salary,department_id) values (?,?,?)`;
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
    }

    getInfo() {
        return { promise: this.conn.promise().query(this.getInfoQuery) };
    }
    async add() {
        const department = new Department(this.conn);
        const [rows] = await department.getInfo();
        const departmentNames = rows.map(row => row.name);
        const departmentsQuestion = {
            type: "list",
            name: "departmentName",
            message: "Which department?",
            choices: departmentNames
        }
        this.addQuestions.push(departmentsQuestion)
        const responses = await inquirer.prompt(this.addQuestions);
        const { title, salary, departmentName } = responses;
        const department_id = rows.filter(row=> row.name == departmentName)[0];
        return { promise: this.conn.promise().query(this.addQuery, [title, salary, department_id]),  message: `${title} has been added!`  }
    }
    update() {

    }
}

module.exports = Role;