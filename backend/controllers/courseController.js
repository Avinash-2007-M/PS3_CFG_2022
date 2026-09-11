const Course = require("../models/Course");
const Session = require("../models/Session");

const getCourses = async (_req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: 1 }).lean();
    res.json({ courses });
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ message: "Course not found." });
    const sessions = await Session.find({ courseId: course._id }).sort({ sessionNumber: 1 }).lean();
    res.json({ course, sessions });
  } catch (error) {
    next(error);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const filter = req.query.courseId ? { courseId: req.query.courseId } : {};
    const sessions = await Session.find(filter).sort({ sessionNumber: 1 }).lean();
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).lean();
    if (!session) return res.status(404).json({ message: "Session not found." });
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourse, getSessions, getSession };
