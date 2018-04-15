var mysql = require("mysql");

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
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity > 0", function(err, res) {
        if (err) throw err;
        console.log(res);
    });
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
        
    });
}