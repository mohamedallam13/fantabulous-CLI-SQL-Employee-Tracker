const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connect = require('./db.js');
var db;

const ALL_METHODS = {

}


const MAIN_MENU = [
    // 'View Employees',
    // // 'Add Employee',
    // // 'Update Employee Role',
    // 'View All Roles',
    // 'Add Role',
    'View All Departments',
    // 'Add Department',
    'Quit'
]


const QUESTIONS = [
    {
        type: "list",
        name: "request",
        message: "What would you like to do?",
        choices: MAIN_MENU
    },
    {
        type: "confirm",
        name: "confirm_quit",
        message: "Are you sure you want to quit?",
        when: (answers) => answers.request == "Quit"
    }
]


//Recursive
const main = () => {
    connect().then(dbObj => {
        db = dbObj;
        runMainMenu();
    });
}

const runMainMenu = () => {
    inquirer
        .prompt(QUESTIONS)
        .then((responses) => {
            const { request, confirm_quit } = responses
            if (confirm_quit) {
                console.log("Good Bye!")
                db.end();
                return;
            }
        });
}

main();