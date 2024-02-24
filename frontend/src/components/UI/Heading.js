import React from "react";

const Heading = (props) =>{
    return(
        <div>
            <h1 className="font-dm-sans text-3xl font-medium leading-16 container mt-8">{props.heading}</h1>
        </div>
    )
}

export default Heading;