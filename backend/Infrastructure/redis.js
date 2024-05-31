const redis = require('redis');

const redisConfig = {
    host: 'localhost',
    port: 6379,
    // password: '', If password
};

const redisClient = redis.createClient(redisConfig);

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

redisClient.connect();

module.exports = { redisClient };