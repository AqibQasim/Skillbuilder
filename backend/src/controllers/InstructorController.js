const {
  getInstructors,
  getInstructorById,
  createNewInstructor,
  getCoursesByInstService,
  uploadVideoToYT,
  stripeAccRegisterService,
  checkPaymentRecordService,
  getinstructor,
  getOneInstByUserService,
} = require("../services/instructorService.js");
const { updateInstructor } = require("../repositories/instructorRepository");
const { logger } = require("../../logger");
const { oauth2Client } = require("../../Infrastructure/youtubeConfig");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");

//get instructor taha
const getInstructorsall = async (request, reply) => {
  try {
    const result = await getinstructor();
    reply.send({
      status: true,
      message: "retrieved data successfully ",
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const createInstructor = async (request, reply) => {
  try {
    logger.info("src > controllers > InstructorController > createInstructor");
    // const body = JSON.parse(request.body);
    logger.info(request?.body);
    const result= await createNewInstructor(request?.body);
    reply.send({
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    logger.error(error.message);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getAllInstructor = async (request, reply) => {
  logger.info("src > InstructorController > getAllInstructors ");
  try {
    const InstructorData = await getInstructors();
    if (InstructorData) {
      reply.code(200).send({
        status: true,
        message: "success",
        data: InstructorData,
      });
    } else {
      reply.code(400).send({
        status: false,
        message: "No Instructors found ",
      });
    }
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const instructorDetail = async (request, reply) => {
  logger.info("src > InstructorController > instructorDetail ", request.params);
  try {
    const {id} = request.params;
    console.log("data in request query:",id);
    const instructorData = await getInstructorById(id);
    console.log("Instructor Data:", instructorData);
    if (instructorData) {
      reply.code(200).send({
        status: true,
        data: instructorData,
      });
    } else {
      reply.code(404).send({
        status: false,
        message: "Instructor not found with the provided ID",
      });
    }
  } catch (error) {
    logger.error("Error occurred in instructor controller :", error.message);
    reply.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getOneInstByUser = async (request, reply) => {
  logger.info("src > InstructorController > instructorDetail ", request.params);
  try {
    const id = request.params.id;
    const instructorData = await getOneInstByUserService(id);
    console.log("Instructor Data:", instructorData);
    if (instructorData) {
      reply.code(200).send({
        status: true,
        data: instructorData,
      });
    } else {
      reply.code(404).send({
        status: false,
        message: "Instructor not found with the provided ID",
      });
    }
  } catch (error) {
    logger.error("Error occurred in instructor controller :", error.message);
    reply.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getCoursesByInstructor = async (request, reply) => {
  try {
    const id = request?.params?.id;
    const isUserAnInstructor= await getInstructorById(id);

    if(!isUserAnInstructor){
      reply.status(403).send({
        message:"this user is not an instructor"
      });
    }
    const allCoursesByInstructor = await getCoursesByInstService(id);
    reply.status(allCoursesByInstructor.status).send(allCoursesByInstructor);
  } catch (e) {
    console.log("ERR:", e);
    reply.status(500).send("Some server side exception has occured");
  }
};

const stripeAccRegister = async (request, reply) => {
  try {
    const { user_id, instructor_id, account_reg_id } = request?.body;
    const result = await stripeAccRegisterService({
      user_id,
      instructor_id,
      account_reg_id,
    });
    reply.status(result.status).send(result);
  } catch (e) {
    console.log("ERR:", e);
    reply.status(500).send("Some server side exception has occured");
  }
};

const checkPaymentRecord = async (request,reply) => {
  try {
    const { id } = request?.query;
    const result = await checkPaymentRecordService({ id });
    reply.status(result?.status).send(result);
  } catch (err) {
    console.log("ERR:", err);
    reply.status(500).send("Some server side exception has occured");
  }
};



async function uploadInstVideo(request, reply) {
  console.log("API IS HITTTINGGGGGGGG");
  const parts = await request.parts();
  let fieldsData = {};
  let videoFilePath = null;
  let instructorId = null;
  // console.log("video file path in controller:",videoFilePath);

  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  } 

  for await (const part of parts) {
    if (part.file) {
      if (part.fieldname === "video") {
        let filename = part.filename;
        let saveTo = path.join(uploadDir, filename);
        if (fs.existsSync(saveTo)) {
          const ext = path.extname(filename);
          const name = path.basename(filename, ext);
          filename = `${name}-${uuidv4()}${ext}`;
          saveTo = path.join(uploadDir, filename);
        }

        videoFilePath = saveTo;

        const writeStream = fs.createWriteStream(saveTo);
        for await (const chunk of part.file) {
          writeStream.write(chunk);
        }
        writeStream.end();

        console.log(`File [${part.fieldname}] Finished: ${videoFilePath}`);
        break;
      } 
    } else {
      if (part.fieldname === "instructorId") {
        console.log("part.fieldname:", part.fieldname);
        instructorId = part.value;
        console.log("instructor id is :", instructorId);
      }
    }
  }
  try {
    console.log("video file path in controller:", videoFilePath);
    const result = await uploadVideoToYT(instructorId, videoFilePath);
    console.log("result in upload inst video:", result);
    if (result?.video_url) {
      reply.status(200).send(result);
    }
  } catch (error) {
    console.log("Error uploading video", error);
  } finally {
    fs.unlink(videoFilePath, (err) => {
      console.log("video file path in finally block:", videoFilePath);
      if (err) {
        console.error("Failed to delete video file:", err);
      } else {
        console.log(`Successfully deleted video file: ${videoFilePath}`);
      }
    });
  }
}

module.exports = {
  createInstructor,
  getAllInstructor,
  instructorDetail,
  getCoursesByInstructor,
  uploadInstVideo,
  stripeAccRegister,
  checkPaymentRecord,
  getOneInstByUser,
  getInstructorsall
};
