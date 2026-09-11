const Session = require("../models/Session");
const SessionAttestation = require("../models/SessionAttestation");

const confirmAttendance = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found." });
    const attestation = await SessionAttestation.findOneAndUpdate(
      { userId: req.user._id, sessionId: session._id },
      { $set: { attendanceConfirmed: true, startedAt: new Date() }, $setOnInsert: { userId: req.user._id, sessionId: session._id } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ attestation });
  } catch (error) {
    next(error);
  }
};

const confirmCompletion = async (req, res, next) => {
  try {
    const attestation = await SessionAttestation.findOneAndUpdate(
      { userId: req.user._id, sessionId: req.params.sessionId },
      { $set: { completionConfirmed: true } },
      { new: true }
    );
    if (!attestation) return res.status(400).json({ message: "Start the session and confirm attendance first." });
    res.json({ attestation });
  } catch (error) {
    next(error);
  }
};

const getAttestations = async (req, res, next) => {
  try {
    const attestations = await SessionAttestation.find({ userId: req.user._id }).populate("sessionId").sort({ createdAt: -1 });
    res.json({ attestations });
  } catch (error) {
    next(error);
  }
};

module.exports = { confirmAttendance, confirmCompletion, getAttestations };
