const {
  addComment,
  deleteComment,
  getCommentsByPostId,
  updateComment
} = require("../models/comment");
const {getPostById} = require("../models/post");
const logger = require("../utils/logger");

/**
 * Add a comment to a post
 */
const create = async (req, res) => {
  try {
    const { text } = req.validatedData;
    const userId = req.user.id;
    const postId = parseInt(req.params.post_id); // 🔁 Get post_id from URL param

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.comments_enabled) {
      return res.status(403).json({ error: "Comments are disabled for this post" });
    }

    const comment = await addComment({ user_id: userId, post_id: postId, text });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    logger.critical("Create comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all comments for a post
 */
const getByPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const comments = await getCommentsByPostId(parseInt(post_id));

    res.status(200).json({ comments });
  } catch (error) {
    logger.critical("Get comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a comment
 */
const remove = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const userId = req.user.id;

    const success = await deleteComment(parseInt(comment_id), userId);

    if (!success) {
      return res.status(403).json({ error: "Unauthorized or comment not found" });
    }

    logger.verbose(`User ${userId} deleted comment ${comment_id}`);

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    logger.critical("Delete comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//logic to edit the comment
const edit = async (req, res) => {
  console.log("inside the comment section");
  try {
    const { comment_id } = req.params;
    const userId = req.user.id;
    const { text } = req.body;
console.log("comment_id: ",comment_id,"userId: ",userId,"text: ",text);
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text cannot be empty" });
    }

    const updated = await updateComment(parseInt(comment_id), userId, text);
console.log(updated);
    if (!updated) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }
    res.json({ message: "Comment updated", comment: updated });
   }catch (error) {
    logger.critical("Update comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getByPost,
  remove,
  edit
};
