const dataSource = require("../../Infrastructure/postgres");
const { logger } = require("../../logger");
const courseModuleRepo = dataSource.getRepository("content_module");
const courseContentRepo = dataSource.getRepository("course_content");

const createContentModule = async (payload) => {
    try {
        const create = courseModuleRepo.create(payload);
        const save = await courseModuleRepo.save(create);
        return save;
    } catch (error) {
        logger.error("src > repositories > courseContentRepository")
        throw new Error(error.message)
    }
};


const postCourseContent = async (payload) => {
    try {
        const create = courseContentRepo.create(payload);
        const save = courseContentRepo.save(create);
        return save;
    } catch (error) {
        logger.error("src > repositories > courseContentRepository")
        throw new Error(error.message)
    }
}

module.exports = {
    createContentModule,
    postCourseContent
}