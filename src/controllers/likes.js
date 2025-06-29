const {
  likePost,
  unlikePost,
  getPostLikes,
  hasUserLiked,
} = require("../models/like");
const logger = require("../utils/logger");

/**
 * Like a post
 */
const like = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    const alreadyLiked = await hasUserLiked(userId, postId);
    if (alreadyLiked) {
      return res.status(400).json({ error: "Post already liked" });
    }

    const like = await likePost(userId, postId);

    logger.verbose(`User ${userId} liked post ${postId}`);
    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    logger.critical("Like post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id);

    const success = await unlikePost(userId, postId);

    if (!success) {
      return res.status(404).json({ error: "Like not found" });
    }

    logger.verbose(`User ${userId} unliked post ${postId}`);
    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Unlike post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users who liked a post
 */
const getLikes = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id);
    const likes = await getPostLikes(postId);

    res.json({ likes, count: likes.length });
  } catch (error) {
    logger.critical("Get post likes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  like,
  unlike,
  getLikes,
};
