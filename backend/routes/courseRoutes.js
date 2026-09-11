const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getCourses, getCourse, getSessions, getSession } = require("../controllers/courseController");

const router = express.Router();
router.use(requireAuth);
router.get("/courses", getCourses);
router.get("/courses/:id", getCourse);
router.get("/sessions", getSessions);
router.get("/sessions/:id", getSession);

module.exports = router;
