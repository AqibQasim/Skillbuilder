const dataSource = require("../../Infrastructure/postgres");
const Order = require('../entities/Order');

const orderRepository = dataSource.getRepository("Order");

module.exports = orderRepository;
