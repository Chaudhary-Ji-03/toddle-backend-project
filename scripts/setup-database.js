require("dotenv").config();
const { Pool } = require("pg");
// const logger = require("./logger");

let pool;

/**
 * Initialize database connection pool (Supabase-compatible)
 * @returns {Pool} PostgreSQL connection pool
 */
const setupDatabase = async () => {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL
	});

	try {
		console.log("Setting up database...");

		// Test connection first
		const client = await pool.connect();
		console.log("Database connected successfully!");
		client.release();

		// Read and execute schema file
		const fs = require("fs");
		const path = require("path");

		const schemaPath = path.join(__dirname, "../sql/schema.sql");
		
		// Check if schema file exists
		if (!fs.existsSync(schemaPath)) {
			console.log("Schema file not found, skipping schema creation");
			return;
		}

		const schemaSQL = fs.readFileSync(schemaPath, "utf8");
		await pool.query(schemaSQL);
		console.log("Database schema created successfully");

		console.log("Database setup completed successfully!");
	} catch (error) {
		console.error("Database setup failed!", error);
		console.error("Error details:", error.message);
		process.exit(1);
	} finally {
		await pool.end();
	}
};

// /**
//  * Connect to the database and test connection
//  */
// const connectDB = async () => {
// 	try {
// 		const dbPool = initializePool();
// 		const client = await dbPool.connect();
// 		logger.verbose("✅ Connected to Supabase PostgreSQL database");
// 		client.release();
// 	} catch (error) {
// 		logger.critical("❌ Failed to connect to Supabase database:", error);
// 		throw error;
// 	}
// };

// /**
//  * Execute a database query
//  * @param {string} text - SQL query string
//  * @param {Array} params - Query parameters
//  * @returns {Promise<Object>} Query result
//  */
// const query = async (text, params = []) => {
// 	const dbPool = initializePool();
// 	const start = Date.now();

// 	try {
// 		const result = await dbPool.query(text, params);
// 		const duration = Date.now() - start;
// 		logger.verbose("Executed query", {
// 			text,
// 			duration,
// 			rows: result.rowCount,
// 		});
// 		return result;
// 	} catch (error) {
// 		logger.critical("Database query error:", error);
// 		throw error;
// 	}
// };

// /**
//  * Get a database client for transactions
//  * @returns {Promise<Object>} Database client
//  */
// const getClient = async () => {
// 	const dbPool = initializePool();
// 	return await dbPool.connect();
// };

if(require.main===module){
	setupDatabase();
}

module.exports = {
	// connectDB,
	// query,
	// getClient,
	setupDatabase
};
