const { logger } = require("../../logger");
const { createCourseContent } = require("../mediators/courseMediator");
const { uploadOnS3 } = require("../mediators/instructorMediator");
const { createCourse, findAllCourses, coursesRatingFunc, fetchCourseWithDetailsWithId, fetchAllRecentCourses, findOneCourse, updateCourse  } = require("../repositories/courseRepository");
const {getAllReviews} =  require("../repositories/courseReviewRepository.js");
const {saveReview} = require("../repositories/courseReviewRepository.js");
const { google } = require('googleapis');
const { oauth2Client } = require('../../Infrastructure/youtubeConfig');
const fs = require("fs");


const createCourseWithDetails = async (requestedData) => {
  try {
    const { instructor_id, title, creation_duration_hours, learning_outcomes, category, modulesCount, amount, image, modules, description, video_url } = requestedData;
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
      created_at: new Date(),
    };
    let courseBasics = await createCourse(courseBasicsPayload);
    console.log("courseBasics: ", courseBasics);
    // await createCourseContent(modules, courseBasics.id);
  } catch (error) {
    logger.error("src > services > courseService > error");
    logger.error(error);
    throw new Error(error);
  }
};


const uploadVideoToYT = async (courseId, videoFilePath) => {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: "Instructor Introduction",
          description: "Describes about what course is all about, details about what you will learn in this course!",
          tags: ["education"],
          categoryId: '27'
        },
        status: {
          privacyStatus: 'private'
        }
      },
      media: {
        body: fs.createReadStream(videoFilePath)
      },
      mediaType: 'video/*',
    },);

    console.log("youtube repsonse:", response);

    const videoId = response?.data?.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      if (courseId && videoId) {
        const updatedCourse = await updateCourse(courseId, videoUrl);
        console.log('course:', updatedCourse);
      }

    return {
      message: 'The introductory video has been successfully posted.',
      video_url: videoUrl
    }
  }
  catch (e) {
    console.log("ERR while uploading:", e);
    return e;
  }
}


const enrollInCourse = () => {
  try{

  } catch (err){
    console.log("Error ")
  }
}

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

const courseGetById = async (id) => {
  try {
    let filter = {
      where: {
        id: id,
      },
    };
    const result = await findOneCourse(filter);
    return result;
  } catch (error) {
    logger.error("src > services > courseService")
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
  try{
    const postReview = await saveReview(data);
    return postReview;
  } catch(e) {
    console.log("ERR:",e);
  }
};


const getReviewsService = async (id) => {
  try{
    const getReviews = await getAllReviews(id);
    return getReviews;
  } catch(e) {
    console.log("ERR:",e);
  }
}

module.exports = {
  createCourseWithDetails,
  getAllCourses,
  courseGetById,
  coursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
  postReviewService,
  getReviewsService,
  uploadVideoToYT
};
