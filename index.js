const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Set view engine to be able to view EJS files
app.set("view engine", "ejs");

//Import the authentication module
const auth = require('./auth.js');

auth.createUser("John", "Secret123");
auth.createUser("Alice", "password");

console.log(auth.authenticateUser("John", "Secret123"));
console.log(auth.authenticateUser("John", "Secret12"));

//Connect to database:
const mysql = require('mysql');
//Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'proddata'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } else {
    console.log('Connected to database!');
  }
});



app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const authenicated = auth.authenticateUser(username, password);
  console.log(authenicated);

    //Checks if authentication is true or false
  if(authenicated){
    console.log("Authentication was successful");
    res.render("home");
  } else {
    console.log("Authentication was unsuccessful");
    res.render("failed");
  }
});


app.get("/shop", function(req, res) {
  const ID = req.query.rec;
  connection.query("SELECT * FROM productdata WHERE id = ?", [ID], function (err, rows, fields) {
    if (err) {
      console.error('Error retrieving data from database: ', err);
      res.status(500).send('Error retrieving data from database');
    } else if (rows.length === 0) {
      console.error(`No rows found for ID ${ID}`);
      res.status(404).send(`No product found for ID ${ID}`);
    } else {
      console.log('Data retrieved from database!');
      const price = rows[0].Price
      const prodName = rows[0].Product;
      const prodModel = rows[0].Model;
      const image = rows[0].Image;
      res.render("test.ejs", {myMessage: prodName, model: prodModel, myImage: image, myPrice: price});
    }
  });
});



app.post("/shop", function(req, res) {
  const ID = req.body.rec2;
  connection.query("SELECT * FROM productdata WHERE id = ?", [ID], function (err, rows, fields) {
    if (err) {
      console.error('Error retrieving data from database: ', err);
      res.status(500).send('Error retrieving data from database');
    } else if (rows.length === 0) {
      console.error(`No rows found for ID ${ID}`);
      res.status(404).send(`No product found for ID ${ID}`);
    } else {
      console.log('Data retrieved from database!');
      console.log(rows[0].Product);
      console.log(rows[0].Manufacturer);
      console.log(rows[0].Model);
      console.log(rows[0].Price);
      console.log(rows[0].Image);
      const prodName = rows[0].Product;
      const prodModel = rows[0].Model;
      res.render("test.ejs", {myMessage: prodName, model: prodModel});
    }
  });
});

// Serve static files from the public directory
app.use(express.static('home'));
app.use(express.static('pics'));

//For the back to home button
app.get("/home", function(req,res){
  res.render("home.ejs");
})

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});