const {
  fetchuserPurchasedCourses,
  fetchPurchasedCourses,
} = require("../repositories/purchasedCourseRepository");

const getpurchasedCourse = async () => {
  const content = await fetchPurchasedCourses();
  return content;
};

const userPurchasedCourse = async (userId) => {
  const content = await fetchuserPurchasedCourses(userId);
  console.log("service contennnnnnnnt", content);
  for (let i = 0; i < content.length; i++) {
    const { course_length, watched_length, ...rest } = content[i];
    const percentile = (watched_length * 100) / course_length;
    console.log(course_length, watched_length);
    content[i] = { ...rest, percentile };
    console.log(content[i]);
  }
  return content;
};

module.exports = {
  userPurchasedCourse,
  getpurchasedCourse,
};
