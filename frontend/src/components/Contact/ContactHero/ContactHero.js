import React from "react";
import ContactHero1 from "../../../assets/ContactHero.png";

const ContactHero = () =>{
    return(
        <div className="bg-white  mt-[12%]">
    <div className="relative flex items-center container h-[50%]" id="Overview">
    {/* Left Section */}
    <div className="relative z-10 w-full md:w-1/2 text-black sm:w-[1/1] text-left xsm:text-center">
        {/* Content */}
        <h1 className="text-4xl font-bold mb-4 md:w-4/5">Contact us</h1>
        <p className={`mb-8 md:w-4/5 text-md font-normal text-gray-600 leading-7 xsm:text-center md:text-left`}>
            Connecting with us is easy! For any questions, concerns, or suggestions, feel free to reach out to our dedicated support team
        </p>
    </div>
    {/* Right Section (visible on all screens) */}
    <div className="relative z-10 w-full md:w-1/2 text-black hidden md:block">
        <div className="relative z-20 flex flex-col items-start">
            <img src={ContactHero1} className="w-4/5 ml-20" />
        </div>
    </div>
    </div>
    </div>
    )
}

export default ContactHero;