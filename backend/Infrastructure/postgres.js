const { DataSource } = require("typeorm");
const path = require("path");
const { configDotenv } = require("dotenv");
configDotenv();
const { PinoLogger, logger } = require("../logger");

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "dxtx998",
  database: process.env.DATABASE || "postgres",
  synchronize: true,
  logging: true,
  logger: new PinoLogger(),
  entities: [path.join(__dirname, "../src/entities/**/*.js")],
  // migrations: [ "src/migration/**/*.js" ],
  // subscribers: [ "src/subscriber/**/*.js" ]
});

module.exports = dataSource;
