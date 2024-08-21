const dataSource = require("../../Infrastructure/postgres");
const Payment = require('../entities/Payment');

const paymentRepository = dataSource.getRepository("Payment");

const createPayment = async (payload) => {
    const create = await paymentRepository.create(payload);
    const result = await paymentRepository.save(create);
    return result;
  };

module.exports = {
    createPayment,
    paymentRepository
};
