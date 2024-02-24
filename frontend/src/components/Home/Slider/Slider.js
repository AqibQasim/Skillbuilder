import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import "swiper/css/free-mode";

import { FreeMode, Autoplay } from "swiper/modules";

import './Slider.css';

import { Pagination } from 'swiper/modules';
import SliderContent from './Slidercontent';

import logo2 from "../../../assets/heroImage.png";
import logo3 from "../../../assets/HeroImage2.png";
import logo4 from "../../../assets/HeroImage3.png";
import logo5 from "../../../assets/HeroImage4.png";

const Slider =() => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Autoplay , Pagination]}
        className="mySwiper shadow-xl"
        autoplay={{
          delay: 2000, // Adjust the delay in milliseconds as needed
          disableOnInteraction: false, // Allow autoplay to continue after user interactions
        }}
        >
        <SwiperSlide>
            <SliderContent title = "Empower Your Journey with" subtitle = "Skill Builder" description = "We're thrilled to have you here. Feel free to navigate around and make yourself at home. We hope you find inspiration, valuable information, and a sense of belonging during your visit" button= "Get Started" src={logo2} />
        </SwiperSlide>
        <SwiperSlide>
            <SliderContent title = "Learn" subtitle = "API Automation" description = "Dive into the world of API automation with Skill Builder's exclusive course and unlock the potential to reshape the future of software development" button= "Enroll Now" src={logo3}/>
        </SwiperSlide>
        <SwiperSlide>
          <SliderContent title = "Boost your career with the in-demand skills" description = "Join us on a transformative learning journey with our team of seasoned experts who are passionate about demystifying the intricacies of API automation." src={logo4}/>
        </SwiperSlide>
        <SwiperSlide>
          <SliderContent title = "Boost your career with the in-demand skills" description = "Join us on a transformative learning journey with our team of seasoned experts who are passionate about demystifying the intricacies of API automation." src={logo5}/>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default Slider;