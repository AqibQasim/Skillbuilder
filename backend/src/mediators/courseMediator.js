const { logger } = require("../../logger");
const { createContentModule, postCourseContent } = require("../repositories/courseContentRepository");

const createCourseContent = async (modules, course_id) => {
  try {
    for (const mod of modules) {
      logger.info(mod);
      // const {module, title, content} = mod;
      const courseModulePayload = {
        title: mod.title,
        course_id: course_id,
      };
      const moduleCreate = await createContentModule(courseModulePayload);
      console.log("created module: ", moduleCreate);
      console.log("content:", mod.content)
      for (const content of mod.content) {
        let contentPayload = {
          module_id: moduleCreate.id,
          lock_status: content.lock_status,
          duration: content.duration,
          title: content.title,
          content: content.content,
          content_type: content.content_type,
          order: content.order,
        };
        const contentCreate = await postCourseContent(contentPayload);
        console.log("created module: ", contentCreate);
      }
    }
  } catch (error) {
    logger.error("src > mediators > courseMediator ");
    logger.error(error);
    throw new Error(error.message);
  }
};

module.exports = {
  createCourseContent,
};
