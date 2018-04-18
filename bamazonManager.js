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
    calls();
});

function calls() {
    if (arg1 === "") {
        menuItems();
    }
    if (arg1 === 'View Products for Sale') {
        products();
    }
    if (arg1 === 'View Low Inventory') {
        inventory(); 
    }
    if (arg1 === 'Add to Inventory') {
        addInventory();
    }
    if (arg1 === 'Add New Product') {
        addProduct();
    }
}

function menuItems() {
    console.log("Type in 'View Products for Sale', 'View Low Inventory', 'Add to Inventory', or 'Add New Product' (Including the quotations) after 'bamazonManager.js' (Not including the quotations).");
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
            message: "How much stock would you like to add?"
        }
    ]).then(function(answers) {
        if (answers.yesOrNo === true) {
            connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answers.stockAmount} WHERE product_name = "${answers.item}";`, 
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
            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${answers.item}", "${answers.department}", ${answers.price}, ${answers.stock});`, 
            function(err, res) {
                if (err) throw err;
                console.log(`${answers.item} has now been added to the ${answers.department} department with the price of ${answers.price} and with ${answers.stock} in stock!`);
            });
        }
    });
}