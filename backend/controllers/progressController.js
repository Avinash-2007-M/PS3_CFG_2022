const Course = require("../models/Course");
const Session = require("../models/Session");
const Progress = require("../models/Progress");
const SessionAttestation = require("../models/SessionAttestation");

const getWqmCourse = () => Course.findOne({ title: "Water Quality Management" });

const buildInitialProgress = (userId, course, sessions) => ({
  userId,
  courseId: course._id,
  completedSessions: 0,
  currentSession: 1,
  progressPercentage: 0,
  sessionProgress: sessions.map((session, index) => ({
    sessionId: session._id,
    status: index === 0 ? "available" : "locked"
  }))
});

const getOrCreateProgress = async (userId, course, sessions) => {
  let progress = await Progress.findOne({ userId, courseId: course._id });
  if (!progress) {
    progress = await Progress.create(buildInitialProgress(userId, course, sessions));
  }
  return progress;
};

const getProgress = async (req, res, next) => {
  try {
    const course = await getWqmCourse();
    if (!course) return res.status(404).json({ message: "The WQM course has not been seeded yet." });
    const sessions = await Session.find({ courseId: course._id }).sort({ sessionNumber: 1 }).lean();
    const progress = await getOrCreateProgress(req.user._id, course, sessions);
    res.json({ course, progress, sessions });
  } catch (error) {
    next(error);
  }
};

const getSessionProgress = (progress, sessionId) => progress.sessionProgress.find((item) => item.sessionId.toString() === sessionId.toString());

const updateProgressAfterCompletion = (progress, sessions, session) => {
  const completedSessions = progress.sessionProgress.filter((item) => item.status === "completed").length;
  progress.completedSessions = completedSessions;
  progress.progressPercentage = Math.round((completedSessions / sessions.length) * 100);
  progress.currentSession = Math.min(session.sessionNumber + 1, sessions.length);
  const nextSession = sessions.find((item) => item.sessionNumber === session.sessionNumber + 1);
  if (nextSession) {
    const nextProgress = getSessionProgress(progress, nextSession._id);
    if (nextProgress && nextProgress.status === "locked") nextProgress.status = "available";
  }
};

const startSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found." });
    const course = await Course.findById(session.courseId);
    const sessions = await Session.find({ courseId: course._id }).sort({ sessionNumber: 1 });
    const progress = await getOrCreateProgress(req.user._id, course, sessions);
    const sessionState = getSessionProgress(progress, session._id);

    if (!sessionState || !["available", "in-progress"].includes(sessionState.status)) {
      return res.status(403).json({ message: "This session is locked. Complete the previous session first." });
    }

    if (sessionState.status === "available") {
      sessionState.status = "in-progress";
      sessionState.startedAt = new Date();
      progress.markModified("sessionProgress");
      await progress.save();
    }

    const attestation = await SessionAttestation.findOneAndUpdate(
      { userId: req.user._id, sessionId: session._id },
      { $setOnInsert: { userId: req.user._id, sessionId: session._id }, $set: { startedAt: sessionState.startedAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ session, progress, attestation });
  } catch (error) {
    next(error);
  }
};

const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found." });
    const course = await Course.findById(session.courseId);
    const sessions = await Session.find({ courseId: course._id }).sort({ sessionNumber: 1 });
    const progress = await getOrCreateProgress(req.user._id, course, sessions);
    const sessionState = getSessionProgress(progress, session._id);
    const attestation = await SessionAttestation.findOne({ userId: req.user._id, sessionId: session._id });

    if (!sessionState || sessionState.status !== "in-progress") {
      return res.status(403).json({ message: "Start this session before completing it." });
    }
    if (!attestation?.attendanceConfirmed || !attestation.completionConfirmed) {
      return res.status(400).json({ message: "Confirm attendance and completion before finishing this session." });
    }

    sessionState.status = "completed";
    sessionState.completedAt = new Date();
    updateProgressAfterCompletion(progress, sessions, session);
    progress.markModified("sessionProgress");
    await progress.save();
    await SessionAttestation.findByIdAndUpdate(attestation._id, { completedAt: sessionState.completedAt });
    res.json({ message: "Session completed.", progress });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress, startSession, completeSession, getWqmCourse, getOrCreateProgress, getSessionProgress };
