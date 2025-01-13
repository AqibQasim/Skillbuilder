const { fastify } = require("fastify");
const dotenv = require("dotenv");
dotenv.config();
const { default: fastifySecureSession } = require("@fastify/secure-session");
const fs = require("fs");
const path = require("path");
const fastifyPassport = require("@fastify/passport");
const dataSource = require("../Infrastructure/postgres");
const { logger } = require("../logger");
const { fastifyOptions } = require("../fastifyOpts");
const userRoutes = require("./routes/userRoutes");
const coursesRoutes = require("./routes/coursesRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const uploadOnS3Routes = require("./routes/s3Route");
const ytRoutes = require("../src/routes/youtubeAPIroutes");
const { authUrl } = require("../Infrastructure/youtubeConfig");
const purchsedCoursesRoutes = require("./routes/purchasedCourseRoutes");
const { lockStatusRoutes } = require("./routes/lockStatusRoutes");
const { notificationRoutes } = require("./routes/notificationRoutes");
require("./Authentication/googleAuth");
const fastifyMultipart = require('@fastify/multipart');
const searchRoutes = require("./routes/searchRoute");
const paymentRoutes = require("./routes/paymentRoutes");


const startServer = async () => {
  const app = fastify(fastifyOptions);

  console.log("authURL:", authUrl);

  app.register(require("@fastify/cors"), {
    origin: "*",
    // origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  });

  app.register(fastifySecureSession, {
    cookieName: "key",
    key: fs.readFileSync(path.join(__dirname, "secret-key")),
    cookie: {
      path: "/",
    },
  });

  const course_path = path.join(__dirname, "..", "media", "images", "course");
  if (!fs.existsSync(course_path)) {
    // Create the directory if it does not exist
    fs.mkdirSync(course_path, { recursive: true });
  }

  const profile_path = path.join(__dirname, "..", "media", "images", "profile");
  if (!fs.existsSync(profile_path)) {
    // Create the directory if it does not exist
    fs.mkdirSync(profile_path, { recursive: true });
  }

  // Register the static file server for courses
  app.register(require("@fastify/static"), {
    root: course_path,
    prefix: "/v1/media/course/", // URL prefix for course images
  });

  // Register the static file server for profiles
  app.register(require("@fastify/static"), {
    root: profile_path,
    prefix: "/v1/media/profile/", // URL prefix for profile images
    decorateReply: false, // Avoid adding `sendFile` decorator
  });

  app.register(fastifyMultipart, {
    limits: {
      files: 7,
      fileSize: 150 * 1024 * 1024, // Set file size limit to 150MB
    }
  })

  // app.register(require('fastify-multipart'));
  app.register(fastifyPassport.default.initialize());
  app.register(fastifyPassport.default.secureSession());
  //app.register(require("@fastify/multipart"));
  // app.register(require('fastify-multer'))
  app.register(require("@fastify/swagger"));
  app.register(require("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  app.get("/", async (req, res) => {
    const result = {
      code: 200,
      status: "OK",
      message: "Fastify server is running ",
    };
    res.send(result);
  });

  // Register all routes under the /v1 prefix
  app.register(userRoutes, { prefix: "/v1" });
  app.register(coursesRoutes, { prefix: "/v1" });
  app.register(instructorRoutes, { prefix: "/v1" });
  app.register(uploadOnS3Routes, { prefix: "/v1" });
  app.register(ytRoutes, { prefix: "/v1" });
  app.register(purchsedCoursesRoutes, { prefix: "/v1" });
  app.register(lockStatusRoutes, { prefix: "/v1" });
  app.register(notificationRoutes, { prefix: "/v1" });
  app.register(searchRoutes,{prefix:"/v1"})
  app.register(paymentRoutes,{prefix: '/v1'})

  try {
    await dataSource
      .initialize()
      .then(async (conn) => {
        logger.info("Database connection has beed established ...");
        console.log("variable testing>", process.env.S3_URL);
        await app.listen(process.env.SERVER_PORT, "0.0.0.0", (err) => {
          err ? logger.error(err) : "";
          logger.info(
            `Server is Listening on port ${process.env.SERVER_PORT} and environment is ${process.env.NODE_ENV}`
          );
        });
      })
      .catch((error) => {
        logger.error(error);
      });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

module.exports = startServer;
