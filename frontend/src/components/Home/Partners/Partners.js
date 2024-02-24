import React from "react";
import "../Skills/Skills.css";
import course1 from "../../../assets/Course1.svg";
import course2 from "../../../assets/Course2.svg";
import course3 from "../../../assets/Course3.svg";
import course4 from "../../../assets/Course4.svg";
import course5 from "../../../assets/Course5.svg";
import course6 from "../../../assets/Course6.svg";
import Heading from "../../UI/Heading";

const Partners = () =>{
    return(
        <div className="mt-16">
            <Heading heading= "You can also buy our course from"/>
            <div className="container mx-auto border w-[90%] bg-white rounded-tl-br bg-gray-300 p-4 shadow-xl mt-12">
            <div className="logos mx-auto w-[80%]">
            <div className="logos-slide flex gap-x-16">
                <img src={course1} alt="clients" className="img"/>
                <img src={course2} alt="clients" className="img"/>
                <img src={course3} alt="clients" className="img"/>
                <img src={course4} alt="clients" className="img"/>
                <img src={course5} alt="clients" className="img"/>
                <img src={course6} alt="clients" className="img"/>
            </div>
            </div>
            </div>
        </div>
    )
}
export default Partners;