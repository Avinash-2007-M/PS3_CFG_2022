const mongoose = require("mongoose");

const sessionAttestationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, index: true },
    attendanceConfirmed: { type: Boolean, default: false },
    completionConfirmed: { type: Boolean, default: false },
    trainerVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    startedAt: Date,
    completedAt: Date,
    verifiedAt: Date
  },
  { timestamps: true }
);

sessionAttestationSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model("SessionAttestation", sessionAttestationSchema);
