class Role {
    constructor(conn) {
        this.conn = conn;
    }
    getInfo(callback) {
        this.conn.query("select * from roles;", callback);
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
