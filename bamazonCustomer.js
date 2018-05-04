require("dotenv").config();
var keys = require("./keys.js");
var inquirer = require('inquirer')
var mysql = require('mysql')
var Table = require('cli-table')
var loading = require('loading-cli')
var db = mysql.createConnection({
    host: keys.dbConfig.host,
    port: keys.dbConfig.port,
    user: keys.dbConfig.user,
    password: keys.dbConfig.password,
    database: keys.dbConfig.db
})
var load = loading({
    "text":'',
    "color":"yellow",
    "interval":100,
   // "stream": process.stdout,
   "frames":["|*     ", "/ *    ", "-   *  ", "|    * ", "/     *", "-    * ", "|   *  ", "/  *   ", "- *    "]
})

function Order(){
    this.items = [],
    this.addToOrder = function(item){
        this.items.push(item)
    },
    this.getSummary = function(){
        console.log("\nYOUR ORDER SUMMARY:")
        var grandTotal = 0
        var summaryTable = new Table({
        head: ["Product Name", "Quantity Ordered", "Price/Each", "Total Price"]
        })
        for(i in this.items){
            var tableItems = [this.items[i].productName, this.items[i].qtyOrdered, this.items[i].itemPrice, this.items[i].total]
            grandTotal += this.items[i].total
            summaryTable.push(tableItems)
        }
        summaryTable.push(['','', 'Total:', grandTotal])
        console.log(summaryTable.toString())

    }
}

var order = new Order()

function start(){
     
    console.log('\033[2J')        
    console.log("\n*********************************")
    console.log("*  Welcome to                   *")
    console.log("*                               *")
    console.log("*          B a m a z o n        *")
    console.log("*                               *")
    console.log("*                               *")
    console.log("*********************************\n")
load.text = "Loading Bamazon"
load.start()
setTimeout(function(){
    load.stop()
    newOrder()
}, 3000)
    
}

function newOrder(){
    order.items = [];
    getProducts()
}

function getProducts(){
    
    db.query("SELECT * FROM products", function(err, res){
        if(err) throw err
        var productTable = new Table({
            head: ["ID", "Product Name", "Price"],
        })
        
        for(i in res){
            var items = [];
            items.push(res[i].item_id, res[i].product_name, "$" + res[i].price)
            productTable.push(items)
        }
        console.log(productTable.toString())
        console.log("\nPlace Order\n")
        takeOrder()
    })
}

function takeOrder(){
    inquirer.prompt([
        {
            name: "choice",
            type: "input",
            message: "Enter product ID of what you want to purchase:",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter Quantity:",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        console.log('\033[2J')
        load.text = 'Submitting...'
        load.start()
        setTimeout(function(){
            load.stop()
            checkQty(answer.choice, answer.quantity)
        }, 1000) 
    })
}


function checkQty(id, qty){
    load.text = 'Checking Stock'
    load.start()
    setTimeout(function(){  
    db.query("SELECT * FROM products WHERE item_id=" + id,
        function(err, res){
            if(err) throw err
            if(typeof(res) === undefined || res === null || res.length === 0){
                load.fail("I'm sorry, I couldn't find that product")
                confirm("Would you like to order something else instead?", getProducts, end)
            }
            if(res[0].stock_quantity === 0){
                load.fail("\nI'm Sorry, " + res[0].product_name + " is currently out of stock")
                confirm("Would you like to order another item?", getProducts, end);
            } else {
                if(qty > res[0].stock_quantity){
                    load.fail("Insufficient Stock!")
                    inquirer.prompt([
                        {
                            name: "newQty",
                            type: "input",
                            message: "Enter a Smaller Quantity to Order:"
                        }
                    ]).then(function(answer){
                        checkQty(id, answer.newQty)
                    })
                } else {
                    load.succeed("In Stock!")
                    
                    updateOrder(res, qty)
                }
            }
        })
    }, 3000)
}

function updateOrder(product, qty){
    var updatedQty = product[0].stock_quantity - qty
  //  var totalPrice = qty * product[0].price
    load.text = "Updating Order"
    load.start();
    setTimeout(function(){
        db.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: updatedQty
                },
                {
                    item_id: product[0].item_id
                }
            ],
            function(err){
                if(err) throw err;
                load.succeed("Item Added to Order!")
                var item = {
                    productName: product[0].product_name,
                    qtyOrdered: qty,
                    itemPrice: product[0].price,
                    total: qty * product[0].price
                }
                order.addToOrder(item)
                confirm("Would you like to add another item to your order?", getProducts, end)
            }
        )
    }, 3000)

}


function confirm(question, callbackYes, callbackNo){
    inquirer.prompt([
        {
            name: "response",
            type: "confirm",
            message: question
        }
    ]).then(function(answer){
        if(answer.response){
            callbackYes()
        } else {
            callbackNo()
        }
    })
}


function end(){
    console.log('\033[2J')
    load.text = "Finalizing Order"
    load.start()
    setTimeout(function(){
        load.stop()
        load.text = "Retrieving Order Summary"
        load.start()
        setTimeout(function(){
            load.stop()
            order.getSummary()
            console.log("\n*******************************")
            console.log("Thanks for shopping at Bamazon!")
            console.log("*******************************\n")
            confirm("Would you like to place another order?", newOrder, function(){
            console.log('\033[2J')
            console.log("\n*******************************")
            console.log("*        Come back soon!      *")
            console.log("*******************************\n")
            db.end()
            })
        }, 1500)
        
    }, 2000)
}




start()