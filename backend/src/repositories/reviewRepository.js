const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const fetchReviews = async (instructorId) => {
  try {
    const reviewRepository = dataSource.getRepository("Review");
    logger.info("Review repooo ",reviewRepository);
    const instructorReviews = await reviewRepository.find({ where: { instructor_id:instructorId } });
    logger.info("Review Repo ",instructorReviews)

    return instructorReviews;
  } catch (error) {
    throw new Error('Error fetching reviews for instructor');
  }
};

module.exports = {
  fetchReviews,
};