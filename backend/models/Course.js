const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    totalSessions: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
