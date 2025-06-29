const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { like, unlike, getLikes } = require("../controllers/likes");

const router = express.Router();

/**
 * Likes Routes
 */

// Like a post
// POST /api/likes/:post_id
router.post("/:post_id", authenticateToken, like);

// Unlike a post
// DELETE /api/likes/:post_id
router.delete("/:post_id", authenticateToken, unlike);

// Get users who liked a post
// GET /api/likes/:post_id
router.get("/:post_id", getLikes);

module.exports = router;
