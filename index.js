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
  // 'View Employees': { className: 'Employee', method: 'getInfo', callBack: infoCallBack },
  // 'Add Employee': { className: 'Employee', method: 'add', callBack: putCallBack },
  // 'Update Employee Role': { className: 'Employee', method: 'update' },
  'View All Roles': { className: 'Role', method: 'getInfo', callBack: infoCallBack },
  'Add Role': { className: 'Role', method: 'add', callBack: putCallBack },
  // 'View All Departments': { className: 'Department', method: 'getInfo', callBack: infoCallBack },
  'Add Department': { className: 'Department', method: 'add', callBack: putCallBack },
  // 'Delete Department': { className: 'Department', method: 'delete', callBack: putCallBack },
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
  console.log("-------------------copyright (c) 1993 IBM------------------------")
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
  promise.then(info => {
    console.log(`\n${message}`);
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
  const { className, method, callBack, params = {} } = MAIN_MENU[request];
  const targetClass = new ALL_CLASSES[className](db)
  const methodReturn = await targetClass[method](params);
  methodReturn.targetClass = targetClass;
  methodReturn.callBack = callBack;
  return methodReturn;
}


main();