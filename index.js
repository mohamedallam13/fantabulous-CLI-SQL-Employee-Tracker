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
  'View All Employees': { className: 'Employee', method: 'getInfo', callBack: infoCallBack },
  'View Salaries By Department': { className: 'Department', method: 'getSalariesByDepartment', callBack: infoCallBack },
  'View Employees By Department': { className: 'Employee', method: 'getEmployeesByDeparment', callBack: infoCallBack },
  'View Employees By Manager': { className: 'Employee', method: 'getEmployeesByManager', callBack: infoCallBack },
  'Add Employee': { className: 'Employee', method: 'add', callBack: putCallBack },
  'Update Employee Role': { className: 'Employee', method: 'updateRole' , callBack: putCallBack },
  'View All Roles': { className: 'Role', method: 'getInfo', callBack: infoCallBack },
  'Add Role': { className: 'Role', method: 'add', callBack: putCallBack },
  'View All Departments': { className: 'Department', method: 'getInfo', callBack: infoCallBack },
  'Add Department': { className: 'Department', method: 'add', callBack: putCallBack },
  'Delete Employee': { className: 'Employee', method: 'delete', callBack: putCallBack },
  'Delete Role': { className: 'Role', method: 'delete', callBack: putCallBack },
  'Delete Department': { className: 'Department', method: 'delete', callBack: putCallBack },
  'Quit': {}
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
  displayWelcome();
  connect().then((conn) => {
    console.log("Hello!\n");
    db = conn;
    runMainMenu();
  });
};

const displayWelcome = () => {
  console.log("-----------------------------------------------------------------")
  console.log(figlet.textSync('Employee\nManager\n', { horizontalLayout: 'full' }));
  console.log("-----------------------------------------------------------------")
  console.log("-------------------copyright (c) 1983 IBM------------------------")
  console.log("\n")
}

function infoCallBack(methodReturn) {
  const { promise } = methodReturn;
  promise.then(([rows]) => {
    console.table(rows);
    runMainMenu();
  }).catch((e) => {
    console.log(e);
    runMainMenu();
  });
}

function putCallBack(methodReturn) {
  const { promise, targetClass, message } = methodReturn;
  if (!promise) runMainMenu();

  promise.then(info => {
    console.log(`\n${message}\n`);
    if (!targetClass) runMainMenu();

    targetClass.getInfo().promise.then(([rows]) => {
      console.table(rows);
      runMainMenu();
    }).catch((e) => {
      console.log(e);
      runMainMenu();
    });
  }).catch((e) => {
    console.log(e);
    runMainMenu();
  });
}

const runMainMenu = async () => {
  const responses = await inquirer.prompt(QUESTIONS)
  const { request, confirm_quit } = responses;
  if (confirm_quit) {
    console.log("Good Bye!");
    db.end();
    return;
  } else {
    const methodReturn = await fulfillRequest(request);
    methodReturn.callBack(methodReturn);
  }
};

const fulfillRequest = async (request) => {
  const { className, method, callBack, params} = MAIN_MENU[request];
  const targetClass = new ALL_CLASSES[className](db)
  const methodReturn = await targetClass[method](params);
  methodReturn.targetClass = targetClass;
  methodReturn.callBack = callBack;
  return methodReturn;
}


main();