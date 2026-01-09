const express = require("express");
const cors = require("cors");
const taskCollection = require("./Models/task.js");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

const initializeRedis = require("./middleware/redis.js");

app.use(express.json());

app.use(cors());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/task-board");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

initializeRedis.initializeRedisClient();

app.post("/createTask", (req, res) => {
  taskCollection.create(req, res);
});

app.get("/api/findTask", (req, res) => {
  taskCollection.findAll(req, res);
});

app.patch("/updateTask", (req, res) => {
  taskCollection.update(req, res);
});

app.post("/deleteTask", (req, res) => {
  taskCollection.deleteTask(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
