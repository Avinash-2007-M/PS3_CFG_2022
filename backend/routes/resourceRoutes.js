const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getResources } = require("../controllers/resourceController");

const router = express.Router();
router.use(requireAuth);
router.get("/resources", getResources);

module.exports = router;
