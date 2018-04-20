var mysql = require("mysql");
var inquirer = require("inquirer");
const tablefy = require("tablefy");

let table = new tablefy();

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
    calls();
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
    connection.query(`UPDATE departments SET total_profit = product_sales - over_head_costs;`,
    function(err, res) {
        if (err) throw err;
        console.log("Updated total profit!");
    });
    connection.query(`SELECT * FROM departments`,
    function(err, res) {
        table.draw(res);
    });
    connection.end();
}

function newDepartment() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to add a new department?",
            default: false
        },
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        }
    ]).then(function(answers) {
        if (answers.confirm === true) {
            connection.query(`INSERT INTO departments (department_name, over_head_costs, product_sales, total_profit) VALUES ("${answers.name}", 20000, 50000, 0);`,
            function(err, res) {
                if (err) throw err;
                console.log(`A new department named ${answers.name} has been added!`);
            });
            connection.end();
        }
        else {
            connection.end();
        }
    });
}
