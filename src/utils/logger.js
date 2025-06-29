// src/utils/logger.js

/**
 * Logging utility with different verbosity levels
 */

const LOG_LEVELS = {
  VERBOSE: "verbose",
  CRITICAL: "critical",
};

const currentLogLevel = process.env.LOG_LEVEL || LOG_LEVELS.VERBOSE;

/**
 * Log verbose messages (debug, info, etc.)
 */
function verbose(...args) {
  if (currentLogLevel === LOG_LEVELS.VERBOSE) {
    console.log("[VERBOSE]", new Date().toISOString(), ...args);
  }
}

/**
 * Log critical messages (errors, warnings, etc.)
 */
function critical(...args) {
  console.error("[CRITICAL]", new Date().toISOString(), ...args);
}

/**
 * Log error messages
 */
function error(...args) {
  console.error("[ERROR]", new Date().toISOString(), ...args);
}

module.exports = {
  verbose,
  critical,
  error,
  LOG_LEVELS,
};
