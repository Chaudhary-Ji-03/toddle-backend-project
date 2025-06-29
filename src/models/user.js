const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * User model for database operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name],

  );

  return result.rows[0];
};

/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} User object or null
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// TODO: Implement findUsersByName function for search functionality
const searchUsers = async (searchQuery) => {
  const result = await query(
    `SELECT id, username, full_name FROM users 
     WHERE username ILIKE $1 OR full_name ILIKE $1
     LIMIT 20`,
    [`%${searchQuery}%`]
  );
  return result.rows;
};
// This should support partial name matching and pagination

const getUserProfile = async (userId) => {
  const result = await query(
    `
    SELECT 
      u.id, u.username, u.full_name, u.created_at,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers_count
    FROM users u
    WHERE u.id = $1
    `,
    [userId]
  );

  return result.rows[0] || null;
};

const updateUserProfile = async (userId, { full_name, bio, profile_image }) => {
  const result = await query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         bio = COALESCE($2, bio),
         profile_image = COALESCE($3, profile_image)
     WHERE id = $4
     RETURNING id, username, email, full_name, bio, profile_image, updated_at`,
    [full_name, bio, profile_image, userId]
  );

  return result.rows[0] || null;
};
module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  searchUsers,
  getUserProfile,
  updateUserProfile
};
