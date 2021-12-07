const inquirer = require("inquirer");
class Department {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select * from departments`;
        this.addQuery = `insert into departments (name) values (?)`;
        this.addQuestions = [
            {
                type: "input",
                name: "department_name",
                message: "What is the name of the department?",
            }
        ]
    }
    getInfo(queryCallBack) {
        this.conn.query(this.getInfoQuery, queryCallBack);
    }
    add(queryCallBack) {
        inquirer.prompt(this.addQuestions)
            .then(responses => {
                const { department_name } = responses;
                this.conn.query(this.addQuery, [department_name], (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${department_name} added!`);
                    }
                    this.getInfo(queryCallBack);
                });
            })
    }
    update() {

    }
}

module.exports = Department;
