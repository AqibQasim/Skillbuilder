const fastify = require("fastify");
const dotenv = require("dotenv");
dotenv.config();
const dataSource = require("../Infrastructure/postgres");
const { logger } = require("../logger");
const { fastifyOptions } = require("../fastifyOpts");
const userRoutes = require("./routes/userRoutes");

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

  try {

    await dataSource
      .initialize()
      .then(async (conn) => {
        logger.info("Database connection has beed established ...");
        await app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
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
