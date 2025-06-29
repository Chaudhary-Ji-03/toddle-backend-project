const express = require("express");
const {
  validateRequest,
  createPostSchema,
  updatePostSchema,
} = require("../utils/validation");
const {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  update,
  search,
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Create a new post
router.post("/", authenticateToken, validateRequest(createPostSchema), create);

// Get posts of current user
router.get("/my", authenticateToken, getMyPosts);

// Get feed posts from followed users
router.get("/feed", authenticateToken, getFeed);

// Search posts
router.get("/search", optionalAuth, search);

// Get a single post by ID
router.get("/:post_id", optionalAuth, getById);

// Get posts by a specific user
router.get("/user/:user_id", optionalAuth, getUserPosts);

// Update a post
router.put(
  "/:post_id",
  authenticateToken,
  validateRequest(updatePostSchema),
  update
);

// Delete a post
router.delete("/:post_id", authenticateToken, remove);

module.exports = router;
