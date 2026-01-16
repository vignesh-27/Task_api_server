var Todo = require("../collections/todo.js");
const initializeRedis = require("../middleware/redis.js");
const options = {
  EX: 21600, // 6h
  NX: false, // write the data even if the key already exist
};

module.exports = {
  findAll: async (req, res) => {
    const taskData = await initializeRedis.readData("getAllTask");

    if (taskData.length) {
      res.send(JSON.parse(taskData));
    } else {
      Todo.find({})
        .then((data) => {
          const taskData = JSON.stringify(data);
          initializeRedis.writeData("getAllTask", taskData, options);
          res.send(data);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  },

  create: (req, res) => {
    const reqData = req.body;
    const taskObj = new Todo(reqData);
    const err = taskObj.validateSync();
    if (err) {
      const custErr = err.errors[Object.keys(err.errors)];
      res.status(406).send(custErr.message);
    } else {
      taskObj["updatedAt"] = new Date();
      Todo.create(taskObj)
        .then((resData) => {
          initializeRedis.deleteData("getAllTask");
          res.send(resData);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  },

  update: (req, res) => {
    const reqData = req.body;
    const taskObj = new Todo(reqData);
    taskObj["updatedAt"] = new Date();
    const taskId = reqData?._id;
    const err = taskObj.validateSync();
    if (err) {
      const custErr = err.errors[Object.keys(err.errors)];
      res.status(406).send(custErr.message);
    } else {
      Todo.findOneAndUpdate({ _id: taskId }, taskObj)
        .then((resData) => {
          initializeRedis.deleteData("getAllTask");
          res.send(resData);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  },

  deleteTask: (req, res) => {
    const taskId = req.body?._id;
    Todo.findOneAndDelete({ _id: taskId })
      .then((deletedData) => {
        initializeRedis.deleteData("getAllTask");
        res.send(deletedData);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
