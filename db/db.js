const inquirer = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs");

const CREDENTIALS_JSON_PATH = "./db/dbcredentials.json";

const connect = async () => {
  const { user, password } = getSavedCredentials();
  let db;
  if (!user || !password) {
    // console.log(`Connecting to database..`)
    db = await promptUserForUserNamePassword();
  } else {
    db = connectToSQL(user, password);
  }
  return db;
};

const getSavedCredentials = () => {
  try {
    const credentialsString = fs.readFileSync(CREDENTIALS_JSON_PATH, "utf8");
    return JSON.parse(credentialsString);
  } catch (err) {
    console.log(`No saved password found!`);
    return {};
  }
};

const promptUserForUserNamePassword = async () => {
  // console.log("Please enter SQL credentials")
  const responses = await inquirer.prompt([
    {
      type: "input",
      name: "user",
      message: "User:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
    },
  ]);
  const { user, password } = responses;
  writeToCredentialsRecord(responses);
  return connectToSQL(user, password);
};

const writeToCredentialsRecord = (responses) => {
  fs.writeFileSync(
    CREDENTIALS_JSON_PATH,
    JSON.stringify(responses),
    "utf8",
    function (err) {
      if (err) return console.log(err);
    }
  );
}

const connectToSQL = (user, password) => {
  const db = mysql.createConnection({
    host: "localhost",
    // MySQL username,
    user: user,
    // MySQL password
    password: password,
    database: "employees_db",
  });
  console.log(`Connected to the employees_db database.`);
  return db;
};

// connect();

module.exports = connect;