const jwt = require("jsonwebtoken");

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
    if (decoded.role !== "admin") {
      return reply.code(403).send({
        status: 403,
        message: "Only admins can access this route",
      });
    }

    // Add admin info to request for use in route handlers
    request.admin = decoded;
  } catch (error) {
    return reply.code(401).send({
      status: 401,
      message: "Invalid or expired token",
    });
  }
}

module.exports = adminAuth;
