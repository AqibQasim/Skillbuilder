import React from "react";
import googleicon from "../../assets/google.png";
import facebookicon from "../../assets/facebook.png";

const Login = () =>{
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        {/* Form */}
        <form>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 border border-gray-300 rounded-full w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 border border-gray-300 rounded-full w-full"
              required
            />
          </div>
          <span className="ml-2 text-sm font-semibold text-blue-500">
                Forgot Password?
              </span>

          {/* Sign Up Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white p-2 rounded-full hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </form>

        {/* Social Logins */}
        <div className="mt-4">
          <p className="text-center text-gray-600 mb-2">Or continue with</p>
          <button className="bg-white bg-blue-700 border mb-4 w-full border-black text-black p-2 rounded-full hover:bg-red-600 flex items-center justify-center">
            <span className="mr-2">
                <img src={googleicon} width={24} height={24} alt="Google Icon" />
            </span>
            <span>Continue with Google</span>
           </button>

           <button className="bg-white bg-blue-700 border mb-4 w-full border-black text-black p-2 rounded-full hover:bg-red-600 flex items-center justify-center">
            <span className="mr-2">
                <img src={facebookicon} width={24} height={24} alt="Facebook Icon" />
            </span>
            <span>Continue with Facebook</span>
           </button>

        </div>
        <div className="text-center">
          <p>
            New to SkillBuilder
            <a href="/login" className="text-blue-600 hover:underline">
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
    )
}
export default Login;