const dataSource = require("../../Infrastructure/postgres");
const Payment = require('../entities/Payment');

const paymentRepository = dataSource.getRepository("Payment");

module.exports = paymentRepository;
