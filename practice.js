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
//Used for hypothesis coding
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const exphbs = require('express-handlebars');
const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.get('/alldata/invoiceID/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const filePath = path.join(__dirname, 'CarSales.json');
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error loading JSON data');
        return;
      }
  
      const jsonData = JSON.parse(data);
      if (index >= 0 && index < jsonData.length) {
        const invoiceData = jsonData[index];
        res.render('table', { invoices: [invoiceData] });
      } else {
        console.log(`Invalid index: ${index}`);
        res.status(404).send(`Invalid index: ${index}`);
      }
    });
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })  