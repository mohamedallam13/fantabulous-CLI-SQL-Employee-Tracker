const inquirer = require("inquirer");
class Department {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select * from departments`;
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
                type: "input",
                name: "department_name",
                message: "What is the name of the department?",
            }
        ]
    }
    getInfo() {
        return { promise: this.conn.promise().query(this.getInfoQuery) };
    }
    async add() {
        const responses = await inquirer.prompt(this.addQuestions);
        const { department_name } = responses;
        return { promise: this.conn.promise().query(this.addQuery, [department_name]), message: `${department_name} has been added!` }
    }
    async delete() {
        const responses = await inquirer.prompt(this.deleteQuestions);
        const { department_name } = responses;
        return { promise: this.conn.promise().query(this.deleteQuery, [department_name]), message: `${department_name} has been deleted!` }
    }
    update() {

    }
}

module.exports = Department;
