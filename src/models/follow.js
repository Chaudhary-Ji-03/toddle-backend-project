const { query } = require("../utils/database");

/**
 * Follow model for managing user relationships
 */

// Follow a user
async function followUser(followerId, followingId) {
  const sql = `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await query(sql, [followerId, followingId]);
  return result.rows[0];
}

// Unfollow a user
async function unfollowUser(followerId, followingId) {
  const sql = `
    DELETE FROM follows 
    WHERE follower_id = $1 AND following_id = $2;
  `;
  await query(sql, [followerId, followingId]);
}

// Get list of users a user is following
async function getFollowing(userId) {
  const sql = `
    SELECT u.id, u.username, u.full_name
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
}

// Get list of followers for a user
async function getFollowers(userId) {
  const sql = `
    SELECT u.id, u.username, u.full_name
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
}

// Get follow stats (counts)
async function getFollowStats(userId) {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM follows WHERE follower_id = $1)   AS following,
      (SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers;
  `;
  const result = await query(sql, [userId]);
  return result.rows[0];
}

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowStats,
};
