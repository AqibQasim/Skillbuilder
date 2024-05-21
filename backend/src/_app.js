const { fastify } = require("fastify");
const dotenv = require("dotenv");
dotenv.config();
const { default: fastifySecureSession } = require('@fastify/secure-session')
const fs = require('fs');
const path = require("path");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const multipart = require('@fastify/multipart');
const fastifyPassport = require("@fastify/passport");
const dataSource = require("../Infrastructure/postgres");
const { logger } = require("../logger");
const { fastifyOptions } = require("../fastifyOpts");
const userRoutes = require("./routes/userRoutes");
const coursesRoutes = require("./routes/coursesRoutes");
const instructorRoutes = require("./routes/instructorRoutes")
require('./Authentication/googleAuth');
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')


const startServer = async () => {
  const app = fastify(fastifyOptions);

  app.register(require("@fastify/cors"), {
    origin: "http://localhost:3000:"
  });
  app.register(fastifySecureSession, {
    cookieName: 'key',
    key: fs.readFileSync(path.join(__dirname, 'secret-key')),
    cookie: {
      path: '/'
    }
  });
  app.register(fastifyPassport.default.initialize())
  app.register(fastifyPassport.default.secureSession())
  app.register(require('fastify-multipart'), {
    addToBody: true,
  });

  app.get("/", async (req, res) => {
    const result = {
      code: 200,
      status: "OK",
      message: "Fastify server is running ",
    };
    res.send(result);
  });


  app.register(userRoutes);
  app.register(coursesRoutes);
  app.register(instructorRoutes)


  // payment stripe routes
  app.register(orderRoutes)
  app.register(paymentRoutes)

  try {

    await dataSource
      .initialize()
      .then(async (conn) => {
        logger.info("Database connection has beed established ...");
        console.log("variable testing>", process.env.S3_URL);
        await app.listen(process.env.SERVER_PORT, '0.0.0.0', (err) => {
          err ? logger.error(err) : '';
          logger.info(`Server is Listening on port ${process.env.SERVER_PORT} and environment is ${process.env.NODE_ENV}`);
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
