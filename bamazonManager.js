var mysql = require("mysql");
var inquirer = require("inquirer");

var arg1 = process.argv[2];
var arg2 = process.argv[3];
var arg3 = process.argv[4];
var arg4 = process.argv[5];
var arg5 = process.argv[6];


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
    calls();
});

function calls() {
    if (arg1 === "View Products for Sale") {
        products();
    }
    if (arg1 === "View Low Inventory") {
        inventory(); 
    }
    if (arg1 === "Add to Inventory") {
        addInventory();
    }
    if (arg1 === "Add New Product") {
        addProduct();
    }
}


function products() {
    connection.query("SELECT product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
    });
    connection.end();
}

function inventory() {
    connection.query("SELECT product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5", 
    function(err, res) {
        if (err) throw err;
        console.log(res);
    });
    connection.end();
}

function addInventory() {
    inquirer.prompt([
        {
            name: "yesOrNo",
            type: "confirm",
            message: "Would you like to add stock?",
            default: true
        },
        {
            name: "item",
            type: "input",
            message: "Which item would you like to add more stock to?"
        },
        {
            name: "stockAmount",
            type: "input",
            message: "How much stock will there be after you add stock?"
        }
    ]).then(function(answers) {
        if (answers.yesOrNo === true) {
            var query = connection.query(`UPDATE products SET ? WHERE ?`,
            // var query = connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answers.stockAmount} WHERE product_name = ${answers.item}`, 
            [{
                stock_quantity: `${answers.stockAmount}`
            },
            {
                product_name: `${answers.item}`
            }],
            function(err, res) {
                if (err) throw err;
                console.log(`${answers.item} now has ${answers.stockAmount} stock!`);
            });
            connection.end();
        }
    });
}
function addProduct() {
    inquirer.prompt([
        {
            name: "yesOrNo",
            type: "confirm",
            message: "Would you like to add a product?",
            default: true
        },
        {
            name: "item",
            type: "input",
            message: "What is the name of the product you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What department is the product a part of?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of the product?"
        },
        {
            name: "stock",
            type: "input",
            message: "How much do you have of the product in stock?"
        }
    ]).then(function(answers) {
        if (answers.yesOrNo === true) {
            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${answers.item}", "${answers.department}", ${answers.price}, ${answers.stock})`, 
            function(err, res) {
                if (err) throw err;
                console.log(`${answers.item} has now been added to the ${answers.department} department with the price of ${answers.price} and with ${answers.stock} in stock!`);
            });
        }
    });
}