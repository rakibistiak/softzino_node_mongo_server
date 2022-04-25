const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();



// Middelware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrjhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    
    const database = client.db("Softzino");
    const userCollection = database.collection("User_Info");

    // Store Logged in User Data
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result.acknowledged)
    });

    // Google user can logged in before so we use upsert method here
    app.put('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const options = { upsert: true }
      const updateUser = { $set: user };
      const result = await userCollection.updateOne(query, updateUser, options)
      res.send(result.acknowledged)
    });

    app.get('/user', async (req, res)=>{
        const user = await userCollection.find({}).toArray();
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("I am now in Softzino Server")
  });
app.listen(port, () => {
    console.log("Softzino listening at port ", port);
  
  })