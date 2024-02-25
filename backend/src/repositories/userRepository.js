const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookie = require('cookie');
const app=(cookie);




const createUser = async (userInfo) => {
  const userRepository = dataSource.getRepository("User");
  
  try {
    const { email } = userInfo;
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      return "User Already Exist With This Email";
    } else {
      const user = userRepository.create(userInfo);
      const savedUser = await userRepository.save(user);
      console.log("User created successfully:", savedUser);

      const Token= jwt.sign(
        {id: userInfo.id,email:email},
        'shhhh',//process.env
        {
          expiresIn:"2h"
        }
        )    
        userInfo.Token=Token;
        userInfo.password=undefined


      return {savedUser,Token};
    }
  } catch(error) {
    console.error("Error while creating user:", error);
    throw error;
  }
}


const findUser=async()=>{
  try{
  const userRepository = dataSource.getRepository("User");
  const user = await userRepository.find();
  return user;
  }
  catch(error){
    console.error("Error fetching users:", error);

    throw error
  }


}


const LoginUser = async (userInfo) => {
  const userRepository = dataSource.getRepository("User");
  try {
    const { email, password } = userInfo;
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (passwordMatch) {

        const Token= jwt.sign(
          {id: userInfo.id,email:email},
          'shhhh',//process.env
          {
            expiresIn:"2h"
          }
          )    
          userInfo.Token=Token;
          userInfo.password=undefined

          //cookie section
          const option = {
            headers: {
              'Set-Cookie': cookie.serialize('token', Token, {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
              }),
            },

          };
          const user = "User Login Successfully";

          return { user, Token, option };

      } else {
        return "Incorrect Password";
      }
    } else {
      return "User Does Not Exist";
    }


  } catch(error) {
    console.error("Error during login:", error);
    throw new Error("Login failed");
  }
}


module.exports = {
  createUser,
  findUser,
  LoginUser
};