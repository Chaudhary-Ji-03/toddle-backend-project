const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const usersController = require("../controllers/users");
const { search } = require("../controllers/users");
const { getProfile } = require("../controllers/users");
const { updateProfile } = require("../controllers/users");
const { validateRequest, updateUserProfileSchema } = require("../utils/validation");



const router = express.Router();

/**
 * User-related routes
 */

// PUT /api/users/profile to update the user-profile
router.put("/profile", authenticateToken, validateRequest(updateUserProfileSchema), updateProfile);

//search user by name
router.get('/search',search);

// GET /api/users/:user_id/profile
router.get("/:user_id/profile", getProfile);

// Follow a user
// POST /api/users/:userId/follow
router.post(
  "/:userId/follow",
  authenticateToken,
  usersController.follow
);

// Unfollow a user
// DELETE /api/users/:userId/unfollow
router.delete(
  "/:userId/unfollow",
  authenticateToken,
  usersController.unfollow
);

// Get users that the current user is following
// GET /api/users/:userId/following
router.get(
  "/:userId/following",
  usersController.getMyFollowing
);

// Get users that follow the current user
// GET /api/users/:userId/followers
router.get(
  "/:userId/followers",
  usersController.getMyFollowers
);

// Get follow counts (followers & following)
// GET /api/users/:userId/follow-stats
router.get(
  "/:userId/follow-stats",
  usersController.getFollowStats
);

module.exports = router;

