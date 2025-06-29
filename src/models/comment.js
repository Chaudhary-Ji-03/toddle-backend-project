const { query } = require("../utils/database");

/**
 * Create a new comment on a post
 */
const addComment =  async ({ user_id, post_id, text }) => {
  // Step 1: Check if comments are enabled for the post
  const postCheck = await query(
    `SELECT comments_enabled FROM posts WHERE id = $1 AND is_deleted = false`,
    [post_id]
  );

  if (postCheck.rows.length === 0) {
    throw new Error("Post not found");
  }

  if (!postCheck.rows[0].comments_enabled) {
    throw new Error("Comments are disabled for this post");
  }

  // Step 2: Insert the comment
  const result = await query(
    `INSERT INTO comments (user_id, post_id, text, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING id, user_id, post_id, text, created_at, updated_at`,
    [user_id, post_id, text]
  );

  return result.rows[0];
};

/**
 * Delete a comment by ID and user ID
 */
const deleteComment = async (commentId, userId) => {
  const result = await query(
    `DELETE FROM comments WHERE id = $1 AND user_id = $2`,
    [commentId, userId]
  );
  return result.rowCount > 0;
};

/**
 * Get all comments for a post
 */
const getCommentsByPostId = async (postId) => {
  const result = await query(
    `SELECT c.*, u.username FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return result.rows;
};
const updateComment = async (commentId, userId, newText) => {
  const result = await query(
    `UPDATE comments
     SET text = $1, updated_at = NOW()
     WHERE id = $2 AND user_id = $3
     RETURNING id, text, updated_at`,
    [newText, commentId, userId]
  );

  return result.rows[0] || null;
};


module.exports = {
  addComment,
  deleteComment,
  getCommentsByPostId,
  updateComment
};
