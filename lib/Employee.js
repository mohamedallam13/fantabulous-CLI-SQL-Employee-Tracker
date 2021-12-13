class Employee {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = `select * from employees`;
    }
    getInfo(queryCallBack, params = {}) {
        if (params.limit) {
            this.getInfoQuery = this.getInfoQuery + `limit to ${params.limit}`;
        }
        this.conn.query(this.getInfoQuery, queryCallBack);
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

module.exports = Employee;
