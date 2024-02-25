const { DataSource } = require('typeorm');
const path = require('path');
const { configDotenv } = require('dotenv');
configDotenv();
const { PinoLogger, logger } = require('../logger');


const dataSource = new DataSource({
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: true,
  logger: new PinoLogger,
  entities: [path.join(__dirname, '../src/entities/**/*.js')],
  // migrations: [ "src/migration/**/*.js" ],
  // subscribers: [ "src/subscriber/**/*.js" ]
})

module.exports = dataSource;
