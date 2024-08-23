const { logger } = require("../../logger");
const { createCourseContent } = require("../mediators/courseMediator");
const { uploadOnS3 } = require("../mediators/instructorMediator");
const {
  createCourse,
  findAllCourses,
  coursesRatingFunc,
  fetchCourseWithDetailsWithId,
  fetchAllRecentCourses,
  findOneCourse,
  updateCourse,
  updateCourseByFilter,
  setCourseStatusRepository,
  findOneCourseWithStudentID,
  findAllStudentCourses,
} = require("../repositories/courseRepository");
const { getAllReviews } = require("../repositories/courseReviewRepository.js");
const { saveReview } = require("../repositories/courseReviewRepository.js");
const { google } = require("googleapis");
const { oauth2Client } = require("../../Infrastructure/youtubeConfig");
const fs = require("fs");

const createCourseWithDetails = async (requestedData) => {
  try {
    const {
      instructor_id,
      title,
      creation_duration_hours,
      learning_outcomes,
      category,
      modulesCount,
      amount,
      image,
      modules,
      description,
      video_url,
      skills
    } = requestedData;
    const courseBasicsPayload = {
      instructor_id,
      title,
      creation_duration_hours,
      learning_outcomes,
      category,
      modulesCount,
      amount,
      description,
      video_url,
      discount: requestedData?.discount,
      charges: amount * 0.03,
      image: image,
      skills,
      created_at: new Date(),
    };
    let courseBasics = await createCourse(courseBasicsPayload);
    console.log("courseBasics: ", courseBasics);
    return courseBasics;
    // await createCourseContent(modules, courseBasics.id);
  } catch (error) {
    logger.error("src > services > courseService > error");
    logger.error(error);
    throw new Error(error);
  }
};

const setCourseStatusService = async ({
  course_id,
  status,
  reason,
  status_desc,
}) => {
  try {
    const result = await findOneCourse(course_id);
    if (result?.id) {
      const declineResult = await setCourseStatusRepository(
        course_id,
        status,
        reason,
        status_desc
      );
      console.log("[RESULT OF DECLINING]:", declineResult);
      return {
        message: declineResult,
        status: 200,
      };
    } else {
      console.log("[COURSE NOT FOUND]");
      return {
        message: "[COURSE NOT FOUND]",
        status: 400,
      };
    }
  } catch (err) {
    console.log("[SOME ERROR OCCURED WHILE DECLINING]:", err);
    return {
      message: "[SOME ERROR OCCURED WHILE DECLINING]",
      status: 500,
    };
  }
};

const uploadVideoToYT = async (courseId, videoFilePath) => {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "Instructor Introduction",
          description:
            "Describes about what course is all about, details about what you will learn in this course!",
          tags: ["education"],
          categoryId: "27",
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
      mediaType: "video/*",
    });

    const videoId = response?.data?.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return {
      message: "The introductory video has been successfully posted.",
      video_url: videoUrl,
    };
  } catch (e) {
    console.log("ERR while uploading:", e);
    return e;
  }
};

const enrollInCourse = () => {
  try {
  } catch (err) {
    console.log("Error ");
  }
};

const getAllCourses = async () => {
  try {
    logger.info("src > services > getAllCourses");
    const CoursesReceive = await findAllCourses();
    console.log(CoursesReceive);
    return CoursesReceive;
  } catch (error) {
    return error;
  }
};

const getAllStudentCourses= async()=>{
  try {
    logger.info("src > services > getAllCourses");
    const CoursesReceive = await findAllStudentCourses();
    console.log(CoursesReceive);
    return CoursesReceive;
  } catch (error) {
    return error;
  }
}

const uploadCourseVideoToYT = async (courseId, videoFilePath, user_role) => {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    console.log("video file path in service:", videoFilePath);

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "Course Introductory Video",
          description:
            "Describes about what course is all about, share details about course with you!",
          tags: ["education"],
          categoryId: "27",
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
      mediaType: "video/*",
    });

    console.log("youtube repsonse:", response);

    const videoId = response?.data?.id;
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    // fastify.log.info('Video uploaded:', response.data);

    // if (user_role === 'instructor') {
    //   if (instructorId && videoId) {
    //     const updatedInstructor = await updateInstructor(instructorId, videoUrl);
    //     console.log('instructor', updatedInstructor);
    //   }
    //   else if (user_role === 'course') {
    //     if (courseId && videoId) {
    const updatedCourse = await updateCourse(courseId, videoUrl);
    console.log("course", updatedCourse);
    //     }
    //   }
    // }
    return {
      message: "The introductory video has been successfully posted.",
      video_url: videoUrl,
    };
  } catch (e) {
    console.log("ERR while uploading:", e);
    return e;
  }
};

const courseGetById = async (id) => {
  try {
    const filter = "id"; // Assuming 'id' is the filter key

    // Pass both filter and id as course_id to findOneCourse
    //const result = await findOneCourse(filter, id);
    const result= await findOneCourseWithStudentID(id);

    if (!result) {
      console.log("Course not found");
      throw new Error("Course not found");
    }

    return result;
  } catch (error) {
    logger.error("src > services > courseService");
    logger.error(error);
    throw new Error(error.message);
  }
};

const coursesRatingService = async () => {
  logger.info("src > services > coursesRatingService");
  try {
    const CoursesRatingReceive = await coursesRatingFunc();

    return CoursesRatingReceive;
  } catch (error) {
    return error;
  }
};

const coursesDetailFunc = async (id) => {
  logger.info("Src > Services > coursesDetailFunc");
  try {
    const coursesDetailSave = await fetchCourseWithDetailsWithId(id);
    return coursesDetailSave;
  } catch (error) {
    return error;
  }
};

const recentCoursesFunc = async () => {
  logger.info("src > Services > recentCoursesFunc");
  try {
    const recentCoursesSave = await fetchAllRecentCourses();
    return recentCoursesSave;
  } catch (error) {
    return error;
  }
};

const postReviewService = async (data) => {
  try {
    const postReview = await saveReview(data);
    return postReview;
  } catch (e) {
    console.log("ERR:", e);
  }
};

const getReviewsService = async (id) => {
  try {
    const getReviews = await getAllReviews(id);
    return getReviews;
  } catch (e) {
    console.log("ERR:", e);
  }
};

const updateCoursePropertiesService = async ({ course_id, filter, value }) => {
  try {
    const check = await findOneCourse({
      id: course_id,
    });
    console.log("[COURSE FOUND]:", check);
    if (check) {
      const result = await updateCourseByFilter(course_id, filter, value);
      console.log("[UPDATED COURSE ENTRY]:", result);
      return {
        message: result,
        status: 200,
      };
    } else {
      console.log(
        "[ERR]:, Either there is no such course or it no longer exists."
      );
      return {
        message: "Either there is no such course or it no longer exists.",
        status: 400,
      };
    }
  } catch (err) {
    console.log("ERR:", err);
    return {
      message: `Couldn't update the course due to an error: ${err}`,
      status: 500,
    };
  }
};

module.exports = {
  createCourseWithDetails,
  getAllCourses,
  courseGetById,
  coursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
  postReviewService,
  getReviewsService,
  uploadCourseVideoToYT,
  uploadVideoToYT,
  updateCoursePropertiesService,
  setCourseStatusService,
  getAllStudentCourses
};
