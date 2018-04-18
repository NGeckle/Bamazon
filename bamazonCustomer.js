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
    console.log(`Connect as id: ${connection.threadId}`);
    afterConnection();
});

function afterConnection() {
    listItems();
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
            connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${answers.stock} WHERE item_id = ${answers.itemId};`,
            function(err, res) {
                if (err) throw err;
                console.log(`Congrats! You have bought ${answers.stock} item(s)!`);
            });
            connection.end();
        }
    });
}

function listItems() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity > 0;", function(err, res) {
        if (err) throw err;
        console.log(res);
    });
}