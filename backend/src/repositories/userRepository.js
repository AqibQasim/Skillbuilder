const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const userRepository = dataSource.getRepository("User");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");
const { base64_decode } = require("../utils/base64_decode");

const createUser = async (userInfo) => {
  logger.info(["src > repository > userRepository > ", userInfo]);
  try {
    const userCreate = userRepository.create(userInfo);
    const result = await userRepository.save(userCreate);
    logger.info(["user created", result]);
    return result;
  } catch (error) {
    logger.error("Error while creating user:", error);
    throw error;
  }
};

const readAllUser = async () => {
  logger.info(["src > repository > userRepository > findAllUser"]);
  try {
    const users = await userRepository.find();
    return users ? users : null;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const findUser = async (filter) => {
  logger.info(["src > repository > userRepository > findUser"]);
  try {
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOne({
      where: filter,
    });
    return user ? user : null;
  } catch (error) {
    console.log("Error fetching users:", error);
    throw error;
  }
};

const findOneUser = async (id) => {
  console.log("id in find one user method:", id);
  //try {
  const userRepository = dataSource.getRepository("User");
  if (id === null) {
    return null;
  }
  const user = await userRepository
    .createQueryBuilder("user")
    .where("user.id= :id",{id})
    .select([
      "profile",
      "first_name",
      "last_name",
      "email",
      "profession",
      "location",
      "is_active",
      "role",
      "source"
    ])
    .getOne();

  if (!user) {
    return null;
  }
  profession;

  const coursesRepository = dataSource.getRepository("Course");
  const courses = await coursesRepository.find();

  const enrolled_courses_by_student = [];

  if (courses && courses.length > 0) {
    courses.forEach((course) => {
      const enrolledCustomers = course.enrolled_customers;

      if (enrolledCustomers && enrolledCustomers.length > 0) {
        enrolledCustomers.forEach((student) => {
          console.log(student);
          if (student.student_id === parseInt(id)) {
            enrolled_courses_by_student.push({
              id: course.id,
              title: course.title,
              learning_outcomes: course.learning_outcomes,
              image: course.image,
              amount: course.amount,
              discount: course.discount,
              rating: course.rating,
            });
          }
        });
      }
    });
  }

  return { ...user, enrolled_courses_by_student };
};

const updateUserByEmail = async (email, newData) => {
  try {
    console.log("email", email);
    console.log("password: ", newData);

    const user = await userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return {
        status: false,
        message: "Email is incorrect",
      };
    } else {
      const passwordMatch = await bcrypt.compare(
        newData.current_password,
        user?.password
      );

      if (!passwordMatch) {
        return {
          status: false,
          message: "Password does not match",
        };
      } else {
        user.password = await bcrypt.hash(newData.new_password, 10);
        let updatedUser = await userRepository.save(user);
        return {
          status: true,
          message: "Password updated successfully",
          userData: updatedUser,
        };
      }
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

const updateUserById = async (id, payload) => {
  try {
    console.log("id", id);
    console.log("payload: ", payload);
    const user = await userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw Error("User not found");
    }
    const prevImage = user?.profile;
    let randomFileName = null;
    let update = null;
    if (payload?.profile?.image != null) {
      randomFileName = uuid.v4() + "." + payload.profile.extension;
      const targetDir = path.join(process.cwd(), "media", "images", "profile");
      base64_decode(payload.profile.image, randomFileName, targetDir);
      update = userRepository.merge(user, {
        ...payload,
        profile: randomFileName,
      });
    } else {
      update = userRepository.merge(user, {
        ...payload,
        profile: prevImage,
      });
    }

    let updated = userRepository.save(update);
    console.log("updated data: ", update);
    if (update) {
      return {
        status: true,
        message: "Profile updated successfully",
        data: update,
      };
    } else {
      throw new Error("Profile not updated");
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

const UserContact = async (userInfo) => {
  const userRepository = dataSource.getRepository("Contact_us");
  console.log("User REpo", userRepository);

  try {
    const user = userRepository.create(userInfo);
    console.log("Users", user);
    const savedUser = await userRepository.save(user);
    return savedUser;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
};

const setUserStatusRepository = async (
  requestedUser,
  enrolledStudents,
  id,
  status,
  status_desc
) => {
  const userExist = await userRepository.findOne({
    where: { id: id },
  });

  if (!userExist) {
    return "No such student exists!";
  }

  enrolledStudents.forEach((stud) => {
    console.log("[student]:", stud);
    if (stud?.id === id) {
      requestedUser = stud;
    }
  });

  if (!requestedUser) {
    console.log("[REQUESTED USER IS NOT ENROLLED IN ANY COURSE]");
    return "[REQUESTED USER IS NOT ENROLLED IN ANY COURSE]";
  } else {
    console.log(
      "[REQUESTED USER THAT IS ENROLLED IN A COURSE]:",
      requestedUser
    );
    Object.assign(userExist, { status: status, status_desc: status_desc });

    const updatedCourse = await userRepository.save(userExist);
    console.log("[UPDATED COURSE]:", updatedCourse);
    return "[UPDATED COURSE]:", updatedCourse;
  }
};

module.exports = {
  createUser,
  readAllUser,
  findUser,
  updateUserByEmail,
  updateUserById,
  UserContact,
  findOneUser,
  setUserStatusRepository,
};
