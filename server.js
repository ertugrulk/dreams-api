// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Dreams (id INTEGER PRIMARY KEY AUTOINCREMENT, dream TEXT)"
    );
    console.log("New table Dreams created!");

    // insert default dreams
    db.serialize(() => {
      db.run(
        'INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")'
      );
    });
  } else {
    console.log('Database "Dreams" ready to go!');
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the dreams in the database
app.get("/api/dreams", (request, response) => {
  db.all("SELECT * from Dreams", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// get dream by id
app.get("/api/dreams/:id", (request, response) => {
  db.get("SELECT * from Dreams WHERE id = ?", request.params.id, (err, row) => {
    if (row) {
      response.send(JSON.stringify(row));
    } else {
      response.sendStatus(404);
    }
  });
});

// update dream
app.put("/api/dreams/:id", (request, response) => {
  // TODO
});

// endpoint to add a dream to the database
app.post("/api/dreams", (request, response) => {
  if (request.body.dream){
    db.run("INSERT INTO DREAMS (Dream) VALUES(?)", request.body.dream);
  }
  response.sendStatus(201)
});


// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});