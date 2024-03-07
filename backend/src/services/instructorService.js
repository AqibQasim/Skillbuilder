const {
  readInstructors,
  readInstructorWithReviews,
} = require("../repositories/instructorRepository");

const getInstructorWithReviewsAndUsers = async (instructorId) => {
  try {
    // Fetching the instructor details along with reviews
    const instructor = await readInstructorWithReviews(instructorId);
    console.log("Service Data", instructor);
    return instructor;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching instructor with reviews and users");
  }
};

const ReadInstructors = async () => {
  try {
    const instructors = await readInstructors();
    return instructors;
  } catch (error) {
    throw new Error("Error reading instructors");
  }
};

module.exports = { ReadInstructors, getInstructorWithReviewsAndUsers };
