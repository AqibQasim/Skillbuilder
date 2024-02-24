import React from "react";
import Heading from "../../UI/Heading";
import CourseInner from "./CourseInner";
import course1 from "../../../assets/Course1.png";

const data = [
    {
        id: 1,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
    {
        id: 2,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
    {
        id: 3,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
    {
        id: 4,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
    {
        id: 5,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
    {
        id: 6,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
    {
        id: 7,
        title: "Software Testing",
        description: "Equipping you with essential skills",
        price: 250,
        rating: 4.9,
        src : course1,
    },
]
const Course = () =>{
    return(
        <div>
            <Heading heading = "Find the course that fits you"/>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-8 container">
                {data.map(course => <CourseInner key={course.id} title = {course.title} description = {course.description} price = {course.price} rating = {course.rating} src = {course.src}/>)}
            </div>
        </div>
    )
}
export default Course;