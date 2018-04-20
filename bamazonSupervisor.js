var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(`Connected as id: ${connection.threadId}`);
});

function calls() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to continue?",
            default: false
        },
        {
            name: "choice",
            type: "list",
            message: "Choose one.",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(answers) {
        if (answers.confirm === true) {
            if (answers.choice === "View Product Sales by Department") {
                viewSales();
            }
            else {
                newDepartment();
            }
        }
        else {
            connection.end();
        }
    });
}

function viewSales() {

}

function newDepartment() {

}
