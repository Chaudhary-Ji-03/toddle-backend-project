const Joi = require("joi");

/**
 * Validation schemas for API endpoints
 */

//update profile schema
const updateUserProfileSchema = Joi.object({
  full_name: Joi.string().min(1).max(100).optional(),
  bio: Joi.string().max(300).optional(),
  profile_image: Joi.string().uri().optional(),
});

// User registration schema
const userRegistrationSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	full_name: Joi.string().min(1).max(100).required(),
});

// User login schema
const userLoginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

// Create post schema
const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  media_url: Joi.string().uri().optional(),
  comments_enabled: Joi.boolean().default(true),
  scheduled_at: Joi.date().greater('now').optional(), // only allow future time
});

// Update post schema
const updatePostSchema = Joi.object({
	content: Joi.string().min(1).max(1000).optional(),
	media_url: Joi.string().uri().optional(),
	comments_enabled: Joi.boolean().optional(),
});

// Search query schema (for query params)
const searchQuerySchema = Joi.object({
	query: Joi.string().min(1).max(100).required(),
});

/**
 * Middleware to validate request body against schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body);

		if (error) {
			return res.status(400).json({
				error: "Validation failed",
				details: error.details.map((detail) => detail.message),
			});
		}

		req.validatedData = value;
		next();
	};
};

module.exports = {
	userRegistrationSchema,
	userLoginSchema,
	createPostSchema,
	updatePostSchema,
	searchQuerySchema,
	validateRequest,
	updateUserProfileSchema
};
