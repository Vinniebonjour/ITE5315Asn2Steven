
/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: STEVEN MARTY M. CES Student ID: N01639939 Date: NOVEMBER 3, 2023
*
*
******************************************************************************
**/

//loads the express module to
const express = require('express');

//create router
const router = express.Router()

//create parsing function
const bodyParser = require('body-parser');

//loads the path module
const path = require('path');

//declaring constant variable fs(File system)
const fs = require('fs');

//creates our express server
const app = express();

//load the handlebars module
const exphbs = require('express-handlebars');

//sets the server to listen in port 3000
const port = process.env.port || 3000;

// Import the 'handlebars' module
const handlebars = require('handlebars');

// Import the 'handlebars-helpers' module
const handlebarsHelpers = require('handlebars-helpers');

// Register the handlebars helpers
handlebarsHelpers({ handlebars: handlebars });

//sets the connection of the web app to the directory "Public"
app.use(express.static(path.join(__dirname, 'public')));

//sets handlebars configurations
app.engine('.hbs', exphbs.engine({ extname: '.hbs' })); // no .engine at the exphbs that's why the error says "TypeError: exphbs is not a function" xD

//configures the Express application in order to use the Handlebars templating engine
//therefore allowing the main, index and error handlebars to work automatically
app.set('view engine', 'hbs');

//sets the default route to render and call handlebar index along with the main.hbs to show an output of 
//titled "Express"
//"Express" - with its respective format thru css style
//Welcome to "Express"
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//once the endpoint changed to users, the web app would simply print 'respond with a resource' to the user
app.get('/users', function(req, res) {
  res.send('respond with a resource');
});

//========================================================================================================================================//
//========================================================================================================================================//
//For Step6, prints the data one by one using route '/data/invoiceID/:index' of you choice
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to use Handlebars with the '.hbs' extension
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Handle GET requests to '/data/invoiceID/:index'
app.get('/data/invoiceID/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const filePath = path.join(__dirname, 'CarSales.json');
  
  // Read the JSON data from file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Executes when there's an error reading the file, log the error and send a 500 status response
      console.error(err);
      res.status(500).send('Error loading JSON data');
      return;
    }
  
    // Parse the JSON data
    const jsonData = JSON.parse(data);
  
    if (index >= 0 && index < jsonData.length) {
      // Retrieves the invoice data at the specified index when the statement is true
      const invoiceData = jsonData[index];
  
      // Render the 'table' view with the invoice data
      res.render('table', { invoices: [invoiceData] }, (err, html) => {
        if (err) {
          // Log an error and send a 500 status response when there's an error rendering the template
          console.error(err);
          res.status(500).send('Error rendering template');
          return;
        }
        
        // Send the rendered HTML as the response
        res.send(html);
      });
    } else {
      // Log an error and send a 404 status response when the index is invalid
      console.log(`Invalid index: ${index}`);
      res.status(404).send(`Invalid index: ${index}`);
    }
  });
});

//========================================================================================================================================//
//========================================================================================================================================//
//For Step 6, SEARCH BAR for both InvoiceNo and Manufacturer
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());//body-parser middleware enabled

app.get('/search', (req, res) => {//handles GET requests to '/search' route
  app.use(express.static(path.join(__dirname, 'public')));//serves static files from the 'public' directory
  app.engine('.hbs', exphbs.engine({ extname: '.hbs' })); //sets up the Handlebars view engine with the '.hbs' extension
  app.set('view engine', 'hbs');//sets the view engine to Handlebars
  res.render('search'); //renders the 'search' view using the Handlebars template
});

app.post('/searched', (req, res) => {//handles POST requests to '/searched' route
  const keyword = req.body.keyword;//retrieves the search keyword from the request body
  fs.readFile('CarSales.json', 'utf8', (err, data) => {//reads the 'CarSales.json' file asynchronously
    if (err) {
      console.error(err);
      res.status(500).send('Error reading the data file');//sends an error response if there's an issue reading the file
      return;
    }

    const carSalesData = JSON.parse(data);//parses the JSON data from the file into an object
    const filteredData = carSalesData.filter(
      item =>
        item.InvoiceNo.toLowerCase().includes(keyword.toLowerCase()) ||//filters the data based on the search keyword (case-insensitive)
        item.Manufacturer.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filteredData.length > 0) {
      res.render('manufacturer', { carSalesData: filteredData });//renders the 'manufacturer' view with the filtered data both invoice & manufacturer
    } else {
      res.send('No results found');//sends a response indicating no results were found
    }
  });
});
//========================================================================================================================================//
//========================================================================================================================================//
//STEP 7, prints all data sales from json file
//handle GET requests to '/alldata' to print all datasets from carsales.json
app.get('/alldata', (req, res) => {
  const filePath = path.join(__dirname, 'CarSales.json');

  //read the JSON data from file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading JSON data');
      return;
    }

    //parse the JSON data
    const jsonData = JSON.parse(data);

    //renders the 'table' view with the JSON data
    res.render('table', { invoices: jsonData });
  });
});
//========================================================================================================================================//
//========================================================================================================================================//

//Step 8Modify Step 7 (change the endpoint/view name) by removing those records which their 
//“class” is blank (hint: use “#if” helper ☺)
app.get('/alldata/noclass', (req, res) => {
  const filePath = path.join(__dirname, 'CarSales.json');

  // Read the JSON data from file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading JSON data');
      return;
    }

    //parse the JSON data
    const jsonData = JSON.parse(data);

    //filter the JSON data to remove records with an empty string value in the "Class" field
    const filteredData = jsonData.filter((record) => record.class !== '');

    //log the number of records without a "Class" field to verify the total of empty class fields
    const numRecordsWithClass = filteredData.length;
    console.log(`Number of records with "Class" field: ${numRecordsWithClass}`);

    //render the 'filter' view with the filtered JSON data and the number of records without a "Class" field
    res.render('filter', { invoices: filteredData, classrecords: numRecordsWithClass });
  });
});


//========================================================================================================================================//
//========================================================================================================================================//
//Step 9 : Design a custom helper for changing “blank” to “unknown” for records which their “class” is “blank”.
//Apply this on Step7 & 8 to display all data but highlight those rows that their “class.” 
app.get('/alldata/highlight', (req, res) => {
  const filePath = path.join(__dirname, 'CarSales.json');

  //read the JSON data from file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error loading JSON data');
      return;
    }

    //parse the JSON data
    const jsonData = JSON.parse(data);

    //custom helper function to change empty values in the "class" field to "unknown"
    const changeEmptyToUnknown = (record) => {
      if (record.class === '') {
        return { ...record, class: 'unknown' };
      }
      return record;
    };

    //apply the custom helper function to each record in jsonData
    const modifiedData = jsonData.map(changeEmptyToUnknown);

    //render the 'highlight' view with the modified JSON data
    res.render('highlight', { invoices: modifiedData });
  });
});


//========================================================================================================================================//
//========================================================================================================================================//


//I have to move this line, that way I could access other dynamic routes
//whenever an error occurs, this line renders and call the handlebar error.hbs and prints the message---
//"Wrong Route" in a Header format
app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message:'Wrong Route' });
});

app.use((req, res, next) => {
  res.status(404).send('Error! Page not found');
});

//logs the message thru the console showing that this web app listens to its designated port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
