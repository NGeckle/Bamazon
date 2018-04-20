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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(answers) {
        if (answers.confirm === true) {
            if (answers.choice === "View Products for Sale") {
                products();
            }
            else if (answers.choice === "View Low Inventory") {
                inventory(); 
            }
            else if (answers.choice === "Add to Inventory") {
                addInventory();
            }
            else {
                addProduct();
            }
        }
    });
}


function products() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
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
            message: "List the item id of the product you would like to add stock to."
        },
        {
            name: "stockAmount",
            type: "input",
            message: "How much stock would you like to add?"
        }
    ]).then(function(answers) {
        if (answers.yesOrNo === true) {
            connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answers.stockAmount} WHERE item_id = "${answers.item}";`, 
            function(err, res) {
                if (err) throw err;
                console.log(`You have added ${answers.stockAmount} stock!`);
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
            type: "list",
            message: "What department is the product a part of?",
            choices: ["Kids", "Electronics", "Food", "Movies & TV", "Music", "Clothing", "Automotive", "Other"]
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
            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES ("${answers.item}", "${answers.department}", ${answers.price}, ${answers.stock}, 30000);`, 
            function(err, res) {
                if (err) throw err;
                console.log(`${answers.item} has now been added to the ${answers.department} department with the price of ${answers.price} and with ${answers.stock} in stock!`);
            });
            connection.end();
        }
    });
}