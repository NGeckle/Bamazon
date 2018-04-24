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
    console.log("Connected as id: " + connection.threadId);
    listItems();
});

function buyItem() {
    inquirer.prompt([
        {
            name: "yesOrNo",
            type: "confirm",
            message: "Would you like to buy something?",
            default: true
        },
        {
            name: "itemId",
            type: "input",
            message: "List the item id of the product you would like to purchase."
        },
        {
            name: "stock",
            type: "input",
            message: "How many would you like to buy?"
        }
    ]).then(function(answers) {
        if (answers.yesOrNo === true) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answers.stock + " WHERE item_id = " + answers.itemId + ";",
            function(err, res) {
                if (err) throw err;
                console.log("Congrats! You have bought " + answers.stock + " item(s)!");
            });
            connection.query("UPDATE products SET product_sales = (price * " + answers.stock + ") + product_sales WHERE item_id = " + answers.itemId + ";",
            function(err, res) {
                if (err) throw err;
            });
            connection.query("UPDATE departments SET total_profit = product_sales - over_head_costs;",
            function(err, res) {
                if (err) throw err;
                console.log("Updated total profit!");
            });
            connection.end();
        }
        else {
            connection.end();
        }
    });
}

function listItems() {
    inquirer.prompt([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to see the list of items you can buy?",
            default: false
        }
    ]).then(function(answers) {
        if (answers.confirm === true) {
            connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity > 0;", function(err, res) {
                if (err) throw err;
                console.log(res);
            });
            buyItem();
        }
        else {
            connection.end();
        }
    });
}