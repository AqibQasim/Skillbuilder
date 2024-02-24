import React from "react";

import googleicon from "../../assets/google.png";
import facebookicon from "../../assets/facebook.png";
import { Link } from "react-router-dom";

const Signup = () =>{
    return(
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
        <p className="text-center text-gray-600">Start  your learning journey with us </p>
        {/* Form */}
        <form>
          {/* Full Name */}
          <div className="mb-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="mt-1 p-2 border border-gray-300 rounded-full w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-2">
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
          <div className="mb-2">
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

          {/* Confirm Password */}
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 p-2 border border-gray-300 rounded-full w-full"
              required
            />
          </div>

          {/* Agree to Terms Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" required />
              <span className="ml-2 text-sm font-semibold text-black">
                I agree to all Terms, Privacy Policy, and Fees
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <div className="mb-4">
            <Link to="/login"><button
              type="submit"
              className="w-full bg-blue-700 text-white p-2 rounded-full hover:bg-blue-600"
            >
            Sign Up
            </button></Link>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>

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
      </div>
    </div>
    )
}
export default Signup;