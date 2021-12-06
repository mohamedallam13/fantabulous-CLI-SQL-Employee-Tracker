const { builtinModules } = require("module");

class Employee {
    constructor(conn) {
        this.conn = conn;
    }
    getInfo(callback, params) {
        this.conn.query(`select * from Employees ${params.limit? 'limit ' + params.limit : ''};`, callback);
    }
    add() {

    }
    update() {

    }
}

module.exports = Employee;
