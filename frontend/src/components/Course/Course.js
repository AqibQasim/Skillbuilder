import React from "react";
import Navbar from "../Home/Navbar/Navbar";
import AllProgram from "./AllPrograms/AllProgram";
import HighlyRated from "./HighlyRated/HighlyRated";
import RecentlyUpdated from "./RecentlyUpdated/RecentlyUpdated";
import Footer from "../Home/Footer/Footer";

const Course = () =>{
    return(
        <div>
            <Navbar />
            <AllProgram />
            <HighlyRated />
            <RecentlyUpdated />
            <Footer />
        </div>
    )
}
export default Course;