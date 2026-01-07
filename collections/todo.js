const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: String,
  priority: {
    type: String,
    required: [true, "Priority is required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
  },
});

module.exports = mongoose.model("todo", blogSchema);
