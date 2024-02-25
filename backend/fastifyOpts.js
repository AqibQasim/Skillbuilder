const logger = require('./logger');


const fastifyOptions = {
    bodyLimit: (100 * 1024 * 1024 ),// 100MB
    logger: {
        level: 30,
        formatter: logger,
        serializers: {
            res(res) {
                return {
                    code: res.code,
                    body: res.body
                }
            },
            req(req) {
                return {
                    method: req.method,
                    url: req.url,
                    path: req.path,
                    parameters: req.parameters,
                    headers: req.headers
                }
            }
        }
    }
};

module.exports = {fastifyOptions};