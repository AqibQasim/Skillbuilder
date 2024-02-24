import React from "react";

const SliderContent = (props) =>{
    return(
    <div className="relative h-screen flex items-center container h-[50%]" id="Overview">
    {/* Left Section */}
    <div className="relative z-10 w-full md:w-1/2 text-black sm:w-[1/1] text-left xsm:text-center">
        {/* Content */}
        <h1 className="text-4xl font-bold mb-4 md:w-4/5">{props.title} <span className="text-blue-600">{props.subtitle}</span></h1>
            <p className={`mb-8 md:w-4/5 text-lg font-normal leading-7 xsm:text-center md:text-left`}>
                {props.description}
            </p>
            <button type="button" className="text-white bg-blue-500 hover:bg-secondary-800 focus:ring-4 focus:outline-none focus:ring-secondary-300 font-medium rounded-lg text-lg px-8 py-2 text-center dark:bg-secondary-600 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800 hover:bg-primary hover:text-secondary transition-all duration-500">{props.button}</button>
        </div>
        {/* Right Section (visible on all screens) */}
        <div className="relative z-10 w-full md:w-1/2 text-black hidden md:block">
            <div className="relative z-20 flex flex-col items-start">
                <img src={props.src} className="w-4/5 ml-20" />
            </div>
        </div>
        </div>
    )
}
export default SliderContent;