const logger = require("../utils/logger");
const followModel = require("../models/follow");
const { searchUsers } = require("../models/user");
const { getUserProfile } = require("../models/user");
const{updateUserProfile}=require("../models/user");


// Follow a user
async function follow(req, res) {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    await followModel.followUser(followerId, followingId);
    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    logger.error("Error in follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Unfollow a user
async function unfollow(req, res) {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    await followModel.unfollowUser(followerId, followingId);
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    logger.error("Error in unfollow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get users that I am following
async function getMyFollowing(req, res) {
  try {
    const userId = req.params.userId;
    const following = await followModel.getFollowing(userId);
    res.status(200).json(following);
  } catch (error) {
    logger.error("Error in getMyFollowing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get users that are following me
async function getMyFollowers(req, res) {
  try {
    const userId = req.params.userId;
    const followers = await followModel.getFollowers(userId);
    res.status(200).json(followers);
  } catch (error) {
    logger.error("Error in getMyFollowers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Optional: Get follow stats (counts)
async function getFollowStats(req, res) {
  try {
    const userId = req.params.userId;
    const stats = await followModel.getFollowStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    logger.error("Error in getFollowStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
//search user by name
const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const users = await searchUsers(query.trim());

    res.json({ users });
  } catch (error) {
    logger.critical("User search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// TODO: Implement getUserProfile function to fetch profile
const getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;

    const profile = await getUserProfile(parseInt(user_id));

    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profile });
  } catch (error) {
    logger.critical("Get user profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * Update user profile (PUT /api/users/profile)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, bio, profile_image } = req.validatedData;

    const updatedUser = await updateUserProfile(userId, {
      full_name,
      bio,
      profile_image,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.verbose(`User ${userId} updated profile`);
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    logger.critical("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
  search,
  getProfile,
  updateProfile
};

