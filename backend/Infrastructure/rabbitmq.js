const amqp = require('amqplib');
const { logger } = require('../logger');

// using as static variable
let connection = null;
let channel = null;

let config = {
  username: process.env.RABBIT_USERNAME,
  password: process.env.RABBIT_PASSWORD,
  host: process.env.RABBIT_HOST,
  port: process.env.RABBIT_PORT
}

//  Initialize RabbitMQ
const initRabbit = async () => {
  logger.info("[waada > RabbitMQ > init > InitializinggetKeyValue...]");

  try {
    connection = await amqp.connect(`amqp://${config.username}:${config.password}@${config.host}:${config.port}`, { timeout: 2000 });
    channel = await connection.createChannel();

    logger.info("RabbitMQ Configuration:", {
      host: config.host,
      port: config.port,
      username: config.username,
    });


  } catch (error) {
    logger.error({ error: error }, "[waada > RabbitMQ > init > Unable to connect RabbitMQ > ERROR]");
  }

  return { channel, connection };
}

const createExchange = async (exchange, type, queue, routing_key, options) => {
  if (!_.includes(['direct', 'fanout', 'headers', 'topic'], type)) throw new Error(`invalid exchange type: ${type}`);

  if (!!channel) {
    // create exchange
    await channel.assertExchange(exchange, type, { durable: true });

    // create queue
    await channel.assertQueue(queue, options);

    // bind queue to exchange
    await channel.bindQueue(queue, exchange, routing_key);
  } else {
    logger.info("[waada > RabbitMQ > createExchange > channel not found]");
  }
}


//  Consume Message from Queue
const consume = async (q, cb, options) => {
  if (!!channel) {
    channel.assertQueue(q, options);
    channel.prefetch(1);

    channel.consume(q, (payload) => {
      cb(channel, payload, JSON.parse(payload.content.toString()));
    }, { noAck: false });
  } else {
    logger.info("[waada > RabbitMQ > consume > channel not found]");
  }
}


// Close RabbitMQ Connection
const close = async () => {
  connection.close();
}


// Create Exchange



// Publish Message on Exchange
const toExchange = async (exchange, routing_key, payload) => {
  if (!!channel) {
    await channel.publish(exchange, routing_key, new Buffer.from(JSON.stringify(payload)), { persistent: true, contentType: 'application/json' });
  } else {
    logger.info("[waada > RabbitMQ > sendToExchange > channel not found]");
  }
}


const getRabbitMQChannel = async () => {
  return channel;
}


const getRabbitMQConnection = async () => {
  return connection;
}

const purgeQueue = async (queueName) => {
  if (!!channel) {
    try {
      let clear = await channel.purgeQueue(queueName);
      console.log(clear);
      console.log(`Queue "${queueName}" purged successfully.`);
      return `Queue "${queueName}" purged successfully.`;
      
    } catch (error) {
      console.log(error);
    }

  } else {
    logger.info("[waada > RabbitMQ > createExchange > channel not found]");
  }
}

module.exports = {
  initRabbit,
  close,
  send,
  consume,
  toExchange,
  createExchange,
  getRabbitMQChannel,
  getRabbitMQConnection,
  purgeQueue
};



