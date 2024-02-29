const { createUser,findUser,LoginUser,LogWithGoogle,AfterGoogleLoginRedirect } = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  return await createUser(userInfo);
};

const FindUser=async()=>{
  return await findUser();
}
const UserLogin=async(LoginData)=>{
  return await LoginUser(LoginData);

}

const googleLogin = async () => {
   return LogWithGoogle()
};
const googleClient=async(code)=>{
  return await AfterGoogleLoginRedirect(code);

}


module.exports = {
  registerUser,
  FindUser,
  UserLogin,
  googleLogin,
  googleClient,


  
};