const { DataSource } = require("typeorm");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { PinoLogger, logger } = require("../logger");

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: true,  
  logger: new PinoLogger(),
  entities: [path.join(__dirname, "../src/entities/**/*.js")],
});

module.exports = dataSource;
