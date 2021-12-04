const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

const CREDENTIALS_JSON_PATH = './dbcredentials.json';

const connect = () => {
    var savedCredentials = getSavedCredentials();
    if (!savedCredentials) {
        return promptUserForUserNamePassword();
    } else {
        return connectToSQL(user, password);
    }
}

const getSavedCredentials = () => {
    const credentialsString = fs.readFile(CREDENTIALS_JSON_PATH, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        return JSON.parse(credentialsString);
    })
}

const promptUserForUserNamePassword = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "user",
                message: "User:"
            },
            {
                type: "password",
                name: "password",
                message: "Password:"
            }
        ])
        .then((responses) => {
            const { user, password } = responses;
            if (!user || !password) {
                console.log("Please Enter the user name and password again.");
                promptUserForUserNamePassword();
                return;
            };
            fs.writeFile(CREDENTIALS_JSON_PATH, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            return connectToSQL(user, password);
        })
}

const connectToSQL = (user, password) => {
    const db = mysql.createConnection(
        {
            host: 'localhost',
            // MySQL username,
            user: user, //'root'
            // MySQL password
            password: password, // 'rickandmorty13'
            database: 'employees_db'
        },
        console.log(`Connected to the employees_db database.`)
    );
    return db;
}

module.exports = util.promisify(connect);