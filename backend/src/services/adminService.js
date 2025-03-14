const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const bcrypt = require("bcrypt");

const adminRepository = dataSource.getRepository("Admin");

const createAdmin = async (adminInfo) => {
  logger.info(["src > repository > adminRepository > createAdmin", adminInfo]);
  try {
    // Hash password before saving
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminInfo.password, saltRounds);

    const adminToCreate = adminRepository.create({
      ...adminInfo,
      password: hashedPassword,
    });

    const result = await adminRepository.save(adminToCreate);
    logger.info(["admin created", { ...result, password: undefined }]);

    // Remove password from response
    delete result.password;
    return result;
  } catch (error) {
    logger.error("Error while creating admin:", error);
    throw error;
  }
};

const findAdminByUsername = async (username) => {
  logger.info(["src > repository > adminRepository > findAdminByUsername"]);
  try {
    const admin = await adminRepository.findOne({
      where: { username },
    });
    return admin || null;
  } catch (error) {
    logger.error("Error fetching admin:", error);
    throw error;
  }
};

const verifyAdminCredentials = async (username, password) => {
  logger.info(["src > repository > adminRepository > verifyAdminCredentials"]);
  try {
    const admin = await findAdminByUsername(username);
    if (!admin) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return null;
    }

    // Remove password from response
    delete admin.password;
    return admin;
  } catch (error) {
    logger.error("Error verifying admin credentials:", error);
    throw error;
  }
};

const getAllAdmins = async () => {
  logger.info(["src > repository > adminRepository > getAllAdmins"]);
  try {
    const admins = await adminRepository.find();
    // Remove passwords from response
    admins.forEach((admin) => delete admin.password);
    return admins;
  } catch (error) {
    logger.error("Error fetching all admins:", error);
    throw error;
  }
};

module.exports = {
  createAdmin,
  findAdminByUsername,
  verifyAdminCredentials,
  getAllAdmins,
};
