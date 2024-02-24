import { property } from "cypress/types/lodash";
import React from "react";

const data = [
    {
        id : 1,
        title : "UI / UX Designing",
        description : "Learn UI/UX Designing a comprehensive journey where creativity meets functionality! Whether you're an aspiring designer or looking to enhance your skills.",
        button : "Add to Cart",
        image : ""
    },
    {
        id : 2,
        title : "API Automation",
        description : "Learn UI/UX Designing a comprehensive journey where creativity meets functionality! Whether you're an aspiring designer or looking to enhance your skills.",
        button : "Add to Cart",
        image : ""
    },
    {
        id : 3,
        title : "Web Development",
        description : "Learn UI/UX Designing a comprehensive journey where creativity meets functionality! Whether you're an aspiring designer or looking to enhance your skills.",
        button : "Add to Cart",
        image : ""
    },
]

const UnderCourseHero = () =>{
    return(
        <div>
            {data.map(course => <UnderCourseHero key={course.id} title = {course.title} description = {course.description} button ={course.button} src = {course.image}/> )}
        </div>
    )
}
export default UnderCourseHero;