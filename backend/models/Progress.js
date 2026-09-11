const mongoose = require("mongoose");

const sessionProgressSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    status: { type: String, enum: ["locked", "available", "in-progress", "completed"], required: true },
    startedAt: Date,
    completedAt: Date
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    completedSessions: { type: Number, default: 0, min: 0 },
    currentSession: { type: Number, default: 1, min: 1 },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    sessionProgress: { type: [sessionProgressSchema], default: [] }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
