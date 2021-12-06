const inquirer = require("inquirer");
const figlet = require('figlet');
const mysql = require("mysql2");
const cTable = require("console.table");

const connect = require("./db/db");
var db;

const ALL_CLASSES = {
  Employee: require("./lib/Employee"),
  Role: require("./lib/Role"),
  Department: require("./lib/Department")
};

const MAIN_MENU = {
  'View Employees': { className: 'Employee', method: 'getInfo' },
  // 'Add Employee': { className: 'Employee', method: 'add' },
  // 'Update Employee Role': { className: 'Employee', method: 'update' },
  'View All Roles': { className: 'Role', method: 'getInfo' },
  // 'Add Role': { className: 'Role', method: 'add' },
  'View All Departments': { className: 'Department', method: 'getInfo' },
  // 'Add Department': { className: 'Department', method: 'add' },
  // 'Quit': {}
};

const QUESTIONS = [
  {
    type: "list",
    name: "request",
    message: "What would you like to do?",
    choices: Object.keys(MAIN_MENU)
  },
  {
    type: "confirm",
    name: "confirm_quit",
    message: "Are you sure you want to quit?",
    when: (answers) => answers.request == "Quit",
  }
];

const main = () => {
  console.log(figlet.textSync('Employee\nManager\n', { horizontalLayout: 'full' }));
  connect().then((conn) => {
    console.log("Hello!");
    db = conn;
    runMainMenu();
  });
};

const getQueryCallBack = (err, results) => {
  if (err) {
    console.log(err)
    return;
  }
  console.log(data);
  return results;
}

const addCallBack = () => {

}

const runMainMenu = () => {
  inquirer.prompt(QUESTIONS).then((responses) => {
    const { request, confirm_quit } = responses;
    if (confirm_quit) {
      console.log("Good Bye!");
      db.end();
      return;
    } else {
      fulfillRequest(request);
      runMainMenu();
    }
  });
};

function fulfillRequest(request) {
  const { className, method } = MAIN_MENU[request];
  const targetClass = new ALL_CLASSES[className](db)
  targetClass[method](getQueryCallBack);
}


main();