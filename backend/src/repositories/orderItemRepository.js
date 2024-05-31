const dataSource = require("../../Infrastructure/postgres");
const OrderItem = require('../entities/OrderItem');

const  orderItemRepository = dataSource.getRepository("OrderItem");

module.exports = orderItemRepository;
