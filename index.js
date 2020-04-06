const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

//const dbUser = process.env.DB_USER;
//const pass = process.env.DB_PASS;

const uri = process.env.DB_PATH;
const MongoClient = require("mongodb").MongoClient;
let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const users = ["Mousumi", "Puja", "Pappu", "Tuhin"];

app.get("/products", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");

    collection.find({ name: "mobile" }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });

    //client.close();
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const name = users[id];
  res.send({ id, name });
});

//Post
app.post("/addProduct", (req, res) => {
  //save to database
  const product = req.body;

  console.log(product);

  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");

    collection.insertOne(product, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });

    //client.close();
  });
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log("Listening to port 3000"));
