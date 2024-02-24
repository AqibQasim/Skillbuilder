import React from "react";
import { Navigation } from "swiper/modules";
import Navbar from "../Home/Navbar/Navbar";
import SliderContent from "../Home/Slider/Slidercontent";
import Hero from "./Hero/Hero";
import Goals from "./Goals/Goals";
import Mission from "./Mission/Mission";
import Team from "./Team/Team";
import Footer from "../Home/Footer/Footer";

const About = () =>{
    return(
        <div>
            <Navbar />
            <Hero />
            <Goals />
            <Mission />
            <Team />
            <Footer />
        </div>
    )
}
export default About;