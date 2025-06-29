const { query } = require("../utils/database");

async function likePost(userId, postId) {
  const result = await query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [userId, postId]
  );
  return result.rows[0];
}

async function unlikePost(userId, postId) {
  const result = await query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
}

async function getPostLikes(postId) {
  const result = await query(
    `SELECT users.id, users.username, users.full_name
     FROM likes
     JOIN users ON likes.user_id = users.id
     WHERE likes.post_id = $1`,
    [postId]
  );
  return result.rows;
}

async function hasUserLiked(userId, postId) {
  const result = await query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return result.rowCount > 0;
}

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  hasUserLiked,
};
