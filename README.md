# bamazon
GT Coding Bootcamp Week 12 Homework: Amazon-style console app using nodejs and mysql  

**Welcome to Bamazon!**  
    *Note #1: Because Bamazon uses a local MySql database, you will need to first create your own database and products table, and configure the code to reference your own db. The database schema is included for your convenience.*  
    *Note #2: This has been thoroughly tested - any errors you encounter are user errors. See Note #1*  

Bamazon features two modes: Customer Mode and Manager Mode  

**Customer Mode**  
    Video Example: https://drive.google.com/file/d/1vMaaZ2AC17YfaRw6kkMLRuI7wkD6MAhI/view  
    -To use Customer Mode, run the command "node bamazonCustomer" in the console  
    - You will be presented with a table of available products  
        - Find the product you want to "purchase" and enter its ID  
        - Enter the quantity of your chosen product that you'd like to "purchase"  
    - You will then be asked if you'd like to add more items to your order  
        - 'Yes' will take you back to the products table so that you can select another item  
        - 'No' will finalize your order and present your receipt  
    - When you have finalized your order and gotten your order summary, you will be asked if you'd like to place another order  
        - 'Yes' will start a brand new order  
        - 'No' will wish you farewell and close the app  
      
**Manager Mode**  
    Video Example: https://drive.google.com/file/d/1Jompsy9AMFtcuGXMOPqFxG_M1gOLXJF_/view  
    - To use Manager Mode, run the command "node bamazonManager" in the console  
        *Now you're the manager! Congrats on the promotion!*  
    - After loading, you will be presented with the Main Menu:  
        - **View All Products**  
            - Displays a table of all the available products and their details  
        - **View Low Inventory**   
            - Displays a table of all products with less than 5 items in stock  
        - **Add to Inventory**   
            - Allows you to add to a product's inventory  
            - Enter the ID of the product you want to add more items to  
            - Enter how many more items of that product you are adding to its inventory  
            - You will be given a summary, and a self-explanatory Menu:  
                - Main Menu: Takes you back to the Main Menu  
                - Add More Inventory: Allows you to add more inventory to another product  
                - Exit: Exits Manager Mode and closes the App  
            - *Note: If you choose a product ID that doesn't exist, you will receive an error*  
        - **Add New Product**  
            - Allows you to add an entirely new product to Bamazon  
            - Enter the name/description of the new product  
            - Select the Department/Category that the product belongs to  
                *Note: Creating a new department is reserved for supervisors only!*  
            - Enter the retail price of the product (what it will be sold for)  
            - Enter how many of the new product are currently in stock  
            - You will then be given a summary, and a self-explanatory Menu:  
                - Main Menu: Takes you back to the Main Menu  
                - Add Another Product: Allows you to add another product  
                - Exit: Exits Manager Mode and closes the App  
        - **Exit**   
            - Exits manager mode and closes the app  
