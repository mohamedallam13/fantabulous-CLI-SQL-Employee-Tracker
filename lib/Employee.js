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
    add() {

    }
    update() {

    }
}

module.exports = Employee;
