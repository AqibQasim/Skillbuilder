const jwt = require("jsonwebtoken");
const { logger } = require("../../logger");

/**
 * Middleware to verify JWT tokens and extract user information
 * Works for any authenticated user (admin, instructor, student)
 */
async function verifyToken(request, reply) {
  try {
    // Get token from authorization header
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return reply.code(401).send({
        status: 401,
        message: "Authentication required",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request for use in route handlers
    request.user = decoded;

    logger.info("User authenticated", {
      userId: decoded.id,
      role: decoded.role || "unknown",
    });
  } catch (error) {
    logger.error("Token verification failed", { error: error.message });
    return reply.code(401).send({
      status: 401,
      message: "Invalid or expired token",
    });
  }
}

module.exports = verifyToken;
