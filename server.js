const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
var cors = require('cors')
app.use(cors()) 
let port = process.env.PORT || 3001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('welcome to the development api-server');
  });
const routes = require("./routes/routes.js")(app, fs);
const server = app.listen(port, () => {
  console.log("listening on port %s...", server.address().port);
});
