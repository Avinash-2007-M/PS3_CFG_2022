const express = require("express");
const { requireAuth, allowRoles } = require("../middleware/auth");
const { getProgress, startSession, completeSession } = require("../controllers/progressController");

const router = express.Router();
router.use(requireAuth, allowRoles("wqc"));
router.get("/progress", getProgress);
router.post("/sessions/:id/start", startSession);
router.post("/sessions/:id/complete", completeSession);

module.exports = router;
