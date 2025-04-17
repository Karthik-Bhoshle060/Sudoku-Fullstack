const express = require("express");
const server = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3100;
server.use(cors());
server.use(bodyParser.json());
let uri = "mongodb://0.0.0.0:27017/";
let dbName = "Sudoku_Puzzle";
const url = "mongodb://0.0.0.0:27017/Sudoku_Puzzle";
//const path = require("path");

server.use(express.json());

server.post("/register", async (req, res) => {
  console.log("Register Server!!!!");
  let emp = req.body;
  const client = new MongoClient(url);
  client.connect();
  const database = client.db(dbName);
  const collectionName = database.collection("User");
  const document = emp;
  const data = collectionName
    .find({ username: document.username })
    .toArray()
    .then((data) => {
      if (data && data.length != 0) {
        console.log("User Already Exist!!!");
        res.json({
          response: false,
          message: "User Already Exist!!",
          data: null,
        });
      } else {
        const result = collectionName.insertOne(
          { ...document },
          (err, res) => {}
        );
        console.log("Profile Created Successfully!!!!");
        res.json({
          response: true,
          message: "Profile Created Successfully!!!!",
          data: { ...document },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

server.post("/store_record", async (req, res) => {
  console.log("Store Record Server!!!!");
  let emp = req.body;
  const client = new MongoClient(url);
  client.connect();
  const database = client.db(dbName);
  const collectionName = database.collection("Game_Records");
  const document = emp;
  const result = collectionName.insertOne({ ...document }, (err, res) => {});
  console.log("Record Stored Successfully!!!!");

  const data = collectionName
    .findOne({}, { sort: { timeTakenInSeconds: 1 } })
    .then((data) => {
      console.log(data);
      if (data.timeTakenInSeconds > document.timeTakenInSeconds)
        data.timeTakenInSeconds = document.timeTakenInSeconds;
      res.json({
        response: true,
        message: "Record Stored Successfully!!!",
        data: { ...data },
      });
    });
});

server.post("/login", async (req, res) => {
  console.log("Login Server!!!!");
  let emp = req.body;
  const client = new MongoClient(url);
  client.connect();
  const database = client.db(dbName);
  const collectionName = database.collection("User");
  const document = emp;
  const data = collectionName
    .find({ username: document.username, password: document.password })
    .toArray()
    .then((data) => {
      if (data && data.length != 0) {
        console.log("Login Successfully done!!!");
        res.json({
          response: true,
          message: "Login Successfully done!!!!!",
          data: data[0],
        });
      } else {
        console.log("No User Found!!!!");
        res.json({
          response: false,
          message: "No User Found!!",
          data: null,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

server.post("/user_best_score", async (req, res) => {
  console.log("Login Server!!!!");
  let emp = req.body;
  const client = new MongoClient(url);
  client.connect();
  const database = client.db(dbName);
  const collectionName = database.collection("Game_Records");
  const document = emp;
  const data = collectionName
    .findOne(document, { sort: { timeTakenInSeconds: 1 } })
    .then((data) => {
      res.json({
        response: true,
        message: "Record Fetched Successfully!!!",
        data: { ...data },
      });
    });
});

server.get("/", function (req, res) {
  res.send("Hello World!");
});

server.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
