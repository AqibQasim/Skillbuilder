const fastify = require('fastify');
const dataSource = require('../Infrastructure/postgres');
const { logger } = require('../logger');
const { fastifyOptions } = require('../fastifyOpts');
const dotenv = require('dotenv');
const instructorRoutes = require('./routes/instructorRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userRoutes =require('./routes/userRoutes');
dotenv.config();

const startServer = async () => {
    const app = fastify(fastifyOptions);

    app.get('/', async (req, res) => {
        const result = { 
            code: 200,
            status: 'OK',
            message: 'Fastify server is running '
        }
        res.send(result)
    })
    const PORT=6000;
    app.register(instructorRoutes);
    app.register(skillsRoutes);
    app.register(userRoutes);

    try {
        await app.listen(PORT);
        await dataSource.initialize()
        .then((conn) => {
          logger.info("Database connection has beed established ...");
        })
        .catch(error => {
          logger.error(error);
        })
        logger.info(`Server is Listening on ${process.env.NODE_ENV}`)

    } catch (error) {
        logger.error(error.message);
        process.exit(1);
    }
};

module.exports = startServer;


