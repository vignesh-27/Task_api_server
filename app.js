const express = require("express");
const taskCollection = require("./Models/task.js");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

const initializeRedis = require("./middleware/redis.js");

app.use(express.json());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/task-board");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

initializeRedis.initializeRedisClient();

app.get("/createTask", (req, res) => {
  taskCollection.create(app, req, res);
});

app.get("/findTask", (req, res) => {
  taskCollection.findAll(app, req, res);
});

app.get("/updateTask", (req, res) => {
  taskCollection.update(app, req, res);
});

app.get("/deleteTask", (req, res) => {
  taskCollection.deleteTask(app, req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
