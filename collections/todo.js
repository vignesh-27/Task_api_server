const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: String,
  priority: {
    type: Number,
    required: [true, "Priority is required"],
  },
  status: {
    type: Number,
    required: [true, "Status is required"],
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("todo", blogSchema);
