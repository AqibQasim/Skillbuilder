const { fetchAllInstructor, instructorCreate, findByFilter } = require("../repositories/instructorRepository");
const { findAllCourses, findAllCoursesByInst } = require("../repositories/courseRepository");
const { logger } = require("../../logger");
const { findUserById } = require("./userService");
const { skillsInstuctorCreate } = require("./instructorSkillService");
const { educationInstuctorCreate } = require("./instructorEducationService");
const { uploadSingle } = require("../mediators/s3Mediator");
const { updateInstructor } = require('../repositories/instructorRepository');
// const { logger } = require("../../logger");
const { oauth2Client } = require('../../Infrastructure/youtubeConfig');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// const { uploadVideoToYT } = require("../controllers/ytAPIControllers");

const createNewInstructor = async (instructorData, filePath) => {
  try {
    const { id, title, description, experience, specialization, tags, entity, qualifications, skills, video_url } = instructorData;
    const user = await findUserById(id);
    
    if (!user) {
      throw new Error("user not exist");
    }
    
    const instructorPayload = {
      id,
      experience,
      specialization,
      created_at: new Date(),
    };

    const isInstructorExist = await findByFilter({ where: { id: id } });
    if (isInstructorExist) {
      throw new Error("Instructor already Exist");
    }

      await instructorCreate({ ...instructorPayload, video_url});
      await skillsInstuctorCreate(skills, id);
      await educationInstuctorCreate(qualifications, id);
    // }
  } catch (error) {
    console.log("message:", error)
    throw Error(error);
  }
};

const getInstructors = async () => {
  try {
    logger.info("src > instructorServices > getAllInstructor");
    const InstructorReceive = await fetchAllInstructor();
    return InstructorReceive;
  } catch (error) {
    throw error;
  }
};

const getInstructorById = async (id) => {
  try {
    logger.info("src > instructorServices > getInstructorById");
    const InstructorReceive = await findByFilter({ where: { id: id } });
    return InstructorReceive;
  } catch (error) {
    throw new Error(error);
  }
};

const getCoursesByInstService = async (id) => {
  try {
    const InstructorReceive = await findAllCoursesByInst(
      {
        where: {
          instructor_id: id
        }
      }
    );
    return InstructorReceive;
  } catch (e) {
    throw new Error(error);
  }
}

const uploadVideoToYT = async (instructorId, videoFilePath) => {
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
          description: "Describes about what instructor is all about, share details about his/her years of experience with you!",
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
    // fastify.log.info('Video uploaded:', response.data);

    if (instructorId && videoId) {
      const updatedInstructor = await updateInstructor(instructorId, videoUrl);
      console.log('instructor', updatedInstructor);
    }
    return {
      message: 'The introductory video has been successfully posted.',
      video_url : videoUrl  
    }}
    catch (e){
      console.log("ERR while uploading:",e);
      return e;
    }
}

module.exports = {
  getInstructors,
  createNewInstructor,
  getInstructorById,
  getCoursesByInstService,
  uploadVideoToYT
};
