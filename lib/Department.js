class Department {
    constructor(conn) {
        this.conn = conn;
    }
    getInfo(callback) {
        const data = this.conn.query("select * from departments;", callback);
        console.log("2")
        console.log(data);
        // console.table(data);
    }
    add() {

    }
    update() {

    }
}

module.exports = Department;
