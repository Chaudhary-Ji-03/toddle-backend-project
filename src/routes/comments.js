const express = require("express");
const { validateRequest } = require("../utils/validation");
const { authenticateToken, optionalAuth } = require("../middleware/auth");
const {
  create,
  getByPost,
  remove,
  edit
} = require("../controllers/comments");
const Joi = require("joi");

const router = express.Router();

/**
 * Validation schema for creating a comment
 */
const createCommentSchema = Joi.object({
  text: Joi.string().min(1).max(1000).required(),
});

/**
 * Comments routes
 */

// POST /api/comments/:post_id - Add a comment to a post
router.post(
  "/:post_id",
  authenticateToken,
  validateRequest(createCommentSchema),
  create
);

// GET /api/comments/:post_id - Get all comments for a post
router.get("/:post_id", optionalAuth, getByPost);

// DELETE /api/comments/:comment_id - Delete a comment
router.delete("/:comment_id", authenticateToken, remove);

//edit /api/comments/:comment_id- edit a comment
router.put("/:comment_id", authenticateToken, edit);


module.exports = router;
