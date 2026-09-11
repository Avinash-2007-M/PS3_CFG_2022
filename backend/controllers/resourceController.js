const Resource = require("../models/Resource");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

const getResources = async (req, res, next) => {
  try {
    const course = await Course.findOne({ title: "Water Quality Management" });
    const progress = course ? await Progress.findOne({ userId: req.user._id, courseId: course._id }) : null;
    const completedSessions = progress?.completedSessions || 0;
    const resources = await Resource.find({ isActive: true }).sort({ requiredSession: 1, createdAt: 1 }).lean();
    const response = resources.map((resource) => {
      const unlocked = completedSessions >= resource.requiredSession;
      return unlocked ? { ...resource, unlocked } : { ...resource, unlocked, url: null };
    });
    res.json({ resources: response });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources };
