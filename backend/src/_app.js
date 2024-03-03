const fastify = require("fastify");
const dotenv = require("dotenv");
dotenv.config();
const dataSource = require("../Infrastructure/postgres");
const { logger } = require("../logger");
const { fastifyOptions } = require("../fastifyOpts");
const userRoutes = require("./routes/userRoutes");
const {client} = require("../Infrastructure/redis")
// const Validation=require('./Schema/userSchema')

const startServer = async () => {
  const app = fastify(fastifyOptions);

  app.get("/", async (req, res) => {
    const result = {
      code: 200,
      status: "OK",
      message: "Fastify server is running ",
    };
    res.send(result);
  });

  app.register(userRoutes);
  // app.register(Validation)

  try {
    await app.listen(process.env.SERVER_PORT || 4000);

    await dataSource
    .initialize()
    .then((conn) => {
      logger.info("Database connection has beed established ...");
      })
      .catch((error) => {
        logger.error(error);
      });
    logger.info(`Server is Listening on ${process.env.NODE_ENV}`);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

module.exports = startServer;
