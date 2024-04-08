const startServer = require('./src/_app');
startServer();


// const { default: fastify } = require("fastify");
// const { default: fastifySecureSession } = require('@fastify/secure-session')
// const {default: fastifyPassport} = require("@fastify/passport");

// const fs = require('fs');
// const path = require("path");


// const server = fastify({logger:true})
// server.register(fastifySecureSession, {
//     key: fs.readFileSync(path.join(__dirname, '/src/secret-key'))
// })

// server.register(fastifyPassport.initialize());
// server.register(fastifyPassport.secureSession())


// server.listen('2000', '127.0.0.1', (err) => {
//     console.log(err);
//     console.log('server is running');
// })
