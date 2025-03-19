const jwt = require("jsonwebtoken");
const { logger } = require("../../logger");

async function adminAuth(request, reply) {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return reply.code(401).send({
        status: 401,
        message: "Admin authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Admin token decoded", {
      adminId: decoded.id,
      role: decoded.role,
      decodedToken: JSON.stringify(decoded),
    });

    if (decoded.role !== "admin") {
      logger.warn("Non-admin tried to access admin route", {
        role: decoded.role,
        userId: decoded.id,
      });
      return reply.code(403).send({
        status: 403,
        message: "Only admins can access this route",
      });
    }

    // Add admin info to request for use in route handlers
    request.admin = decoded;

    // Also add to user property for compatibility with controllers that expect request.user
    request.user = {
      ...decoded,
      // Make sure these fields are explicitly set
      id: decoded.id,
      role: "admin",
    };

    logger.info("Admin authenticated", {
      adminId: decoded.id,
    });
  } catch (error) {
    logger.error("Admin authentication error", { error: error.message });
    return reply.code(401).send({
      status: 401,
      message: "Invalid or expired token",
    });
  }
}

module.exports = adminAuth;
