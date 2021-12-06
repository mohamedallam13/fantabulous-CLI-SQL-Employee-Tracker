class Employee {
    constructor(conn) {
        this.conn = conn;
    }
    getInfo(callback, params = {}) {
        const sql = `select * from employees${params.limit ? ' limit ' + params.limit : ''};`
        console.log(sql)
        const result = this.conn.query(sql, callback);
        console.log(result.affectedRows);
        console.table(result.affectedRows);
    }
    add() {

    }
    update() {

    }
}

module.exports = Employee;
