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

    // if (instructor) {
    //   // Removing password from instructor
    //   const { password: instructorPassword, ...instructorWithoutPassword } =
    //     instructor;

    //   // Removing password from users in reviews
    //   const reviewsWithUsersWithoutPassword =
    //     instructorWithoutPassword.reviews.map((review) => {
    //       const {
    //         user: { password: userPassword, ...userWithoutPassword },
    //         ...reviewWithoutUserPassword
    //       } = review;
    //       return { ...reviewWithoutUserPassword, user: userWithoutPassword };
    //     });

    //   // Returning instructor object with reviews and users without passwords
    //   return {
    //     ...instructorWithoutPassword,
    //     reviews: reviewsWithUsersWithoutPassword,
    //   };
    // } else {
    //   throw new Error("Instructor not found");
    // }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching instructor with reviews and users");
  }
};

const ReadInstructors = async () => {
  try {
    // Fetch instructors from the repository
    const instructors = await readInstructors();

    // Remove password from each instructor object
    const instructorsWithoutPassword = instructors.map(
      ({ password, ...instructor }) => instructor
    );

    return instructorsWithoutPassword;
  } catch (error) {
    throw new Error("Error reading instructors");
  }
};

module.exports = { ReadInstructors, getInstructorWithReviewsAndUsers };
