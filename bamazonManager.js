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
    "frames":["*    ", " *   ", "  *  ", "   * ", "    *", "   * ", "  *  ", " *   "]
})

function loadMenu(){
    console.log("************")
    console.log("Manager Mode")
    console.log("************")
    inquirer.prompt([
        {
            name: "menuItem",
            type: "list",
            choices: ["View All Products", "View Low Inventory Products", 
                        "Add to Inventory", "Add New Product", "Exit"],
            message: "Main Menu"
        }
    ]).then(function(answer){
        var col = "stock_quantity";
        var condition = '>=0'
        switch(answer.menuItem){
            case "View All Products":
                getProducts(col, condition, loadMenu);
                break;
            case "View Low Inventory Products":
                condition = '<5'
                getProducts(col, condition, loadMenu);
                break;
            case "Add to Inventory":
                getProducts(col, condition, addInventory)
                break;
            case "Add New Product":
                addProduct()
                break;
            case "Exit":
                db.end()
                console.log("Manager Mode Exited")
            default:
                return;
        }
    })
}

function getProducts(col, condition, callback){
    var query = "SELECT * FROM products WHERE " + col + condition
    db.query(query, function(err, result){
        if(err) throw err
        var productTable = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Quantity"]
            })
            for(var i in result){
                var items = [
                            result[i].item_id, result[i].product_name, 
                            result[i].department_name, result[i].price, 
                            result[i].stock_quantity
                            ]
                productTable.push(items)
            }
        console.log(productTable.toString())
        callback()
    })
}


function addInventory(){
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Enter Product ID:",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "qty",
            type: "input",
            message: "Quantity Being Added:",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answers){
        load.text = "Retrieving Item Record"
        load.start()
        var prodName = '';
        var prevQty = '';
        var newInventory = parseInt(answers.qty)
        setTimeout(function(){
            db.query("SELECT * FROM products WHERE item_id=" + answers.item, function(err, product){
                if((err)|| product.length === 0){
                    load.fail("Invalid ID!")
                    addInventory()
                } else {
                prodName = product[0].product_name
                prevQty = product[0].stock_quantity
                newInventory += prevQty
                load.text = "Updating Inventory"
               // load.stop()
               setTimeout(function(){
                db.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newInventory
                        },
                        {
                            item_id: answers.item
                        }
                    ],
                    function(err){
                        if(err){
                        load.fail("Failed to Update Inventory")
                        nextAction("Try Again", addInventory)
                        } else {
                        load.succeed("Inventory Updated Successfully!")
                        var updatedInvTable = new Table({
                            head: ["ID", "Product Name", "Old Qty", "Qty Added", "New Qty"]
                        })
                        var items = [answers.item, prodName, prevQty, answers.qty, newInventory]
                        updatedInvTable.push(items)
                        console.log(updatedInvTable.toString())
                            setTimeout(function(){
                                nextAction("Add More Inventory", addInventory)
                            }, 1500)
                        }
                })
            }, 3000)
                }
            })
        }, 1500)
        
      //  load.start();
        
    })
}


function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "Enter Product Name: "
        },
        {
            name: "department",
            type: "list",
            choices: ["Electronics", "Sports and Outdors", "Home Goods", "Clothing", "Create New Dept"],
            message: "Select Department",
            validate: function(value){
                if(value === "Create New Dept"){
                    console.log("You must be a supervisor!")
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "price",
            message: "Enter Product Retail Price: ",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "stock",
            type: "input",
            message: "Enter Current Amount in Stock: ",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answers){
        var productName = answers.productName
        var dept = answers.department
        var price = answers.price
        var stock = answers.stock
        if(dept === "Create New Dept"){
            console.log("\n!!!!!")
            console.log("You must be a supervisor to add new departments!")
            console.log("!!!!!\n")
            nextAction("Add New Product", addProduct)
        } else {
            load.text = "Adding Product"
            load.start()
            setTimeout(function(){
                db.query("INSERT INTO products SET ?",
                    {
                        product_name: productName,
                        department_name: dept,
                        price: price,
                        stock_quantity: stock
                    
                    },
                function(err){
                    if(err){
                        load.fail("!!!!!\nFailed to Add Product\n!!!!!") 
                    } else {
                        load.succeed(productName + " successfully added!")
                        var addedProdTable = new Table({
                            head: ["Product Name", "Department", "Price", "Current Stock"]
                        })
                        var items = [productName, dept, price, stock]
                        addedProdTable.push(items)
                        console.log(addedProdTable.toString())
                    }
                        setTimeout(function(){
                            nextAction("Add Another Product", addProduct)
                        }, 2000)
                })
                    
            }, 3000)
        }          
    })
}

function nextAction(actionName, callback){
    inquirer.prompt([
        {
            type: "list",
            name: "next",
            choices: ["Main Menu", actionName, "Exit"],
            message: "Menu"
        }
    ]).then(function(answer){
        var choice = answer.next
        if(choice === "Main Menu"){
            loadMenu()
        } else if(choice === actionName){
            callback()
        } else {
            db.end()
            console.log("Manager Mode Exited")
        }
    })
}


loadMenu()

