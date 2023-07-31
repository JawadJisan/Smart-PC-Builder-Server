require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("Smart-PC_Builder");
    const productCollection = db.collection("products");
    const categoryCollection = db.collection("categories");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({}).sort({ publicationDate: -1 });
      const products = await cursor.toArray();

      res.send({ status: true, data: products });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const products = await productCollection.findOne({ _id: ObjectId(id) });

      res.send({ status: true, data: products });
    });

    app.get("/categories", async (req, res) => {
      const cursor = categoryCollection.find({}).sort({ publicationDate: -1 });
      const categories = await cursor.toArray();

      res.send({ status: true, data: categories });
    });

    app.get("/productsByCategory/:category", async (req, res) => {
      const category = req.params.category;
      const cursor = productCollection
        .find({ category })
        .sort({ publicationDate: -1 });
      const products = await cursor.toArray();

      res.send({ status: true, data: products });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! From Smart Pc Builder Server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
