import React from "react";
import Navbar from './Navbar/Navbar';
import Slider from './Slider/Slider';
import Skills from './Skills/Skills';
import Partners from './Partners/Partners';
import Footer from './Footer/Footer';
import Course from './Courses/Course';

const Home = () =>{
    return(
    <div>
        <Navbar />
        <Slider />
        <Skills />
        <Course />
        <Partners />
        <Footer />
    </div>
    )
}
export default Home;