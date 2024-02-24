import React from "react";
import Hero from "../../../assets/AboutHero.png";

const Main = () =>{
    return(
        <div className="bg-white">
    <div className="relative mt-[10%] flex items-center container h-[50%]" id="Overview">
    {/* Left Section */}
    <div className="relative z-10 w-full md:w-1/2 text-black sm:w-[1/1] text-left xsm:text-center">
        {/* Content */}
        <h1 className="text-4xl font-bold mb-4 md:w-4/5">Your success is our <span className="text-blue-600">Motivation</span></h1>
            <p className={`mb-8 md:w-4/5 text-md font-normal text-gray-600 leading-7 xsm:text-center md:text-left`}>
                At Skillbuilder your success is more than a goal; it's our constant inspiration. We're here to support, guide, and celebrate every step of your learning journey
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4">
                <h2 className="text-2xl font-bold">10+</h2>
                <p className="text-sm">Years Experience</p>
            </div>
            <div className="p-4">
                <h2 className="text-2xl font-bold">50+</h2>
                <p className="text-sm">Running Courses</p>
            </div>
            <div className="p-4">
                <h2 className="text-2xl font-bold">19k</h2>
                <p className="text-sm">Positive Reviews</p>
            </div>
            <div className="p-4">
                <h2 className="text-2xl font-bold">20k</h2>
                <p className="text-sm">Trusted Students</p>
            </div>
            </div>
        </div>
        {/* Right Section (visible on all screens) */}
        <div className="relative z-10 w-full md:w-1/2 text-black hidden md:block">
            <div className="relative z-20 flex flex-col items-start">
                <img src={Hero} className="w-4/5 ml-20" />
            </div>
        </div>
        </div>
        </div>
    )
}
export default Main;