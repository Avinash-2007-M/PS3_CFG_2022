const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    sessionNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    requiredForNextSession: { type: Boolean, default: true }
  },
  { timestamps: true }
);

sessionSchema.index({ courseId: 1, sessionNumber: 1 }, { unique: true });

module.exports = mongoose.model("Session", sessionSchema);
