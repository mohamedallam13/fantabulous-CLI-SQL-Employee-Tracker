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
  // 'View Employees': { className: 'Employee', method: 'getInfo', callBack: queryCallBack },
  // 'Add Employee': { className: 'Employee', method: 'add', callBack: addCallBack },
  // 'Update Employee Role': { className: 'Employee', method: 'update' },
  'View All Roles': { className: 'Role', method: 'getInfo', callBack: queryCallBack },
  // 'Add Role': { className: 'Role', method: 'add', callBack: addCallBack },
  'View All Departments': { className: 'Department', method: 'getInfo', callBack: queryCallBack },
  'Add Department': { className: 'Department', method: 'add', callBack: addCallBack },
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

const queryCallBack = (err, results) => {
  if (err) {
    console.log(err)
    return;
  }
  console.log('\n');
  console.table(results);
  runMainMenu();
}

const addCallBack = () => {
  console.log()
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
    }
  });
};

const fulfillRequest = (request) => {
  const { className, method } = MAIN_MENU[request];
  const targetClass = new ALL_CLASSES[className](db)
  targetClass[method](queryCallBack);
}




// let conn;
// const callTestQuery = () => {
//   conn = mysql.createConnection({
//     host: "localhost",
//     // MySQL username,
//     user: "root",
//     // MySQL password
//     password: "rickandmorty13",
//     database: "employees_db",
//   }).promise();

//   const result = conn.execute("select * from departments");
//   conn.end();
//   return result;
// }

// const demoTest = ()  => {
//   callTestQuery().then((results) => console.log(results))
//   .catch(err => console.log(err));
// }
// demoTest();
//callTestQuery();

main();