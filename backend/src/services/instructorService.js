const {
  fetchAllInstructor,
  instructorCreate,
  findByFilter,
  findByFilterTwo,
  findInstructorById,
} = require("../repositories/instructorRepository");
const {
  findAllCourses,
  findAllCoursesByInst,
  updateCourse,
} = require("../repositories/courseRepository");
const { findUser } = require('../repositories/userRepository')
const { logger } = require("../../logger");

const { uploadSingle } = require("../mediators/s3Mediator");
const { updateInstructor } = require("../repositories/instructorRepository");
// const { logger } = require("../../logger");
const { oauth2Client } = require("../../Infrastructure/youtubeConfig");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const instructor = require("../entities/instructor");
const {
  saveAccountRegId,
  checkIfAccounRegIdExists,
} = require("../repositories/stripeAccountRepository");
const dataSource = require("../../Infrastructure/postgres");

const getinstructor = async () => {
  try {
    const data = await dataSource.getRepository("Instructor").find({
      relations: ["user"],
      select: {
        id: true,
        user: {
          first_name: true,
          last_name: true,
          email: true,
          location: true,
        },
      },
    });

    console.log(data);
    return data;
  } catch (error) {
    console.log("This is the error:", error);
  }
};

// const { uploadVideoToYT } = require("../controllers/ytAPIControllers");

const createNewInstructor = async (instructorData, filePath) => {
  try {
    const {
      id,
      user_id,
      title,
      description,
      experience,
      specialization,
      tags,
      entity,
      qualifications,
      skills,
      video_url,
    } = instructorData;
    // const user = await findUserById(id);
    const filter = {
      id: user_id,
    };
    const result = await findUser(filter);

    if (!result) {
      return {
        message : "User doesn't exist"
      }
    }

    const instructorPayload = {
      user_id,
      experience,
      specialization,
      user_id,
      skills,
      qualifications,
      created_at: new Date(),
    };

    const isInstructorExist = await findInstructorById(user_id);
    console.log("///////////////////////////////////////////////",isInstructorExist)
    if (isInstructorExist) {
      return{
        status: 400,
        message:"instructor already exists"
      }
    }

    const isInstructorCreated= await instructorCreate({ ...instructorPayload, video_url });
    if(isInstructorCreated){
      return{
        status: 200,
        message:"instructor created successfully"
      }
    }
    // }
  } catch (error) {
    console.log("message:", error);
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
    const InstructorReceive = await findByFilter({id: id });
    return InstructorReceive;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneInstByUserService = async (id) => {
  try {
    logger.info("src > instructorServices > getInstructorById");
    const InstructorReceive = await findByFilterTwo({ where: { user_id: id } });
    return InstructorReceive;
  } catch (error) {
    throw new Error(error);
  }
};

const getCoursesByInstService = async (id) => {
  try {
    const InstructorReceive = await findAllCoursesByInst({
      where: {
        instructor_id: id,
      },
    });
    return InstructorReceive;
  } catch (e) {
    throw new Error(error);
  }
};

const stripeAccRegisterService = async ({
  user_id,
  instructor_id,
  account_reg_id,
}) => {
  try {
    const payload = { user_id, instructor_id, account_reg_id };

    const InstructorReceive = await findByFilter({
      where: { id: instructor_id },
    });
    if (InstructorReceive) {
      const checkAlreadyExists = await checkIfAccounRegIdExists(instructor_id);
      if (checkAlreadyExists?.length === 0) {
        const res = await saveAccountRegId(payload);
        return {
          message: res,
          status: 200,
        };
      } else {
        return {
          message: "The record for this instructor already exists",
          status: 400,
        };
      }
    } else {
      return {
        message: "Instructor not found",
        status: 400,
      };
    }
  } catch (err) {
    console.log("Error while saving the registration id in db:", err);
    return {
      message: "Failed saving the registration id in db",
      status: 500,
    };
  }
};

const checkPaymentRecordService = async ({ id }) => {
  try {
    const InstructorReceive = await findByFilter({
      id
    });
    if (InstructorReceive && InstructorReceive?.id) {
      const res = await checkIfAccounRegIdExists(id);
      if (res) {
        return {
          message: res,
          status: 200,
        };
      } else {
        return {
          message: "Stripe Account Registration not found.",
          status: 400,
        };
      }
    } else {
      return {
        message: "Instructor not found.",
        status: 400,
      };
    }
  } catch (err) {
    console.log("Error while fetching the registration id in db:", err);
    return {
      message: "Failed fetching the registration id in db",
      status: 500,
    };
  }
};

const uploadVideoToYT = async (instructorId, videoFilePath, user_role) => {
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
          title: "Instructor Introduction",
          description:
            "Describes about what instructor is all about, share details about his/her years of experience with you!",
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

    console.log("youtube repsonse:", response);

    const videoId = response?.data?.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    // fastify.log.info('Video uploaded:', response.data);

    // if (user_role === 'instructor') {
    //   if (instructorId && videoId) {
    //     const updatedInstructor = await updateInstructor(instructorId, videoUrl);
    //     console.log('instructor', updatedInstructor);
    //   }
    //   else if (user_role === 'course') {
    //     if (courseId && videoId) {
    const updatedInstructor = await updateInstructor(instructorId, videoUrl);
    console.log("instructor:", updatedInstructor);
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

module.exports = {
  getInstructors,
  createNewInstructor,
  getInstructorById,
  getCoursesByInstService,
  uploadVideoToYT,
  stripeAccRegisterService,
  checkPaymentRecordService,
  getOneInstByUserService,
  getinstructor
};
