const inquirer = require("inquirer");
const Department = require("./lib/Department");

class Role {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select * from roles`;
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
            },
            
        ]
    }

    getInfo(callback) {
        this.conn.query(this.getInfoQuery, callback);
    }
    add() {
        const data = this.conn.query("select title from departments;", (err, data) => {
            if (err) {
                console.log(err)
                return;
            }
            return data;
        });

    }
    update() {

    }
}

module.exports = Role;