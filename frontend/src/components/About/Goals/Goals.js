import React from "react";
import Heading from "../../UI/Heading";

import goal1 from "../../../assets/goal1.png";
import goal2 from "../../../assets/goal2.png";
import goal3 from "../../../assets/goal3.png";
import goal4 from "../../../assets/goal4.png";
import goal5 from "../../../assets/goal5.png";

const Goals = () =>{
    return(
        <div>
            <Heading heading = "Our Goals"/>
            <div className="flex flex-col md:flex-row">
            {/* Section 1 */}
            <div className="md:w-1/3 p-4 flex items-center justify-center">
                <div>
                    <img src={goal1} />
                    <h5 className="text-center mt-2">Expanding Course Offerings</h5>
                </div>
            </div>

            {/* Section 2 */}
            <div className="md:w-1/3 p-4 flex items-center justify-center">
                <div>
                    <img src={goal2} />
                    <h5 className="text-center mt-2">Enhancing User Engagement</h5>
                </div>
            </div>

            {/* Section 3 */}
            <div className="md:w-1/3 p-4 flex items-center justify-center">
                <div>
                    <img src={goal3} />
                    <h5 className="text-center mt-2">Global Reach and Accessibility</h5>
                </div>
            </div>
            </div>
            <div className="flex flex-col md:flex-row">
            {/* Section 1 */}
            <div className="md:w-1/2 p-4 flex items-center justify-center">
                <div>
                    <img src={goal4} />
                    <h5 className="text-center mt-2">Technological Innovation</h5>
                </div>
            </div>

            {/* Section 2 */}
            <div className="md:w-1/2 p-4 flex items-center justify-center">
                <div>
                    <img src={goal5} />
                    <h5 className="text-center mt-2">Community Impact Initiatives</h5>
                </div>
            </div>
            </div>
            </div>
    )
}
export default Goals;