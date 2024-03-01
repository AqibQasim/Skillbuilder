const { fetchReviews} = require("../repositories/reviewRepository");

const getReviews = async () => {
  return await fetchReviews();
};

module.exports = {
    getReviews,
};