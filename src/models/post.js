const { query } = require("../utils/database");

/**
 * Create a new post
 */
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
  scheduled_at = null,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, scheduled_at, is_published, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)
     RETURNING id, user_id, content, media_url, comments_enabled, scheduled_at, is_published, created_at`,
    [
      user_id,
      content,
      media_url,
      comments_enabled,
      scheduled_at,
      scheduled_at ? false : true, // Mark as unpublished if scheduled
    ]
  );
  return result.rows[0];
};

/**
 * Get post by ID
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = false AND p.is_published = true
`,
    [postId]
  );
  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows;
};


/**
 * Delete a post (soft delete)
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId]
  );
  return result.rowCount > 0;
};

/**
 * Get feed posts from followed users
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `
    SELECT p.*, u.username, u.full_name
    FROM posts p
    JOIN users u ON p.user_id = u.id
    JOIN follows f ON f.following_id = p.user_id
    WHERE p.id = $1 AND p.is_deleted = false AND p.is_published = true

    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset]
  );

  return result.rows;
};


/**
 * Update post content/media
 */
const updatePost = async (postId, userId, updates) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${index++}`);
    values.push(value);
  }

  values.push(postId);
  values.push(userId);

  const result = await query(
    `UPDATE posts SET ${fields.join(", ")} WHERE id = $${index++} AND user_id = $${index}
     RETURNING id, user_id, content, media_url, comments_enabled, created_at`,
    values
  );

  return result.rows[0] || null;
};

/**
 * Search posts by content
 */
const searchPosts = async (queryText, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE $1 AND is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${queryText}%`, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
  searchPosts,
};
