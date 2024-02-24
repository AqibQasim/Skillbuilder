import React from "react";
import "../../Home/Skills/Skills.css";
import team from "../../../assets/Teamemoji.png";
import Heading from "../../UI/Heading";
const Team = () =>{
    return(
        <div className="mt-16">
            <Heading heading= "Our Team Members"/>
            <div className="container mx-auto border w-[90%] bg-white rounded-tl-br bg-gray-300 p-4 shadow-xl mt-12">
            <div className="logos mx-auto w-[80%]">
            <div className="logos-slide flex gap-x-16">
                <div className="w-40 ">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Ahsan Khan</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div  className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Zubair Alam</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Ahsan Khan</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div className="w-40 text-center">
                    <img src={team} alt="clients" className="img h-40"/>
                    <h4>Ahsan Khan</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div className="w-40">
                    <img src={team} alt="clients" className="img h-40"/>
                    <h4>Ahsan Khan</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div className="w-40">
                    <img src={team} alt="clients" className="img h-40"/>
                    <h4>Ahsan Khan</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div  className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Zubair Alam</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div  className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Zubair Alam</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div  className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Zubair Alam</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div  className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Zubair Alam</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
                <div  className="w-40">
                    <img src={team} alt="clients" className="img"/>
                    <h4>Zubair Alam</h4>
                    <p>CTO Of SkillBuilder</p>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}
export default Team;