const dataSource = require("../../Infrastructure/postgres");
const purchasedCourseRepo = dataSource.getRepository('purchased_course');


const create = async (payload) => {
    const create = await purchasedCourseRepo.create(payload);
    const result = await purchasedCourseRepo.save(create);
    return result;
}

const findAll = async (filter) => {
    const result = await purchasedCourseRepo.find(filter);
    return result;
}

const findOneByFilter = async (filter) => {
    const result = await purchasedCourseRepo.findOne(filter);
    return result;
}

const deleteOne = async (filter) => {
    const result = await purchasedCourseRepo.delete(filter);
    return result;
}

module.exports = {
    create,
    findAll,
    findOneByFilter,
    deleteOne
}