var mysql = require("mysql");
var inquirer = require("inquirer");

var arg1 = process.argv[2];

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(`Connect as id: ${connection.threadId}`);
});

function calls() {
    if (arg1 === "") {
        menuItems();
    }
    if (arg1 === "View Product Sales by Department") {
        departmentSales(); 
    }
    if (arg1 === "Create New Department") {
        createDepartment();
    }
}

