class Department {
    constructor(conn) {
        this.conn = conn;
    }
    getInfo(callback) {
        const data = this.conn.query("select * from departments;", callback);
        console.table(data);
    }
    add() {

    }
    update() {

    }
}

module.exports = Department;
