import React from "react";

const ContactForm = () =>{
    return(
        <div className="pb-20 mt-20 ">
      <form className="container">
        {/* First Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-600">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="hearAbout" className="block text-sm font-medium text-gray-600">
              How did you hear about us?
            </label>
            <select
              id="hearAbout"
              name="hearAbout"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select...</option>
              <option value="socialMedia">Social Media</option>
              <option value="friend">Friend</option>
              <option value="advertisement">Advertisement</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    )
}
export default ContactForm;