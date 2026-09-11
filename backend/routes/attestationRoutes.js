const express = require("express");
const { requireAuth, allowRoles } = require("../middleware/auth");
const { confirmAttendance, confirmCompletion, getAttestations } = require("../controllers/attestationController");

const router = express.Router();
router.use(requireAuth, allowRoles("wqc"));
router.get("/attestations", getAttestations);
router.post("/attestations/:sessionId/attendance", confirmAttendance);
router.post("/attestations/:sessionId/completion", confirmCompletion);

module.exports = router;
