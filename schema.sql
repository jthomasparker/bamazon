DROP DATABASE if exists bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT(50) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price DECIMAL(10, 2),
  stock_quantity INT(50),
  
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Becho", "Electronics", 99.99, 44), ("Becho Dot", "Electronics", 49.99, 51),
("Bell Laptop 13inch", "Electronics", 799.99, 4), ("Bell Laptop 15inch", "Electronics", 899.99, 10),
("Bell Laptop 17inch", "Electronics", 999.99, 3), ("Camping Stove", "Sports and Outdoors", 59.99, 150),
("Tent - 4 person", "Sports and Outdoors", 250, 5), ("Running Shoes", "Sports and Outdoors", 129.99, 18),
("Toilet Paper 24 pack", "Home Goods", 10.99, 1500), ("Paper Towels - 4 rolls", "Home Goods", 3.99, 900),
("Table Lamp", "Home Goods", 29.99, 21), ("Cargo Shorts", "Clothing", 14.99, 101), ("Socks - 3 pack", "Clothing", 4.99, 500),
("White T-Shirts - 10 Packs", "Clothing", 9.99, 300), ("Crocs", "Clothing", 24.99, 1400)