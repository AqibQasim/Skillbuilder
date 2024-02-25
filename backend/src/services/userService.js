const { createUser,findUser,LoginUser } = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  return await createUser(userInfo);
};

const FindUser=async()=>{
  return await findUser();

}

const UserLogin=async(LoginData)=>{
  return await LoginUser(LoginData);

}

module.exports = {
  registerUser,
  FindUser,
  UserLogin
};