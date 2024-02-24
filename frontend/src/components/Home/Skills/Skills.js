import React from "react";
import Heading from "../../UI/Heading";
import skill1 from "../../../assets/Skill1.svg";
import skill2 from "../../../assets/Skill2.svg";
import skill3 from "../../../assets/Skill3.svg";
import skill4 from "../../../assets/Skill4.svg";
import skill5 from "../../../assets/Skill5.svg";
import skill6 from "../../../assets/Skill6.svg";

import "./Skills.css";

const Skills = () =>{
    return(
        <div className="mt-16">
            <Heading heading= "Our Top Skills At Your Disposal"/>
            <div className="container mx-auto border w-[90%] bg-white rounded-tl-br bg-gray-300 p-4 shadow-xl mt-12">
            <div className="logos mx-auto w-[80%]">
            <div className="logos-slide flex gap-x-16">
                <img src={skill1} alt="clients" className="img"/>
                <img src={skill2} alt="clients" className="img"/>
                <img src={skill3} alt="clients" className="img"/>
                <img src={skill4} alt="clients" className="img"/>
                <img src={skill5} alt="clients" className="img"/>
                <img src={skill6} alt="clients" className="img"/>
            </div>
            </div>
            </div>
        </div>
    )
}
export default Skills;