import React from "react";

const CourseInner = (props) =>{
    return(
        <div>
      <div className="max-w-md mx-auto overflow-hidden shadow-md bg-white rounded-md container">
      {/* Product Image */}
      <img src={props.src} alt="Product" className="w-full h-48 object-cover rounded-lg mt-2" />

      <div className="p-4">
        {/* Ratings */}
        <div className="flex items-center mb-2">
            {props.rating}
          <span className="text-yellow-500">&#9733;</span>
          <span className="text-yellow-500">&#9733;</span>
          <span className="text-yellow-500">&#9733;</span>
          <span className="text-gray-400">&#9733;</span>
          <span className="text-gray-400">&#9733;</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">{props.title}</h2>

        {/* Description */}
        <p className="text-gray-600 mb-4">{props.description}</p>

        {/* Price and Add to Cart Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600 mr-2">{props.price} $</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add to Cart</button>
        </div>
      </div>
    </div>
   </div>
    )
}
export default CourseInner;