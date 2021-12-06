const mysql = require("mysql2");
class Department {
    constructor(conn) {
        this.conn = conn;
        this.getInfoQuery = "select * from departments";
    }
    getInfo(runMainMenu) {
        // console.log(this.conn);
        const callBack = (err, results) => {
            if (err) {
                console.log(err)
                return;
            }
            console.table(results);
            runMainMenu();
        }
        
        this.conn.query(this.getInfoQuery, callBack);

    }
    add() {

    }
    update() {

    }
}

module.exports = Department;
