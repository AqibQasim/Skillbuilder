const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const userRepository = dataSource.getRepository("User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');



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
      where: filter
    });
    return user ? user : null;
  } catch (error) {
    console.log("Error fetching users:", error);
    throw error;
  }
};

const findOneUser = async (id) => {
  console.log("id in find one user method:", id);
  try {
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOne({
      where: { id: id }
    });

    if (!user) {
      return null;
    }

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
                title: course.title,
                learning_outcomes: course.learning_outcomes,
                image: course.image,
                amount: course.amount,
                rating: course.rating
              });
            }
          });
        }
      });
    }

    return { ...user, enrolled_courses_by_student };
  } catch (err) {
    console.log("ERR:", err);
    return null;
  }
};

const AddSSOUser = async (data) => {
  console.log("data in AddSSOUser method:", data);
  try {
    const userRepository = dataSource.getRepository("User");

    const user = userRepository.create({
      first_name: data.fname,
      last_name: data.lname,
      email: data.email,
      is_SSOUser: true,
    });

    const savedUser = await userRepository.save(user);
    console.log(savedUser);
    if (savedUser) {
      // JWT payload
      const payload = {
        id: savedUser.id,             // Include the user's ID
        email: savedUser.email,       // Include the user's email
        // picture: data.picture         // Include the user's picture (if available)
      };

      // Secret key for signing the token (you should store this in an environment variable)
      const secretKey = process.env.JWT_SECRET;

      // Options for token expiration and algorithm
      const options = {
        expiresIn: '35h',             // Token expiration time
        algorithm: 'HS256'           // Algorithm for signing the token
      };

      // Sign the JWT
      const token = jwt.sign(payload, secretKey, options);
      
      // Return the signed token
      return { message: token,user, status : 200 };
    } else {
      return {message: "User Not Found", status : 404};
    }
  } catch (err) {
    console.log("ERR:", err);
    return {message: "Internal Server Error", status : 500};
  }
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
        message: "Email is incorrect"
      }
    } else {
      const passwordMatch = await bcrypt.compare(newData.current_password, user?.password);

      if (!passwordMatch) {
        return {
          status: false,
          message: "Password does not match"
        }
      } else {
        user.password = await bcrypt.hash(newData.new_password, 10);
        //let update = await userRepository.merge(user, {password: new_password});
        let updatedUser = await userRepository.save(user);
        return {
          status: true,
          message: "Password updated successfully",
          userData: updatedUser
        };
      }

    }

    // let update = await userRepository.merge(user, newData);
    // let updatedUser = await userRepository.save(update);
    // return updatedUser;
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

    let update = userRepository.merge(user, payload);
    let updated = userRepository.save(update);
    console.log("updated data: ", update)
    if (update) {
      return {
        status: true,
        message: "Profile updated successfully",
        data: update
      }
    } else {
      throw new Error("Profile not updated");
    }
    // let update = await userRepository.merge(user, payload);
    // let updatedUser = await userRepository.save(update);
    // return updatedUser;
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

const setUserStatusRepository = async (requestedUser, enrolledStudents, id, status, status_desc) => {
  const userExist = await userRepository.findOne({
    where: { id: id },
  });

  if (!userExist) {
    return 'No such student exists!';
  };

  enrolledStudents.forEach((stud) => {
    console.log("[student]:", stud);
    if (stud?.id === id) {
      requestedUser = stud
    }
  }); 

  if (!requestedUser) {
    console.log("[REQUESTED USER IS NOT ENROLLED IN ANY COURSE]");
    return "[REQUESTED USER IS NOT ENROLLED IN ANY COURSE]"
  } else {
    console.log("[REQUESTED USER THAT IS ENROLLED IN A COURSE]:", requestedUser);
    Object.assign(userExist, {status: status, status_desc: status_desc });

    const updatedCourse = await userRepository.save(userExist);
    console.log("[UPDATED COURSE]:", updatedCourse);
    return "[UPDATED COURSE]:", updatedCourse
  }
}


module.exports = {
  createUser,
  readAllUser,
  findUser,
  updateUserByEmail,
  updateUserById,
  UserContact,
  findOneUser,
  AddSSOUser,
  setUserStatusRepository
};
